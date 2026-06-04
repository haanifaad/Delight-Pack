import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import { setGlobalOptions } from "firebase-functions/v2";
import { z, ZodError } from "zod";
import {
  assertDesignPathsBelongToOrder,
  validateCustomOrderPayload,
  type CustomOrderPayload,
} from "./validateCustomOrder";
import { sendConfirmationEmail } from "./sendConfirmationEmail";
import type { CustomOrderDocument } from "./orderTypes";
import { processOrderInvoice } from "./processOrderInvoice";

admin.initializeApp();

setGlobalOptions({ region: "us-central1", maxInstances: 10 });

const db = admin.firestore();
const bucket = admin.storage().bucket();

async function verifyDesignFilesExist(
  designFiles: CustomOrderPayload["designFiles"]
): Promise<void> {
  for (const file of designFiles) {
    const [exists] = await bucket.file(file.storagePath).exists();
    if (!exists) {
      throw new HttpsError(
        "failed-precondition",
        `Design file not found: ${file.fileName}. Please re-upload and try again.`
      );
    }
  }
}

function buildOrderDocument(orderId: string, payload: CustomOrderPayload) {
  const { contact, dimensions, quantity, materialType, materialNotes, deliveryUrgency, designFiles } =
    payload;

  return {
    orderId,
    status: "pending_review" as const,
    contact,
    dimensions,
    quantity,
    materialType,
    materialNotes: materialNotes ?? null,
    deliveryUrgency,
    designFiles,
    confirmationEmailSent: false,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };
}

async function verifyOrderEmail(orderId: string, email: string): Promise<CustomOrderDocument> {
  const snap = await db.collection("custom_orders").doc(orderId).get();
  if (!snap.exists) {
    throw new HttpsError("not-found", "Order not found.");
  }
  const data = snap.data() as CustomOrderDocument;
  if (data.contact.email.trim().toLowerCase() !== email.trim().toLowerCase()) {
    throw new HttpsError("permission-denied", "Email does not match this order.");
  }
  return data;
}

/**
 * Callable function: validates payload, verifies uploaded designs, saves to custom_orders,
 * and sends the client confirmation email immediately.
 */
export const submitCustomOrder = onCall(
  { cors: true, enforceAppCheck: false },
  async (request) => {
    let payload: CustomOrderPayload;

    try {
      payload = validateCustomOrderPayload(request.data);
    } catch (err) {
      if (err instanceof ZodError) {
        throw new HttpsError("invalid-argument", "Invalid order data", err.flatten());
      }
      throw err;
    }

    const { orderId } = payload;

    try {
      assertDesignPathsBelongToOrder(orderId, payload.designFiles);
    } catch (err) {
      throw new HttpsError("invalid-argument", (err as Error).message);
    }

    const orderRef = db.collection("custom_orders").doc(orderId);
    const existing = await orderRef.get();
    if (existing.exists) {
      throw new HttpsError("already-exists", "This order has already been submitted.");
    }

    if (payload.designFiles.length > 0) {
      await verifyDesignFilesExist(payload.designFiles);
    }

    const orderDoc = buildOrderDocument(orderId, payload);
    await orderRef.set(orderDoc);

    const emailResult = await sendConfirmationEmail(orderId, payload);

    await orderRef.update({
      confirmationEmailSent: emailResult.sent,
      confirmationEmailStatus: emailResult.sent ? "sent" : emailResult.reason ?? "skipped",
      updatedAt: FieldValue.serverTimestamp(),
    });

    return {
      success: true,
      orderId,
      confirmationEmailSent: emailResult.sent,
    };
  }
);

const invoiceAccessSchema = z.object({
  orderId: z.string().uuid(),
  email: z.string().email(),
});

/**
 * Returns a short-lived signed URL to download the invoice PDF.
 */
