import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { toCustomOrderPayload, type CustomOrderDocument } from "./orderTypes";
import { calculateOrderPricing } from "./calculateOrderPricing";
import { generateInvoicePdf } from "./generateInvoicePdf";

function buildInvoiceNumber(orderId: string, issuedAt: Date): string {
  const datePart = issuedAt.toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = orderId.replace(/-/g, "").slice(0, 6).toUpperCase();
  return `DP-INV-${datePart}-${suffix}`;
}

export async function processOrderInvoice(
  orderId: string,
  orderData: CustomOrderDocument
): Promise<{ storagePath: string; invoiceNumber: string }> {
  const db = admin.firestore();
  const bucket = admin.storage().bucket();
  const orderRef = db.collection("custom_orders").doc(orderId);

  const lockResult = await db.runTransaction(async (tx) => {
    const snap = await tx.get(orderRef);
    if (!snap.exists) {
      throw new Error("Order not found");
    }
    const current = snap.data() as CustomOrderDocument;
    if (current.invoice?.storagePath) {
      return {
        done: true as const,
        storagePath: current.invoice.storagePath,
        invoiceNumber: current.invoice.invoiceNumber,
      };
    }
    if (current.invoiceGenerationStatus === "pending") {
      return { done: true as const, pending: true as const };
    }
    tx.update(orderRef, {
      invoiceGenerationStatus: "pending",
      updatedAt: FieldValue.serverTimestamp(),
    });
    return { done: false as const };
  });

  if (lockResult.done) {
    if ("pending" in lockResult && lockResult.pending) {
      throw new Error("Invoice generation already in progress");
    }
    if ("storagePath" in lockResult) {
      return {
        storagePath: lockResult.storagePath,
        invoiceNumber: lockResult.invoiceNumber,
      };
    }
  }

  const freshSnap = await orderRef.get();
  const freshOrder = freshSnap.data() as CustomOrderDocument;

  const issuedAt = new Date();
  const invoiceNumber = buildInvoiceNumber(orderId, issuedAt);
  const orderPayload = toCustomOrderPayload(freshOrder);
  const pricing = freshOrder.pricing ?? calculateOrderPricing(orderPayload);

  const pdfBuffer = await generateInvoicePdf({
    orderId,
    invoiceNumber,
    issuedAt,
    payload: orderPayload,
    pricing,
  });

  const storagePath = `invoices/${orderId}/${invoiceNumber}.pdf`;
  const file = bucket.file(storagePath);

  await file.save(pdfBuffer, {
    metadata: {
      contentType: "application/pdf",
      metadata: {
        orderId,
        invoiceNumber,
      },
    },
  });

  await orderRef.update({
    pricing,
    invoice: {
      invoiceNumber,
      storagePath,
      generatedAt: FieldValue.serverTimestamp(),
    },
    invoiceGenerationStatus: "completed",
    invoiceGenerationError: FieldValue.delete(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  return { storagePath, invoiceNumber };
}
