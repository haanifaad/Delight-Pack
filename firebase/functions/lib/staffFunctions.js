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
exports.updateEcoMetrics = exports.logQualityAudit = exports.requestShiftSwap = exports.reportIncident = exports.generateGatePass = exports.logInkMixing = exports.updateQuarantineStatus = exports.logCycleCount = exports.processRMA = exports.createMaintenanceOrder = exports.postShiftLog = exports.assignDriver = exports.updateMachineStatus = exports.updateOrderStatus = exports.logMaterialUsage = void 0;
const https_1 = require("firebase-functions/v2/https");
const admin = __importStar(require("firebase-admin"));
// Initialize admin app if not already initialized
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();
// Middleware to verify if user is staff (L3)
const verifyStaff = (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'User must be logged in.');
    }
    // If we had a firm role:
    // if (request.auth.token.role !== 'staff' && request.auth.token.isAdmin !== true) { ... }
};
exports.logMaterialUsage = (0, https_1.onCall)({ cors: true, enforceAppCheck: false }, async (request) => {
    verifyStaff(request);
    const { materialId, quantityUsed, type, reason } = request.data;
    if (!materialId || quantityUsed == null) {
        throw new https_1.HttpsError('invalid-argument', 'Missing materialId or quantity.');
    }
    const materialRef = db.collection('raw_materials').doc(materialId);
    const logRef = db.collection('material_logs').doc();
    await db.runTransaction(async (transaction) => {
        const doc = await transaction.get(materialRef);
        if (!doc.exists) {
            throw new https_1.HttpsError('not-found', 'Material not found.');
        }
        const currentStock = doc.data()?.systemStock || 0;
        const newStock = currentStock - quantityUsed;
        transaction.update(materialRef, {
            systemStock: newStock,
            lastUpdated: new Date().toISOString()
        });
        transaction.set(logRef, {
            id: logRef.id,
            materialId,
            quantityUsed,
            staffId: request.auth?.uid,
            timestamp: new Date().toISOString(),
            type: type || 'production',
            reason: reason || ''
        });
    });
    return { success: true };
});
exports.updateOrderStatus = (0, https_1.onCall)({ cors: true, enforceAppCheck: false }, async (request) => {
    verifyStaff(request);
    const { orderId, newStatus } = request.data;
    if (!orderId || !newStatus) {
        throw new https_1.HttpsError('invalid-argument', 'Missing orderId or newStatus.');
    }
    await db.collection('production_orders').doc(orderId).update({
        status: newStatus,
        updatedAt: new Date().toISOString()
    });
    return { success: true };
});
exports.updateMachineStatus = (0, https_1.onCall)({ cors: true, enforceAppCheck: false }, async (request) => {
    verifyStaff(request);
    const { machineId, status, downtimeReason } = request.data;
    await db.collection('machines').doc(machineId).update({
        status,
        downtimeReason: downtimeReason || null,
        lastUpdated: new Date().toISOString()
    });
    return { success: true };
});
exports.assignDriver = (0, https_1.onCall)({ cors: true, enforceAppCheck: false }, async (request) => {
    verifyStaff(request);
    const { driverId, orderIds } = request.data;
    await db.collection('dispatch_drivers').doc(driverId).update({
        assignedOrderIds: orderIds,
        vehicleStatus: 'Loading'
    });
    return { success: true };
});
exports.postShiftLog = (0, https_1.onCall)({ cors: true, enforceAppCheck: false }, async (request) => {
    verifyStaff(request);
    const { message } = request.data;
    const logRef = db.collection('shift_logs').doc();
    await logRef.set({
        id: logRef.id,
        staffId: request.auth?.uid,
        message,
        timestamp: new Date().toISOString()
    });
    return { success: true };
});
// --- Phase 4 & 5 Functions ---
exports.createMaintenanceOrder = (0, https_1.onCall)({ cors: true, enforceAppCheck: false }, async (request) => {
    verifyStaff(request);
    const { machineName, issueDescription, priority } = request.data;
    if (!machineName || !issueDescription) {
        throw new https_1.HttpsError('invalid-argument', 'Missing machineName or issueDescription.');
    }
    const orderRef = db.collection('maintenance_orders').doc();
    await orderRef.set({
        id: orderRef.id,
        machineName,
        issueDescription,
        priority: priority || 'Medium',
        status: 'Pending',
        createdAt: new Date().toISOString()
    });
    return { success: true };
});
exports.processRMA = (0, https_1.onCall)({ cors: true, enforceAppCheck: false }, async (request) => {
    verifyStaff(request);
    const { supplierName, itemName, reason } = request.data;
    const rmaRef = db.collection('rmas').doc();
    await rmaRef.set({
        id: rmaRef.id,
        supplierName,
        itemName,
        reason,
        status: 'Pending Approval',
        createdAt: new Date().toISOString()
    });
    return { success: true };
});
exports.logCycleCount = (0, https_1.onCall)({ cors: true, enforceAppCheck: false }, async (request) => {
    verifyStaff(request);
    const { materialId, actualCount } = request.data;
    const materialRef = db.collection('raw_materials').doc(materialId);
    const varianceRef = db.collection('inventory_variances').doc();
    await db.runTransaction(async (transaction) => {
        const doc = await transaction.get(materialRef);
        if (!doc.exists)
            return;
        const currentStock = doc.data()?.systemStock || 0;
        const variance = actualCount - currentStock;
        if (variance !== 0) {
            transaction.set(varianceRef, {
                id: varianceRef.id,
                materialId,
                expectedStock: currentStock,
                actualCount,
                variance,
                timestamp: new Date().toISOString()
            });
            transaction.update(materialRef, {
                systemStock: actualCount,
                lastUpdated: new Date().toISOString()
            });
        }
    });
    return { success: true };
});
exports.updateQuarantineStatus = (0, https_1.onCall)({ cors: true, enforceAppCheck: false }, async (request) => {
    verifyStaff(request);
    const { batchId, isQuarantined, reason } = request.data;
    await db.collection('quarantine_logs').doc().set({
        batchId,
        isQuarantined,
        reason,
        timestamp: new Date().toISOString(),
        staffId: request.auth?.uid
    });
    return { success: true };
});
exports.logInkMixing = (0, https_1.onCall)({ cors: true, enforceAppCheck: false }, async (request) => {
    verifyStaff(request);
    const { targetPantone, totalAmountKg, components } = request.data;
    await db.collection('ink_mixing_logs').doc().set({
        targetPantone,
        totalAmountKg,
        components, // array of { color: string, percentage: number, amount: number }
        timestamp: new Date().toISOString(),
        staffId: request.auth?.uid
    });
    return { success: true };
});
// --- Phase 6 & 7 Functions ---
exports.generateGatePass = (0, https_1.onCall)({ cors: true, enforceAppCheck: false }, async (request) => {
    verifyStaff(request);
    const { courierName, vehiclePlate, linkedOrders } = request.data;
    const passRef = db.collection('gate_passes').doc();
    await passRef.set({
        id: passRef.id,
        courierName,
        vehiclePlate,
        linkedOrders,
        issuedBy: request.auth?.uid,
        timestamp: new Date().toISOString(),
        status: 'Active'
    });
    return { success: true };
});
exports.reportIncident = (0, https_1.onCall)({ cors: true, enforceAppCheck: false }, async (request) => {
    verifyStaff(request);
    const { description, type } = request.data;
    const incidentRef = db.collection('incident_reports').doc();
    await incidentRef.set({
        id: incidentRef.id,
        description,
        type,
        reportedBy: request.auth?.uid,
        timestamp: new Date().toISOString(),
        status: 'Open'
    });
    return { success: true };
});
exports.requestShiftSwap = (0, https_1.onCall)({ cors: true, enforceAppCheck: false }, async (request) => {
    verifyStaff(request);
    const { targetUserId, requesterShift, targetShift } = request.data;
    const swapRef = db.collection('shift_swaps').doc();
    await swapRef.set({
        id: swapRef.id,
        requesterId: request.auth?.uid,
        targetUserId,
        requesterShift,
        targetShift,
        status: 'Pending',
        timestamp: new Date().toISOString()
    });
    return { success: true };
});
// --- Phase 9 & 10 Functions ---
exports.logQualityAudit = (0, https_1.onCall)({ cors: true, enforceAppCheck: false }, async (request) => {
    verifyStaff(request);
    const { target, status, notes } = request.data;
    const auditRef = db.collection('quality_audits').doc();
    await auditRef.set({
        id: auditRef.id,
        target,
        status,
        notes,
        staffId: request.auth?.uid,
        timestamp: new Date().toISOString()
    });
    return { success: true };
});
exports.updateEcoMetrics = (0, https_1.onCall)({ cors: true, enforceAppCheck: false }, async (request) => {
    verifyStaff(request);
    const { type, value, unit } = request.data;
    const ecoRef = db.collection('eco_metrics').doc();
    await ecoRef.set({
        id: ecoRef.id,
        type,
        value,
        unit,
        loggedBy: request.auth?.uid,
        timestamp: new Date().toISOString()
    });
    return { success: true };
});
//# sourceMappingURL=staffFunctions.js.map