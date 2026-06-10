import { onCall, HttpsError, CallableRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

// Initialize admin app if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// Middleware to verify if user is staff (L3)
const verifyStaff = (request: CallableRequest<any>) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be logged in.');
  }
  // If we had a firm role:
  // if (request.auth.token.role !== 'staff' && request.auth.token.isAdmin !== true) { ... }
};

export const logMaterialUsage = onCall({ cors: true, enforceAppCheck: false }, async (request) => {
  verifyStaff(request);
  const { materialId, quantityUsed, type, reason } = request.data;

  if (!materialId || quantityUsed == null) {
    throw new HttpsError('invalid-argument', 'Missing materialId or quantity.');
  }

  const materialRef = db.collection('raw_materials').doc(materialId);
  const logRef = db.collection('material_logs').doc();

  await db.runTransaction(async (transaction) => {
    const doc = await transaction.get(materialRef);
    if (!doc.exists) {
      throw new HttpsError('not-found', 'Material not found.');
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

export const updateOrderStatus = onCall({ cors: true, enforceAppCheck: false }, async (request) => {
  verifyStaff(request);
  const { orderId, newStatus } = request.data;

  if (!orderId || !newStatus) {
    throw new HttpsError('invalid-argument', 'Missing orderId or newStatus.');
  }

  await db.collection('production_orders').doc(orderId).update({
    status: newStatus,
    updatedAt: new Date().toISOString()
  });

  return { success: true };
});

export const updateMachineStatus = onCall({ cors: true, enforceAppCheck: false }, async (request) => {
  verifyStaff(request);
  const { machineId, status, downtimeReason } = request.data;

  await db.collection('machines').doc(machineId).update({
    status,
    downtimeReason: downtimeReason || null,
    lastUpdated: new Date().toISOString()
  });

  return { success: true };
});

export const assignDriver = onCall({ cors: true, enforceAppCheck: false }, async (request) => {
  verifyStaff(request);
  const { driverId, orderIds } = request.data;

  await db.collection('dispatch_drivers').doc(driverId).update({
    assignedOrderIds: orderIds,
    vehicleStatus: 'Loading'
  });

  return { success: true };
});

export interface DispatchDriver {
  // Keeping as context for file modification.
}

export const postShiftLog = onCall({ cors: true, enforceAppCheck: false }, async (request) => {
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

export const createMaintenanceOrder = onCall({ cors: true, enforceAppCheck: false }, async (request) => {
  verifyStaff(request);
  const { machineName, issueDescription, priority } = request.data;
  
  if (!machineName || !issueDescription) {
    throw new HttpsError('invalid-argument', 'Missing machineName or issueDescription.');
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

export const processRMA = onCall({ cors: true, enforceAppCheck: false }, async (request) => {
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

export const logCycleCount = onCall({ cors: true, enforceAppCheck: false }, async (request) => {
  verifyStaff(request);
  const { materialId, actualCount } = request.data;

  const materialRef = db.collection('raw_materials').doc(materialId);
  const varianceRef = db.collection('inventory_variances').doc();

  await db.runTransaction(async (transaction) => {
    const doc = await transaction.get(materialRef);
    if (!doc.exists) return;

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

export const updateQuarantineStatus = onCall({ cors: true, enforceAppCheck: false }, async (request) => {
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

export const logInkMixing = onCall({ cors: true, enforceAppCheck: false }, async (request) => {
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

export const generateGatePass = onCall({ cors: true, enforceAppCheck: false }, async (request) => {
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

export const reportIncident = onCall({ cors: true, enforceAppCheck: false }, async (request) => {
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

export const requestShiftSwap = onCall({ cors: true, enforceAppCheck: false }, async (request) => {
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

export const logQualityAudit = onCall({ cors: true, enforceAppCheck: false }, async (request) => {
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

export const updateEcoMetrics = onCall({ cors: true, enforceAppCheck: false }, async (request) => {
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
