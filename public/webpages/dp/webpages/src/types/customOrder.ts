export const MATERIAL_TYPES = ["food_grade", "industrial", "eco_friendly"] as const;
export const DELIVERY_URGENCY = ["standard", "express", "rush"] as const;
export const DIMENSION_UNITS = ["cm", "mm", "in"] as const;

export type MaterialType = (typeof MATERIAL_TYPES)[number];
export type DeliveryUrgency = (typeof DELIVERY_URGENCY)[number];
export type DimensionUnit = (typeof DIMENSION_UNITS)[number];

export interface DesignFileMeta {
  storagePath: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
}

export interface CustomOrderSubmitPayload {
  orderId: string;
  contact: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company: string;
  };
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: DimensionUnit;
  };
  quantity: number;
  materialType: MaterialType;
  materialNotes?: string;
  deliveryUrgency: DeliveryUrgency;
  designFiles: DesignFileMeta[];
}

export const MATERIAL_OPTIONS: { value: MaterialType; label: string; description: string }[] = [
  { value: "food_grade", label: "Food grade", description: "FDA-compliant materials for food & beverage" },
  { value: "industrial", label: "Industrial", description: "Heavy-duty corrugated and rigid packaging" },
  { value: "eco_friendly", label: "Eco-friendly", description: "Recycled and biodegradable options" },
];

export const URGENCY_OPTIONS: { value: DeliveryUrgency; label: string; description: string }[] = [
  { value: "standard", label: "Standard", description: "7–14 business days" },
  { value: "express", label: "Express", description: "3–5 business days" },
  { value: "rush", label: "Rush", description: "1–2 business days" },
];
