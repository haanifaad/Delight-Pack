"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.URGENCY_LABELS = exports.MATERIAL_LABELS = exports.customOrderPayloadSchema = exports.DIMENSION_UNITS = exports.DELIVERY_URGENCY = exports.MATERIAL_TYPES = void 0;
exports.validateCustomOrderPayload = validateCustomOrderPayload;
exports.assertDesignPathsBelongToOrder = assertDesignPathsBelongToOrder;
const zod_1 = require("zod");
exports.MATERIAL_TYPES = ["food_grade", "industrial", "eco_friendly"];
exports.DELIVERY_URGENCY = ["standard", "express", "rush"];
exports.DIMENSION_UNITS = ["cm", "mm", "in"];
const designFileSchema = zod_1.z.object({
    storagePath: zod_1.z.string().min(1).max(500),
    fileName: zod_1.z.string().min(1).max(255),
    contentType: zod_1.z.string().min(1).max(100),
    sizeBytes: zod_1.z.number().int().positive().max(10 * 1024 * 1024),
});
exports.customOrderPayloadSchema = zod_1.z.object({
    orderId: zod_1.z.string().uuid("Invalid order reference"),
    contact: zod_1.z.object({
        firstName: zod_1.z.string().trim().min(2).max(80),
        lastName: zod_1.z.string().trim().min(2).max(80),
        email: zod_1.z.string().trim().email().max(254),
        phone: zod_1.z.string().trim().min(8).max(30),
        company: zod_1.z.string().trim().min(2).max(120),
    }),
    dimensions: zod_1.z.object({
        length: zod_1.z.number().positive().max(10000),
        width: zod_1.z.number().positive().max(10000),
        height: zod_1.z.number().positive().max(10000),
        unit: zod_1.z.enum(exports.DIMENSION_UNITS),
    }),
    quantity: zod_1.z.number().int().min(1).max(10_000_000),
    materialType: zod_1.z.enum(exports.MATERIAL_TYPES),
    materialNotes: zod_1.z.string().trim().max(2000).optional(),
    deliveryUrgency: zod_1.z.enum(exports.DELIVERY_URGENCY),
    designFiles: zod_1.z.array(designFileSchema).max(5).default([]),
});
exports.MATERIAL_LABELS = {
    food_grade: "Food grade",
    industrial: "Industrial",
    eco_friendly: "Eco-friendly",
};
exports.URGENCY_LABELS = {
    standard: "Standard (7–14 business days)",
    express: "Express (3–5 business days)",
    rush: "Rush (1–2 business days)",
};
function validateCustomOrderPayload(data) {
    return exports.customOrderPayloadSchema.parse(data);
}
function assertDesignPathsBelongToOrder(orderId, designFiles) {
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
//# sourceMappingURL=validateCustomOrder.js.map