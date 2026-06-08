import { parseStringPromise } from 'xml2js';
import { getDbPool } from './db';

export interface TallyStockItem {
  itemName: string;
  closingBalance: number;
  baseUnits: string;
}

function asArray<T>(value: T | T[] | undefined): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function textOf(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value).trim();
  if (typeof value === 'object' && value !== null && '_' in value) {
    return String((value as { _: string })._).trim();
  }
  return '';
}

/** Parse Tally quantity strings like "100 Nos" or "-50.5 Kg" into a numeric balance. */
export function parseTallyQuantity(raw: string): number {
  const cleaned = raw.replace(/,/g, '').trim();
  const match = cleaned.match(/^(-?\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
}

function extractStockItemsFromNode(node: Record<string, unknown>): TallyStockItem[] {
  const items: TallyStockItem[] = [];

  for (const stockItem of asArray(node.STOCKITEM as Record<string, unknown> | Record<string, unknown>[])) {
    const attrs = (stockItem.$ as Record<string, string> | undefined) ?? {};
    const itemName = attrs.NAME?.trim();
    if (!itemName) continue;

    items.push({
      itemName,
      closingBalance: parseTallyQuantity(textOf(stockItem.CLOSINGBALANCE)),
      baseUnits: textOf(stockItem.BASEUNITS) || textOf(stockItem.BASEUNIT),
    });
  }

  return items;
}

/** Walk parsed Tally XML and collect stock items from all known report layouts. */
export function extractStockItems(parsed: Record<string, unknown>): TallyStockItem[] {
  const items: TallyStockItem[] = [];
  const seen = new Set<string>();

  function addItem(item: TallyStockItem) {
    const key = item.itemName.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    items.push(item);
  }

  function walk(node: unknown) {
    if (!node || typeof node !== 'object') return;

    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }

    const record = node as Record<string, unknown>;
    extractStockItemsFromNode(record).forEach(addItem);

    // Stock Summary report rows (DSP* layout)
    const name = textOf(record.DSPACCNAME && (record.DSPACCNAME as Record<string, unknown>).DSPDISPNAME);
    const qty = textOf(
      record.DSPSTKINFO &&
        (record.DSPSTKINFO as Record<string, unknown>).DSPSTKCL &&
        ((record.DSPSTKINFO as Record<string, unknown>).DSPSTKCL as Record<string, unknown>).DSPCLQTY
    );
    const units = textOf(
      record.DSPSTKINFO &&
        (record.DSPSTKINFO as Record<string, unknown>).DSPSTKCL &&
        ((record.DSPSTKINFO as Record<string, unknown>).DSPSTKCL as Record<string, unknown>).DSPCLUNIT
    );

    if (name && (qty || units)) {
      addItem({
        itemName: name,
        closingBalance: parseTallyQuantity(qty),
        baseUnits: units,
      });
    }

    Object.values(record).forEach(walk);
  }

  walk(parsed);
  return items;
}

export async function parseTallyXml(xml: string): Promise<TallyStockItem[]> {
  const parsed = await parseStringPromise(xml, {
    explicitArray: false,
    trim: true,
    ignoreAttrs: false,
  });
  return extractStockItems(parsed as Record<string, unknown>);
}

const ENSURE_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS tally_stock_items (
    id SERIAL PRIMARY KEY,
    item_name VARCHAR(255) UNIQUE NOT NULL,
    closing_balance NUMERIC(18, 4) DEFAULT 0,
    base_units VARCHAR(50),
    last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
`;

const UPSERT_SQL = `
  INSERT INTO tally_stock_items (item_name, closing_balance, base_units, last_synced_at, updated_at)
  VALUES ($1, $2, $3, NOW(), NOW())
  ON CONFLICT (item_name) DO UPDATE SET
    closing_balance = EXCLUDED.closing_balance,
    base_units = EXCLUDED.base_units,
    last_synced_at = EXCLUDED.last_synced_at,
    updated_at = NOW()
  RETURNING id, item_name, closing_balance, base_units;
`;

export async function upsertTallyStockItems(items: TallyStockItem[]): Promise<number> {
  if (items.length === 0) return 0;

  const db = getDbPool();
  await db.query(ENSURE_TABLE_SQL);

  let upserted = 0;
  for (const item of items) {
    await db.query(UPSERT_SQL, [item.itemName, item.closingBalance, item.baseUnits || null]);
    upserted++;
  }
  return upserted;
}

export interface TallyStockRow {
  id: number;
  itemName: string;
  closingBalance: number;
  baseUnits: string | null;
  lastSyncedAt: string;
}

export async function listTallyStockItems(): Promise<TallyStockRow[]> {
  const db = getDbPool();
  await db.query(ENSURE_TABLE_SQL);

  const result = await db.query<{
    id: number;
    item_name: string;
    closing_balance: string;
    base_units: string | null;
    last_synced_at: Date;
  }>(`
    SELECT id, item_name, closing_balance, base_units, last_synced_at
    FROM tally_stock_items
    ORDER BY item_name ASC
  `);

  return result.rows.map((row) => ({
    id: row.id,
    itemName: row.item_name,
    closingBalance: parseFloat(row.closing_balance),
    baseUnits: row.base_units,
    lastSyncedAt: row.last_synced_at.toISOString(),
  }));
}
