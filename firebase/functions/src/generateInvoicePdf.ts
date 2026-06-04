import * as fs from "fs";
import * as path from "path";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";
import sharp from "sharp";
import type { CustomOrderPayload } from "./validateCustomOrder";
import type { OrderPricing } from "./orderTypes";
import {
  buildMaterialLineDescription,
  buildPrintingLineDescription,
} from "./calculateOrderPricing";
import { COMPANY, UAE_VAT_RATE, INVOICE_CURRENCY, getCompanyTrn } from "./companyBranding";

export interface InvoicePdfInput {
  orderId: string;
  invoiceNumber: string;
  issuedAt: Date;
  payload: CustomOrderPayload;
  pricing: OrderPricing;
}

export interface InvoiceQrMetadata {
  invoiceNumber: string;
  orderId: string;
  company: string;
  customerEmail: string;
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
  currency: string;
  issuedAt: string;
  issuer: string;
  trn: string | null;
}

function formatAed(amount: number): string {
  return `${INVOICE_CURRENCY} ${amount.toLocaleString("en-AE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

async function loadLogoDataUrl(): Promise<string> {
  const logoPath = path.join(__dirname, "../assets/delight-pack-logo.svg");
  const pngBuffer = await sharp(logoPath).resize(480, 120, { fit: "inside" }).png().toBuffer();
  return `data:image/png;base64,${pngBuffer.toString("base64")}`;
}

function hexToRgb(hex: string): [number, number, number] {
  const normalized = hex.replace("#", "");
  const value = parseInt(normalized, 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

export async function generateInvoicePdf(input: InvoicePdfInput): Promise<Buffer> {
  const { orderId, invoiceNumber, issuedAt, payload, pricing } = input;
  const { contact } = payload;
  const trn = getCompanyTrn();

  const qrMetadata: InvoiceQrMetadata = {
    invoiceNumber,
    orderId,
    company: contact.company,
    customerEmail: contact.email,
    subtotal: pricing.subtotal,
    vatRate: pricing.vatRate,
    vatAmount: pricing.vatAmount,
    total: pricing.total,
    currency: pricing.currency,
    issuedAt: issuedAt.toISOString(),
    issuer: COMPANY.legalName,
    trn,
  };

  const qrDataUrl = await QRCode.toDataURL(JSON.stringify(qrMetadata), {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 256,
  });

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const primaryRgb = hexToRgb(COMPANY.primaryColor);

  const logoDataUrl = await loadLogoDataUrl();
  doc.addImage(logoDataUrl, "PNG", 14, 12, 72, 18);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
  doc.text("TAX INVOICE", pageWidth - 14, 22, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);
  doc.text(`Invoice No: ${invoiceNumber}`, pageWidth - 14, 30, { align: "right" });
  doc.text(`Order Ref: ${orderId.slice(0, 8).toUpperCase()}`, pageWidth - 14, 35, { align: "right" });
  doc.text(`Date: ${issuedAt.toLocaleDateString("en-AE", { timeZone: "Asia/Dubai" })}`, pageWidth - 14, 40, {
    align: "right",
  });
  doc.text("Place of supply: Dubai, UAE", pageWidth - 14, 45, { align: "right" });

  doc.setDrawColor(220, 220, 220);
  doc.line(14, 50, pageWidth - 14, 50);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(30, 30, 30);
  doc.text("From", 14, 58);
  doc.text("Bill To", pageWidth / 2 + 4, 58);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);

  const sellerLines = [
    COMPANY.legalName,
    COMPANY.address,
    COMPANY.phone,
    COMPANY.email,
    trn ? `TRN: ${trn}` : "TRN: On request",
  ];
  sellerLines.forEach((line, index) => doc.text(line, 14, 65 + index * 5));

  const buyerLines = [
    contact.company,
    `${contact.firstName} ${contact.lastName}`,
    contact.email,
    contact.phone,
  ];
  buyerLines.forEach((line, index) => doc.text(line, pageWidth / 2 + 4, 65 + index * 5));

  autoTable(doc, {
    startY: 92,
    head: [["Description", "Qty", "Unit Price", "Amount"]],
    body: [
      [
        buildMaterialLineDescription(payload),
        "1",
        formatAed(pricing.materialCost),
        formatAed(pricing.materialCost),
      ],
      [
        buildPrintingLineDescription(payload),
        "1",
        formatAed(pricing.printingCost),
        formatAed(pricing.printingCost),
      ],
    ],
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: {
      fillColor: primaryRgb,
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    columnStyles: {
      0: { cellWidth: 95 },
      1: { halign: "center", cellWidth: 18 },
      2: { halign: "right", cellWidth: 35 },
      3: { halign: "right", cellWidth: 35 },
    },
    theme: "striped",
  });

  const tableEnd = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 140;
  let totalsY = tableEnd + 10;

  const totalsX = pageWidth - 14;
  const labelX = pageWidth - 78;

  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);
  doc.text("Subtotal (excl. VAT)", labelX, totalsY);
  doc.text(formatAed(pricing.subtotal), totalsX, totalsY, { align: "right" });

  totalsY += 6;
  doc.text(`VAT (${(UAE_VAT_RATE * 100).toFixed(0)}% — UAE)`, labelX, totalsY);
  doc.text(formatAed(pricing.vatAmount), totalsX, totalsY, { align: "right" });

  totalsY += 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
  doc.text("Total Due", labelX, totalsY);
  doc.text(formatAed(pricing.total), totalsX, totalsY, { align: "right" });

  doc.addImage(qrDataUrl, "PNG", pageWidth - 52, totalsY + 8, 38, 38);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text("Scan to verify invoice metadata", pageWidth - 52, totalsY + 48);

  const footerY = 270;
  doc.setDrawColor(220, 220, 220);
  doc.line(14, footerY - 6, pageWidth - 14, footerY - 6);
  doc.setFontSize(8);
  doc.text(
    "Payment terms: Net 14 days · Bank transfer details provided separately · This is a computer-generated tax invoice.",
    14,
    footerY
  );
  doc.text(`${COMPANY.legalName} · ${COMPANY.website}`, 14, footerY + 5);

  const arrayBuffer = doc.output("arraybuffer");
  return Buffer.from(arrayBuffer);
}

/** Ensures logo asset exists at build output path (for local tests). */
export function assertLogoAssetExists(): void {
  const logoPath = path.join(__dirname, "../assets/delight-pack-logo.svg");
  if (!fs.existsSync(logoPath)) {
    throw new Error(`Company logo not found at ${logoPath}`);
  }
}
