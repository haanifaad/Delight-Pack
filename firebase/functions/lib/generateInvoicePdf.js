"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInvoicePdf = generateInvoicePdf;
exports.assertLogoAssetExists = assertLogoAssetExists;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const jspdf_1 = require("jspdf");
const jspdf_autotable_1 = __importDefault(require("jspdf-autotable"));
const qrcode_1 = __importDefault(require("qrcode"));
const sharp_1 = __importDefault(require("sharp"));
const calculateOrderPricing_1 = require("./calculateOrderPricing");
const companyBranding_1 = require("./companyBranding");
function formatAed(amount) {
    return `${companyBranding_1.INVOICE_CURRENCY} ${amount.toLocaleString("en-AE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
async function loadLogoDataUrl() {
    const logoPath = path.join(__dirname, "../assets/delight-pack-logo.svg");
    const pngBuffer = await (0, sharp_1.default)(logoPath).resize(480, 120, { fit: "inside" }).png().toBuffer();
    return `data:image/png;base64,${pngBuffer.toString("base64")}`;
}
function hexToRgb(hex) {
    const normalized = hex.replace("#", "");
    const value = parseInt(normalized, 16);
    return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}
async function generateInvoicePdf(input) {
    const { orderId, invoiceNumber, issuedAt, payload, pricing } = input;
    const { contact } = payload;
    const trn = (0, companyBranding_1.getCompanyTrn)();
    const qrMetadata = {
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
        issuer: companyBranding_1.COMPANY.legalName,
        trn,
    };
    const qrDataUrl = await qrcode_1.default.toDataURL(JSON.stringify(qrMetadata), {
        errorCorrectionLevel: "M",
        margin: 1,
        width: 256,
    });
    const doc = new jspdf_1.jsPDF({ unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const primaryRgb = hexToRgb(companyBranding_1.COMPANY.primaryColor);
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
        companyBranding_1.COMPANY.legalName,
        companyBranding_1.COMPANY.address,
        companyBranding_1.COMPANY.phone,
        companyBranding_1.COMPANY.email,
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
    (0, jspdf_autotable_1.default)(doc, {
        startY: 92,
        head: [["Description", "Qty", "Unit Price", "Amount"]],
        body: [
            [
                (0, calculateOrderPricing_1.buildMaterialLineDescription)(payload),
                "1",
                formatAed(pricing.materialCost),
                formatAed(pricing.materialCost),
            ],
            [
                (0, calculateOrderPricing_1.buildPrintingLineDescription)(payload),
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
    const tableEnd = doc.lastAutoTable?.finalY ?? 140;
    let totalsY = tableEnd + 10;
    const totalsX = pageWidth - 14;
    const labelX = pageWidth - 78;
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    doc.text("Subtotal (excl. VAT)", labelX, totalsY);
    doc.text(formatAed(pricing.subtotal), totalsX, totalsY, { align: "right" });
    totalsY += 6;
    doc.text(`VAT (${(companyBranding_1.UAE_VAT_RATE * 100).toFixed(0)}% — UAE)`, labelX, totalsY);
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
    doc.text("Payment terms: Net 14 days · Bank transfer details provided separately · This is a computer-generated tax invoice.", 14, footerY);
    doc.text(`${companyBranding_1.COMPANY.legalName} · ${companyBranding_1.COMPANY.website}`, 14, footerY + 5);
    const arrayBuffer = doc.output("arraybuffer");
    return Buffer.from(arrayBuffer);
}
/** Ensures logo asset exists at build output path (for local tests). */
function assertLogoAssetExists() {
    const logoPath = path.join(__dirname, "../assets/delight-pack-logo.svg");
    if (!fs.existsSync(logoPath)) {
        throw new Error(`Company logo not found at ${logoPath}`);
    }
}
//# sourceMappingURL=generateInvoicePdf.js.map