import { Request, Response } from 'express';
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { listTallyStockItems, parseTallyXml, upsertTallyStockItems } from './tally-parser';

const SERVICE_ACCOUNT_FILE = process.env.GOOGLE_SERVICE_ACCOUNT_FILE || './google-credentials.json';
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID || '';
const SHEET_RANGE = process.env.GOOGLE_SHEET_RANGE || 'Sheet1!A:F';
const LOCAL_BRIDGE_SECRET = process.env.LOCAL_BRIDGE_SECRET || 'LOCAL_BRIDGE_SECRET_123';

interface VoucherItem {
  name: string;
  location?: string;
  qty?: string | number;
  rate?: string | number;
  amount?: string | number;
}

interface VoucherData {
  date: string;
  items: VoucherItem[];
}

function resolveCredentialsPath(): string {
  if (path.isAbsolute(SERVICE_ACCOUNT_FILE)) return SERVICE_ACCOUNT_FILE;
  return path.join(process.cwd(), SERVICE_ACCOUNT_FILE);
}

function getSheetsClient() {
  const keyFile = resolveCredentialsPath();
  if (!fs.existsSync(keyFile)) {
    throw new Error(
      `Google credentials not found at ${keyFile}. Download your Service Account JSON from GCP and save it there.`
    );
  }
  if (!SPREADSHEET_ID) {
    throw new Error('GOOGLE_SPREADSHEET_ID is not set. Add it to your .env file.');
  }

  const auth = new google.auth.GoogleAuth({
    keyFile,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
}

export async function syncToGoogleSheets(req: Request, res: Response) {
  try {
    const { voucherData } = req.body as { voucherData?: VoucherData };

    if (!voucherData?.items?.length) {
      return res.status(400).json({ error: 'No voucher data provided for sync.' });
    }

    console.log(`[Google Sheets Sync] Received data for voucher:`, voucherData.date);

    const sheets = getSheetsClient();

    const rows = voucherData.items.map((item) => [
      voucherData.date,
      item.name,
      item.location ?? '',
      item.qty ?? '0',
      item.rate ?? '0',
      item.amount ?? '0',
    ]);

    const result = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: SHEET_RANGE,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: rows },
    });

    const updatedRows = result.data.updates?.updatedRows ?? rows.length;
    console.log(`[Google Sheets Sync] Appended ${updatedRows} row(s) to ${SHEET_RANGE}.`);

    return res.json({
      message: 'Successfully synced to Google Sheets.',
      rowsAppended: updatedRows,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Google Sheets Sync] Error:', message);
    return res.status(500).json({ error: 'Failed to sync with Google Sheets.', detail: message });
  }
}

export async function getTallyStock(_req: Request, res: Response) {
  try {
    const items = await listTallyStockItems();
    const lastSyncedAt =
      items.length > 0
        ? items.reduce((latest, item) =>
            item.lastSyncedAt > latest ? item.lastSyncedAt : latest, items[0].lastSyncedAt)
        : null;

    return res.json({ items, count: items.length, lastSyncedAt });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Tally Stock] Error:', message);
    return res.status(500).json({ error: 'Failed to load Tally stock from database.', detail: message });
  }
}

export async function receiveTallySync(req: Request, res: Response) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${LOCAL_BRIDGE_SECRET}`) {
      return res.status(401).json({ error: 'Unauthorized bridge connection.' });
    }

    const { tallyXml } = req.body as { tallyXml?: string };
    if (!tallyXml || typeof tallyXml !== 'string') {
      return res.status(400).json({ error: 'No tallyXml provided.' });
    }

    if (tallyXml.includes('<LINEERROR>') || tallyXml.includes('<ERRORS>')) {
      console.warn('[Tally Bridge] Tally returned an error in XML response.');
      return res.status(422).json({ error: 'Tally returned an error response.' });
    }

    console.log('[Tally Bridge] Received XML sync from local Tally Prime.');

    const stockItems = await parseTallyXml(tallyXml);
    const upserted = await upsertTallyStockItems(stockItems);

    console.log(`[Tally Bridge] Upserted ${upserted} stock item(s) into PostgreSQL.`);

    return res.json({
      message: 'Tally data synced to web database.',
      itemsParsed: stockItems.length,
      itemsUpserted: upserted,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Tally Bridge] Error:', message);
    return res.status(500).json({ error: 'Failed to process Tally XML.', detail: message });
  }
}
