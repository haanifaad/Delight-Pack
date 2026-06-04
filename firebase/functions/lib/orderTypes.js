"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCustomOrderPayload = toCustomOrderPayload;
/** Normalize Firestore nulls for functions that expect CustomOrderPayload. */
function toCustomOrderPayload(doc) {
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
//# sourceMappingURL=orderTypes.js.map