import * as nodemailer from "nodemailer";
import type { CustomOrderPayload } from "./validateCustomOrder";
import { MATERIAL_LABELS, URGENCY_LABELS } from "./validateCustomOrder";

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
}

function getEmailConfig(): EmailConfig | null {
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

function buildHtmlBody(orderId: string, payload: CustomOrderPayload): string {
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
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Material</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${MATERIAL_LABELS[materialType]}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Delivery</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${URGENCY_LABELS[deliveryUrgency]}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Design files</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${designFiles.length} uploaded</td></tr>
      </table>
      <p style="color: #666; font-size: 14px;">Delight Pack LLC · Ras Al Khor Industrial Area 2, Dubai · 055 961 0972</p>
    </div>
  `;
}

export async function sendConfirmationEmail(
  orderId: string,
  payload: CustomOrderPayload
): Promise<{ sent: boolean; reason?: string }> {
  const config = getEmailConfig();
  if (!config) {
    console.warn(
      "SMTP not configured (SMTP_HOST, SMTP_USER, SMTP_PASS). Skipping confirmation email."
    );
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
      `Material: ${MATERIAL_LABELS[materialType]}`,
      `Delivery: ${URGENCY_LABELS[deliveryUrgency]}`,
      "",
      "Our team will contact you within 1 business day.",
      "",
      "Delight Pack LLC · Dubai, UAE · 055 961 0972",
    ].join("\n"),
    html: buildHtmlBody(orderId, payload),
  });

  return { sent: true };
}
