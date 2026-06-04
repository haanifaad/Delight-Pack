import { ref, uploadBytes } from "firebase/storage";
import { httpsCallable } from "firebase/functions";
import { assertFirebaseConfig, storage, functions } from "./firebase";
import type { CustomOrderSubmitPayload, DesignFileMeta } from "../types/customOrder";

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml", "application/pdf"];
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_FILES = 5;

export function createOrderId(): string {
  return crypto.randomUUID();
}

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 200);
}

export function validateDesignFile(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return "Only PNG, JPEG, WebP, SVG, or PDF files are allowed.";
  }
  if (file.size > MAX_FILE_BYTES) {
    return "Each file must be 10 MB or smaller.";
  }
  return null;
}

export async function uploadDesignFiles(
  orderId: string,
  files: File[]
): Promise<DesignFileMeta[]> {
  if (files.length > MAX_FILES) {
    throw new Error(`You can upload up to ${MAX_FILES} design files.`);
  }

  const uploaded: DesignFileMeta[] = [];

  for (const file of files) {
    const validationError = validateDesignFile(file);
    if (validationError) {
      throw new Error(validationError);
    }

    const safeName = sanitizeFileName(file.name);
    const storagePath = `custom_orders/${orderId}/designs/${Date.now()}-${safeName}`;
    const storageRef = ref(storage, storagePath);

    await uploadBytes(storageRef, file, { contentType: file.type });

    uploaded.push({
      storagePath,
      fileName: file.name,
      contentType: file.type,
      sizeBytes: file.size,
    });
  }

  return uploaded;
}

interface SubmitCustomOrderResult {
  success: boolean;
  orderId: string;
  confirmationEmailSent: boolean;
}

const submitCustomOrderCallable = httpsCallable<CustomOrderSubmitPayload, SubmitCustomOrderResult>(
  functions,
  "submitCustomOrder"
);

export async function submitCustomOrder(
  payload: CustomOrderSubmitPayload
): Promise<SubmitCustomOrderResult> {
  const result = await submitCustomOrderCallable(payload);
  return result.data;
}

/** Upload designs then submit the full order via Cloud Function. */
export async function submitCustomPackagingRequest(
  orderId: string,
  payload: Omit<CustomOrderSubmitPayload, "orderId" | "designFiles">,
  designFiles: File[]
): Promise<SubmitCustomOrderResult> {
  assertFirebaseConfig();

  const uploadedDesigns = designFiles.length
    ? await uploadDesignFiles(orderId, designFiles)
    : [];

  return submitCustomOrder({
    orderId,
    ...payload,
    designFiles: uploadedDesigns,
  });
}
