import type { Timestamp } from "firebase-admin/firestore";
import type { CustomOrderPayload } from "./validateCustomOrder";

export type OrderStatus = "pending_review" | "quoted" | "approved" | "completed";

export interface OrderPricing {
  materialCost: number;
  printingCost: number;
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
  currency: "AED";
}

export interface OrderInvoice {
  invoiceNumber: string;
  storagePath: string;
  generatedAt: Timestamp;
}

export interface CustomOrderDocument extends Omit<CustomOrderPayload, "materialNotes"> {
  orderId: string;
  status: OrderStatus;
  materialNotes: string | null;
  confirmationEmailSent: boolean;
  confirmationEmailStatus?: string;
  pricing?: OrderPricing;
  invoice?: OrderInvoice;
  invoiceGenerationStatus?: "pending" | "completed" | "failed";
  invoiceGenerationError?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/** Normalize Firestore nulls for functions that expect CustomOrderPayload. */
export function toCustomOrderPayload(doc: CustomOrderDocument): CustomOrderPayload {
  return {
    orderId: doc.orderId,
    contact: doc.contact,
    dimensions: doc.dimensions,
    quantity: doc.quantity,
    materialType: doc.materialType,
    materialNotes: doc.materialNotes ?? undefined,
    deliveryUrgency: doc.deliveryUrgency,
    designFiles: doc.designFiles,
  };
}
