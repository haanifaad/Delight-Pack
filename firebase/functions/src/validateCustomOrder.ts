import { z } from "zod";

export const MATERIAL_TYPES = ["food_grade", "industrial", "eco_friendly"] as const;
export const DELIVERY_URGENCY = ["standard", "express", "rush"] as const;
export const DIMENSION_UNITS = ["cm", "mm", "in"] as const;

const designFileSchema = z.object({
  storagePath: z.string().min(1).max(500),
  fileName: z.string().min(1).max(255),
  contentType: z.string().min(1).max(100),
  sizeBytes: z.number().int().positive().max(10 * 1024 * 1024),
});

export const customOrderPayloadSchema = z.object({
  orderId: z.string().uuid("Invalid order reference"),
  contact: z.object({
    firstName: z.string().trim().min(2).max(80),
    lastName: z.string().trim().min(2).max(80),
    email: z.string().trim().email().max(254),
    phone: z.string().trim().min(8).max(30),
    company: z.string().trim().min(2).max(120),
  }),
  dimensions: z.object({
    length: z.number().positive().max(10000),
    width: z.number().positive().max(10000),
    height: z.number().positive().max(10000),
    unit: z.enum(DIMENSION_UNITS),
  }),
  quantity: z.number().int().min(1).max(10_000_000),
  materialType: z.enum(MATERIAL_TYPES),
  materialNotes: z.string().trim().max(2000).optional(),
  deliveryUrgency: z.enum(DELIVERY_URGENCY),
  designFiles: z.array(designFileSchema).max(5).default([]),
});

export type CustomOrderPayload = z.infer<typeof customOrderPayloadSchema>;

export const MATERIAL_LABELS: Record<(typeof MATERIAL_TYPES)[number], string> = {
  food_grade: "Food grade",
  industrial: "Industrial",
  eco_friendly: "Eco-friendly",
};

export const URGENCY_LABELS: Record<(typeof DELIVERY_URGENCY)[number], string> = {
  standard: "Standard (7–14 business days)",
  express: "Express (3–5 business days)",
  rush: "Rush (1–2 business days)",
};

export function validateCustomOrderPayload(data: unknown): CustomOrderPayload {
  return customOrderPayloadSchema.parse(data);
}

export function assertDesignPathsBelongToOrder(
  orderId: string,
  designFiles: CustomOrderPayload["designFiles"]
): void {
  const prefix = `custom_orders/${orderId}/designs/`;
  for (const file of designFiles) {
    if (!file.storagePath.startsWith(prefix)) {
      throw new Error(`Design file path must be under ${prefix}`);
    }
    const allowedTypes = /^image\//.test(file.contentType) || file.contentType === "application/pdf";
    if (!allowedTypes) {
      throw new Error(`Unsupported file type: ${file.contentType}`);
    }
  }
}
