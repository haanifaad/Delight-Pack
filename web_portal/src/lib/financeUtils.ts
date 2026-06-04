export const VAT_RATE = 0.05; // 5% Dubai VAT

export interface SpreadsheetRow {
  id: string;
  item: string;
  quantity: number;
  rate: number;
  subtotal: number;
  tax: number;
  total: number;
}

/**
 * Calculates the derived fields for a single row based on quantity and rate.
 */
export const calculateRowTotals = (quantity: number, rate: number) => {
  const subtotal = quantity * rate;
  const tax = subtotal * VAT_RATE;
  const total = subtotal + tax;
  return { subtotal, tax, total };
};

/**
 * Calculates the grand totals for an array of rows.
 */
export const calculateAggregates = (rows: SpreadsheetRow[]) => {
  return rows.reduce(
    (acc, row) => ({
      subtotal: acc.subtotal + row.subtotal,
      tax: acc.tax + row.tax,
      total: acc.total + row.total,
    }),
    { subtotal: 0, tax: 0, total: 0 }
  );
};
