import type { CustomOrderPayload } from "./validateCustomOrder";
import { MATERIAL_LABELS } from "./validateCustomOrder";
import { UAE_VAT_RATE, INVOICE_CURRENCY } from "./companyBranding";
import type { OrderPricing } from "./orderTypes";

const MATERIAL_RATE_PER_SQ_CM: Record<CustomOrderPayload["materialType"], number> = {
  food_grade: 0.018,
  industrial: 0.014,
  eco_friendly: 0.016,
};

const URGENCY_PRINT_MULTIPLIER: Record<CustomOrderPayload["deliveryUrgency"], number> = {
  standard: 1,
  express: 1.15,
  rush: 1.35,
};

function dimensionsToCm(
  dimensions: CustomOrderPayload["dimensions"]
): { length: number; width: number; height: number } {
  const { length, width, height, unit } = dimensions;
  if (unit === "cm") return { length, width, height };
  if (unit === "mm") return { length: length / 10, width: width / 10, height: height / 10 };
  return { length: length * 2.54, width: width * 2.54, height: height * 2.54 };
}

/** Surface-area proxy (cm²) for corrugated sheet estimate. */
function estimateMaterialAreaSqCm(dimensions: CustomOrderPayload["dimensions"], quantity: number): number {
  const { length, width, height } = dimensionsToCm(dimensions);
  const unitArea = 2 * (length * width + width * height + height * length);
  return unitArea * quantity;
}

export function buildMaterialLineDescription(payload: CustomOrderPayload): string {
  const { dimensions, quantity, materialType } = payload;
  const dims = `${dimensions.length} × ${dimensions.width} × ${dimensions.height} ${dimensions.unit}`;
  return `${MATERIAL_LABELS[materialType]} board — ${dims} · Qty ${quantity.toLocaleString("en-AE")}`;
}

export function buildPrintingLineDescription(payload: CustomOrderPayload): string {
  const fileCount = payload.designFiles.length;
  const urgency = payload.deliveryUrgency;
  const artwork = fileCount > 0 ? `${fileCount} artwork file(s)` : "Standard print setup";
  return `Printing & finishing (${artwork}) — ${urgency} delivery`;
}

export function calculateOrderPricing(payload: CustomOrderPayload): OrderPricing {
  const areaSqCm = estimateMaterialAreaSqCm(payload.dimensions, payload.quantity);
  const materialRate = MATERIAL_RATE_PER_SQ_CM[payload.materialType];
  const materialCost = Math.max(250, Math.round(areaSqCm * materialRate * 100) / 100);

  const printSetup = 180;
  const perUnitPrint = 0.12 * URGENCY_PRINT_MULTIPLIER[payload.deliveryUrgency];
  const designSurcharge = payload.designFiles.length * 45;
  const printingCost =
    Math.round((printSetup + payload.quantity * perUnitPrint + designSurcharge) * 100) / 100;

  const subtotal = Math.round((materialCost + printingCost) * 100) / 100;
  const vatAmount = Math.round(subtotal * UAE_VAT_RATE * 100) / 100;
  const total = Math.round((subtotal + vatAmount) * 100) / 100;

  return {
    materialCost,
    printingCost,
    subtotal,
    vatRate: UAE_VAT_RATE,
    vatAmount,
    total,
    currency: INVOICE_CURRENCY,
  };
}
