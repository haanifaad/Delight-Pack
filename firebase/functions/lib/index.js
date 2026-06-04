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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onCustomOrderCompleted = exports.completeOrder = exports.getOrderInvoiceStatus = exports.getInvoiceDownloadUrl = exports.submitCustomOrder = void 0;
const admin = __importStar(require("firebase-admin"));
const firestore_1 = require("firebase-admin/firestore");
const https_1 = require("firebase-functions/v2/https");
const firestore_2 = require("firebase-functions/v2/firestore");
const v2_1 = require("firebase-functions/v2");
const zod_1 = require("zod");
const validateCustomOrder_1 = require("./validateCustomOrder");
const sendConfirmationEmail_1 = require("./sendConfirmationEmail");
const processOrderInvoice_1 = require("./processOrderInvoice");
admin.initializeApp();
(0, v2_1.setGlobalOptions)({ region: "us-central1", maxInstances: 10 });
const db = admin.firestore();
const bucket = admin.storage().bucket();
async function verifyDesignFilesExist(designFiles) {
    for (const file of designFiles) {
        const [exists] = await bucket.file(file.storagePath).exists();
        if (!exists) {
            throw new https_1.HttpsError("failed-precondition", `Design file not found: ${file.fileName}. Please re-upload and try again.`);
        }
    }
}
function buildOrderDocument(orderId, payload) {
    const { contact, dimensions, quantity, materialType, materialNotes, deliveryUrgency, designFiles } = payload;
    return {
        orderId,
        status: "pending_review",
        contact,
        dimensions,
        quantity,
        materialType,
        materialNotes: materialNotes ?? null,
        deliveryUrgency,
        designFiles,
        confirmationEmailSent: false,
        createdAt: firestore_1.FieldValue.serverTimestamp(),
        updatedAt: firestore_1.FieldValue.serverTimestamp(),
    };
}
async function verifyOrderEmail(orderId, email) {
    const snap = await db.collection("custom_orders").doc(orderId).get();
    if (!snap.exists) {
        throw new https_1.HttpsError("not-found", "Order not found.");
    }
    const data = snap.data();
    if (data.contact.email.trim().toLowerCase() !== email.trim().toLowerCase()) {
        throw new https_1.HttpsError("permission-denied", "Email does not match this order.");
    }
    return data;
}
/**
 * Callable function: validates payload, verifies uploaded designs, saves to custom_orders,
 * and sends the client confirmation email immediately.
 */
exports.submitCustomOrder = (0, https_1.onCall)({ cors: true, enforceAppCheck: false }, async (request) => {
    let payload;
    try {
        payload = (0, validateCustomOrder_1.validateCustomOrderPayload)(request.data);
    }
    catch (err) {
        if (err instanceof zod_1.ZodError) {
            throw new https_1.HttpsError("invalid-argument", "Invalid order data", err.flatten());
        }
        throw err;
    }
    const { orderId } = payload;
    try {
        (0, validateCustomOrder_1.assertDesignPathsBelongToOrder)(orderId, payload.designFiles);
    }
    catch (err) {
        throw new https_1.HttpsError("invalid-argument", err.message);
    }
    const orderRef = db.collection("custom_orders").doc(orderId);
    const existing = await orderRef.get();
    if (existing.exists) {
        throw new https_1.HttpsError("already-exists", "This order has already been submitted.");
    }
    if (payload.designFiles.length > 0) {
        await verifyDesignFilesExist(payload.designFiles);
    }
    const orderDoc = buildOrderDocument(orderId, payload);
    await orderRef.set(orderDoc);
    const emailResult = await (0, sendConfirmationEmail_1.sendConfirmationEmail)(orderId, payload);
    await orderRef.update({
        confirmationEmailSent: emailResult.sent,
        confirmationEmailStatus: emailResult.sent ? "sent" : emailResult.reason ?? "skipped",
        updatedAt: firestore_1.FieldValue.serverTimestamp(),
    });
    return {
        success: true,
        orderId,
        confirmationEmailSent: emailResult.sent,
    };
});
const invoiceAccessSchema = zod_1.z.object({
    orderId: zod_1.z.string().uuid(),
    email: zod_1.z.string().email(),
});
/**
 * Returns a short-lived signed URL to download the invoice PDF.
 */