export const getInvoiceDownloadUrl = onCall(
  { cors: true, enforceAppCheck: false },
  async (request) => {
    let input: z.infer<typeof invoiceAccessSchema>;
    try {
      input = invoiceAccessSchema.parse(request.data);
    } catch (err) {
      if (err instanceof ZodError) {
        throw new HttpsError("invalid-argument", "Invalid request", err.flatten());
      }
      throw err;
    }

    const order = await verifyOrderEmail(input.orderId, input.email);

    if (order.status !== "completed") {
      throw new HttpsError("failed-precondition", "Invoice is available when the order is completed.");
    }

    if (!order.invoice?.storagePath) {
      throw new HttpsError("failed-precondition", "Invoice is still being generated. Please try again shortly.");
    }

    const [signedUrl] = await bucket.file(order.invoice.storagePath).getSignedUrl({
      action: "read",
      expires: Date.now() + 15 * 60 * 1000,
    });

    return {
      downloadUrl: signedUrl,
      invoiceNumber: order.invoice.invoiceNumber,
      expiresInSeconds: 15 * 60,
    };
  }
);

/**
 * Poll invoice readiness for the customer portal.
 */
export const getOrderInvoiceStatus = onCall(
  { cors: true, enforceAppCheck: false },
  async (request) => {
    let input: z.infer<typeof invoiceAccessSchema>;
    try {
      input = invoiceAccessSchema.parse(request.data);
    } catch (err) {
      if (err instanceof ZodError) {
        throw new HttpsError("invalid-argument", "Invalid request", err.flatten());
      }
      throw err;
    }

    const order = await verifyOrderEmail(input.orderId, input.email);

    return {
      orderId: input.orderId,
      status: order.status,
      hasInvoice: Boolean(order.invoice?.storagePath),
      invoiceNumber: order.invoice?.invoiceNumber ?? null,
      invoiceGenerationStatus: order.invoiceGenerationStatus ?? null,
      total: order.pricing?.total ?? null,
      currency: order.pricing?.currency ?? "AED",
    };
  }
);

const completeOrderSchema = z.object({
  orderId: z.string().uuid(),
  /** Admin secret — set COMPLETE_ORDER_SECRET in Functions config for production. */
  adminSecret: z.string().min(8).optional(),
});

/**
 * Marks an order completed and generates its invoice (admin / ops).
 * Set COMPLETE_ORDER_SECRET in environment; omit check only in emulator when unset.
 */
export const completeOrder = onCall(
  { cors: true, enforceAppCheck: false },
  async (request) => {
    let input: z.infer<typeof completeOrderSchema>;
    try {
      input = completeOrderSchema.parse(request.data);
    } catch (err) {
      if (err instanceof ZodError) {
        throw new HttpsError("invalid-argument", "Invalid request", err.flatten());
      }
      throw err;
    }

    const configuredSecret = process.env.COMPLETE_ORDER_SECRET;
    if (configuredSecret && input.adminSecret !== configuredSecret) {
      throw new HttpsError("permission-denied", "Invalid admin credentials.");
    }

    const orderRef = db.collection("custom_orders").doc(input.orderId);
    const snap = await orderRef.get();
    if (!snap.exists) {
      throw new HttpsError("not-found", "Order not found.");
    }

    const order = snap.data() as CustomOrderDocument;
    if (order.status === "completed" && order.invoice?.storagePath) {
      return {
        success: true,
        orderId: input.orderId,
        invoiceNumber: order.invoice.invoiceNumber,
        alreadyCompleted: true,
      };
    }

    await orderRef.update({
      status: "completed",
      updatedAt: FieldValue.serverTimestamp(),
    });

    return {
      success: true,
      orderId: input.orderId,
      message: "Order marked completed. Invoice PDF is being generated.",
      alreadyCompleted: false,
    };
  }
);

/**
 * Auto-generate invoice PDF when order status transitions to completed.
 */
export const onCustomOrderCompleted = onDocumentUpdated(
  "custom_orders/{orderId}",
  async (event) => {
    const before = event.data?.before.data() as CustomOrderDocument | undefined;
    const after = event.data?.after.data() as CustomOrderDocument | undefined;
    if (!before || !after) return;

    const becameCompleted = before.status !== "completed" && after.status === "completed";
    if (!becameCompleted || after.invoice?.storagePath) return;

    const orderId = event.params.orderId;

    try {
      await processOrderInvoice(orderId, after);
    } catch (err) {
      console.error(`Invoice generation failed for ${orderId}:`, err);
      await db.collection("custom_orders").doc(orderId).update({
        invoiceGenerationStatus: "failed",
        invoiceGenerationError: err instanceof Error ? err.message : "Unknown error",
        updatedAt: FieldValue.serverTimestamp(),
      });
    }
  }
);

export * from "./demandForecasting";
export * from "./ticketTriage";
export * from "./complaintAnalyzer";
