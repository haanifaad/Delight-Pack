const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { checkAndSendEmergencyAlert } = require('./emergency_alert');

admin.initializeApp();

// Cloud Function subscribed to the Pub/Sub topic "factory-telemetry"
exports.processFactoryTelemetry = functions.pubsub.topic('factory-telemetry').onPublish(async (message) => {
    let payload = null;
    try {
        payload = message.json;
    } catch (e) {
        console.error('Failed to parse message JSON', e);
        return null;
    }

    if (!payload || !payload.machine_id) {
        console.error('Invalid payload or missing machine_id');
        return null;
    }

    const machineId = payload.machine_id;
    const db = admin.database();
    const machineRef = db.ref(`factory/machines/${machineId}`);

    const updates = {
        last_updated: admin.database.ServerValue.TIMESTAMP,
        status: 'Online'
    };

    if (payload.temperature_celsius !== undefined) {
        updates.temperature = payload.temperature_celsius;
        
        // Trigger Emergency Alert if needed
        await checkAndSendEmergencyAlert(machineId, payload.temperature_celsius);
    }

    if (payload.box_count !== undefined) {
        // Use a transaction to safely increment the box count
        await machineRef.child('total_boxes').transaction((currentBoxes) => {
            return (currentBoxes || 0) + payload.box_count;
        });
    }

    // Write instant updates to the RTDB
    await machineRef.update(updates);

    return null;
});