exports.getInvoiceDownloadUrl = (0, https_1.onCall)({ cors: true, enforceAppCheck: false }, async (request) => {
    let input;
    try {
        input = invoiceAccessSchema.parse(request.data);
    }
    catch (err) {
        if (err instanceof zod_1.ZodError) {
            throw new https_1.HttpsError("invalid-argument", "Invalid request", err.flatten());
        }
        throw err;
    }
    const order = await verifyOrderEmail(input.orderId, input.email);
    if (order.status !== "completed") {
        throw new https_1.HttpsError("failed-precondition", "Invoice is available when the order is completed.");
    }
    if (!order.invoice?.storagePath) {
        throw new https_1.HttpsError("failed-precondition", "Invoice is still being generated. Please try again shortly.");
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
});
/**
 * Poll invoice readiness for the customer portal.
 */
exports.getOrderInvoiceStatus = (0, https_1.onCall)({ cors: true, enforceAppCheck: false }, async (request) => {
    let input;
    try {
        input = invoiceAccessSchema.parse(request.data);
    }
    catch (err) {
        if (err instanceof zod_1.ZodError) {
            throw new https_1.HttpsError("invalid-argument", "Invalid request", err.flatten());
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
});
const completeOrderSchema = zod_1.z.object({
    orderId: zod_1.z.string().uuid(),
    /** Admin secret — set COMPLETE_ORDER_SECRET in Functions config for production. */
    adminSecret: zod_1.z.string().min(8).optional(),
});
/**
 * Marks an order completed and generates its invoice (admin / ops).
 * Set COMPLETE_ORDER_SECRET in environment; omit check only in emulator when unset.
 */
exports.completeOrder = (0, https_1.onCall)({ cors: true, enforceAppCheck: false }, async (request) => {
    let input;
    try {
        input = completeOrderSchema.parse(request.data);
    }
    catch (err) {
        if (err instanceof zod_1.ZodError) {
            throw new https_1.HttpsError("invalid-argument", "Invalid request", err.flatten());
        }
        throw err;
    }
    const configuredSecret = process.env.COMPLETE_ORDER_SECRET;
    if (configuredSecret && input.adminSecret !== configuredSecret) {
        throw new https_1.HttpsError("permission-denied", "Invalid admin credentials.");
    }
    const orderRef = db.collection("custom_orders").doc(input.orderId);
    const snap = await orderRef.get();
    if (!snap.exists) {
        throw new https_1.HttpsError("not-found", "Order not found.");
    }
    const order = snap.data();
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
        updatedAt: firestore_1.FieldValue.serverTimestamp(),
    });
    return {
        success: true,
        orderId: input.orderId,
        message: "Order marked completed. Invoice PDF is being generated.",
        alreadyCompleted: false,
    };
});
/**
 * Auto-generate invoice PDF when order status transitions to completed.
 */
exports.onCustomOrderCompleted = (0, firestore_2.onDocumentUpdated)("custom_orders/{orderId}", async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();
    if (!before || !after)
        return;
    const becameCompleted = before.status !== "completed" && after.status === "completed";
    if (!becameCompleted || after.invoice?.storagePath)
        return;
    const orderId = event.params.orderId;
    try {
        await (0, processOrderInvoice_1.processOrderInvoice)(orderId, after);
    }
    catch (err) {
        console.error(`Invoice generation failed for ${orderId}:`, err);
        await db.collection("custom_orders").doc(orderId).update({
            invoiceGenerationStatus: "failed",
            invoiceGenerationError: err instanceof Error ? err.message : "Unknown error",
            updatedAt: firestore_1.FieldValue.serverTimestamp(),
        });
    }
});
__exportStar(require("./demandForecasting"), exports);
__exportStar(require("./ticketTriage"), exports);
//# sourceMappingURL=index.js.map