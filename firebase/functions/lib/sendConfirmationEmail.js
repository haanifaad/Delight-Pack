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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendConfirmationEmail = sendConfirmationEmail;
const nodemailer = __importStar(require("nodemailer"));
const validateCustomOrder_1 = require("./validateCustomOrder");
function getEmailConfig() {
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.EMAIL_FROM || user;
    if (!host || !user || !pass || !from) {
        return null;
    }
    return {
        host,
        port: Number(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
        user,
        pass,
        from,
    };
}
function buildHtmlBody(orderId, payload) {
    const { contact, dimensions, quantity, materialType, deliveryUrgency, designFiles } = payload;
    const dims = `${dimensions.length} × ${dimensions.width} × ${dimensions.height} ${dimensions.unit}`;
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0056b3;">Delight Pack — Custom Packaging Request Received</h2>
      <p>Hi ${contact.firstName},</p>
      <p>Thank you for your custom packaging request. Our team will review your specifications and contact you shortly.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Reference</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${orderId}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Company</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${contact.company}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Box dimensions</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${dims}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Quantity</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${quantity.toLocaleString()}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Material</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${validateCustomOrder_1.MATERIAL_LABELS[materialType]}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Delivery</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${validateCustomOrder_1.URGENCY_LABELS[deliveryUrgency]}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Design files</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${designFiles.length} uploaded</td></tr>
      </table>
      <p style="color: #666; font-size: 14px;">Delight Pack LLC · Ras Al Khor Industrial Area 2, Dubai · 055 961 0972</p>
    </div>
  `;
}
async function sendConfirmationEmail(orderId, payload) {
    const config = getEmailConfig();
    if (!config) {
        console.warn("SMTP not configured (SMTP_HOST, SMTP_USER, SMTP_PASS). Skipping confirmation email.");
        return { sent: false, reason: "smtp_not_configured" };
    }
    const transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: { user: config.user, pass: config.pass },
    });
    const { contact, dimensions, quantity, materialType, deliveryUrgency } = payload;
    const dims = `${dimensions.length}×${dimensions.width}×${dimensions.height}${dimensions.unit}`;
    await transporter.sendMail({
        from: config.from,
        to: contact.email,
        subject: `Custom Packaging Request Confirmed — ${orderId.slice(0, 8).toUpperCase()}`,
        text: [
            `Hi ${contact.firstName},`,
            "",
            "Thank you for your custom packaging request with Delight Pack.",
            "",
            `Reference: ${orderId}`,
            `Dimensions: ${dims}`,
            `Quantity: ${quantity}`,
            `Material: ${validateCustomOrder_1.MATERIAL_LABELS[materialType]}`,
            `Delivery: ${validateCustomOrder_1.URGENCY_LABELS[deliveryUrgency]}`,
            "",
            "Our team will contact you within 1 business day.",
            "",
            "Delight Pack LLC · Dubai, UAE · 055 961 0972",
        ].join("\n"),
        html: buildHtmlBody(orderId, payload),
    });
    return { sent: true };
}
//# sourceMappingURL=sendConfirmationEmail.js.map