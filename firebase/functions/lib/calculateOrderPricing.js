"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildMaterialLineDescription = buildMaterialLineDescription;
exports.buildPrintingLineDescription = buildPrintingLineDescription;
exports.calculateOrderPricing = calculateOrderPricing;
const validateCustomOrder_1 = require("./validateCustomOrder");
const companyBranding_1 = require("./companyBranding");
const MATERIAL_RATE_PER_SQ_CM = {
    food_grade: 0.018,
    industrial: 0.014,
    eco_friendly: 0.016,
};
const URGENCY_PRINT_MULTIPLIER = {
    standard: 1,
    express: 1.15,
    rush: 1.35,
};
function dimensionsToCm(dimensions) {
    const { length, width, height, unit } = dimensions;
    if (unit === "cm")
        return { length, width, height };
    if (unit === "mm")
        return { length: length / 10, width: width / 10, height: height / 10 };
    return { length: length * 2.54, width: width * 2.54, height: height * 2.54 };
}
/** Surface-area proxy (cm²) for corrugated sheet estimate. */
function estimateMaterialAreaSqCm(dimensions, quantity) {
    const { length, width, height } = dimensionsToCm(dimensions);
    const unitArea = 2 * (length * width + width * height + height * length);
    return unitArea * quantity;
}
function buildMaterialLineDescription(payload) {
    const { dimensions, quantity, materialType } = payload;
    const dims = `${dimensions.length} × ${dimensions.width} × ${dimensions.height} ${dimensions.unit}`;
    return `${validateCustomOrder_1.MATERIAL_LABELS[materialType]} board — ${dims} · Qty ${quantity.toLocaleString("en-AE")}`;
}
function buildPrintingLineDescription(payload) {
    const fileCount = payload.designFiles.length;
    const urgency = payload.deliveryUrgency;
    const artwork = fileCount > 0 ? `${fileCount} artwork file(s)` : "Standard print setup";
    return `Printing & finishing (${artwork}) — ${urgency} delivery`;
}
function calculateOrderPricing(payload) {
    const areaSqCm = estimateMaterialAreaSqCm(payload.dimensions, payload.quantity);
    const materialRate = MATERIAL_RATE_PER_SQ_CM[payload.materialType];
    const materialCost = Math.max(250, Math.round(areaSqCm * materialRate * 100) / 100);
    const printSetup = 180;
    const perUnitPrint = 0.12 * URGENCY_PRINT_MULTIPLIER[payload.deliveryUrgency];
    const designSurcharge = payload.designFiles.length * 45;
    const printingCost = Math.round((printSetup + payload.quantity * perUnitPrint + designSurcharge) * 100) / 100;
    const subtotal = Math.round((materialCost + printingCost) * 100) / 100;
    const vatAmount = Math.round(subtotal * companyBranding_1.UAE_VAT_RATE * 100) / 100;
    const total = Math.round((subtotal + vatAmount) * 100) / 100;
    return {
        materialCost,
        printingCost,
        subtotal,
        vatRate: companyBranding_1.UAE_VAT_RATE,
        vatAmount,
        total,
        currency: companyBranding_1.INVOICE_CURRENCY,
    };
}
//# sourceMappingURL=calculateOrderPricing.js.map