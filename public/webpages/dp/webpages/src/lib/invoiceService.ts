import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";

export interface OrderInvoiceStatus {
  orderId: string;
  status: string;
  hasInvoice: boolean;
  invoiceNumber: string | null;
  invoiceGenerationStatus: string | null;
  total: number | null;
  currency: string;
}

export interface InvoiceDownloadResult {
  downloadUrl: string;
  invoiceNumber: string;
  expiresInSeconds: number;
}

const getOrderInvoiceStatusCallable = httpsCallable<
  { orderId: string; email: string },
  OrderInvoiceStatus
>(functions, "getOrderInvoiceStatus");

const getInvoiceDownloadUrlCallable = httpsCallable<
  { orderId: string; email: string },
  InvoiceDownloadResult
>(functions, "getInvoiceDownloadUrl");

export async function fetchOrderInvoiceStatus(
  orderId: string,
  email: string
): Promise<OrderInvoiceStatus> {
  const result = await getOrderInvoiceStatusCallable({ orderId, email });
  return result.data;
}

export async function fetchInvoiceDownloadUrl(
  orderId: string,
  email: string
): Promise<InvoiceDownloadResult> {
  const result = await getInvoiceDownloadUrlCallable({ orderId, email });
  return result.data;
}
