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
exports.processOrderInvoice = processOrderInvoice;
const admin = __importStar(require("firebase-admin"));
const firestore_1 = require("firebase-admin/firestore");
const orderTypes_1 = require("./orderTypes");
const calculateOrderPricing_1 = require("./calculateOrderPricing");
const generateInvoicePdf_1 = require("./generateInvoicePdf");
function buildInvoiceNumber(orderId, issuedAt) {
    const datePart = issuedAt.toISOString().slice(0, 10).replace(/-/g, "");
    const suffix = orderId.replace(/-/g, "").slice(0, 6).toUpperCase();
    return `DP-INV-${datePart}-${suffix}`;
}
async function processOrderInvoice(orderId, orderData) {
    const db = admin.firestore();
    const bucket = admin.storage().bucket();
    const orderRef = db.collection("custom_orders").doc(orderId);
    const lockResult = await db.runTransaction(async (tx) => {
        const snap = await tx.get(orderRef);
        if (!snap.exists) {
            throw new Error("Order not found");
        }
        const current = snap.data();
        if (current.invoice?.storagePath) {
            return {
                done: true,
                storagePath: current.invoice.storagePath,
                invoiceNumber: current.invoice.invoiceNumber,
            };
        }
        if (current.invoiceGenerationStatus === "pending") {
            return { done: true, pending: true };
        }
        tx.update(orderRef, {
            invoiceGenerationStatus: "pending",
            updatedAt: firestore_1.FieldValue.serverTimestamp(),
        });
        return { done: false };
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
    const freshOrder = freshSnap.data();
    const issuedAt = new Date();
    const invoiceNumber = buildInvoiceNumber(orderId, issuedAt);
    const orderPayload = (0, orderTypes_1.toCustomOrderPayload)(freshOrder);
    const pricing = freshOrder.pricing ?? (0, calculateOrderPricing_1.calculateOrderPricing)(orderPayload);
    const pdfBuffer = await (0, generateInvoicePdf_1.generateInvoicePdf)({
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
            generatedAt: firestore_1.FieldValue.serverTimestamp(),
        },
        invoiceGenerationStatus: "completed",
        invoiceGenerationError: firestore_1.FieldValue.delete(),
        updatedAt: firestore_1.FieldValue.serverTimestamp(),
    });
    return { storagePath, invoiceNumber };
}
//# sourceMappingURL=processOrderInvoice.js.map