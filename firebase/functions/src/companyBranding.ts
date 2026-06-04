/** Delight Pack B2B invoice branding (UAE / Dubai). */
export const COMPANY = {
  legalName: "Delight Pack LLC",
  address: "Ras Al Khor Industrial Area 2, Dubai, United Arab Emirates",
  phone: "+971 55 961 0972",
  email: "orders@delightpack.ae",
  website: "www.delightpack.ae",
  primaryColor: "#0056b3",
  accentColor: "#e63946",
} as const;

/** UAE standard VAT rate (5%) — Federal Decree-Law No. 8 of 2017. */
export const UAE_VAT_RATE = 0.05;

export const INVOICE_CURRENCY = "AED";

export function getCompanyTrn(): string | null {
  return process.env.COMPANY_TRN?.trim() || null;
}
