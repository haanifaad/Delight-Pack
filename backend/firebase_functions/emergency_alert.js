const admin = require('firebase-admin');

const TEMP_THRESHOLD = 180.0; // Celsius

/**
 * Checks if a machine's temperature exceeds the threshold and sends an FCM alert if so.
 * @param {string} machineId 
 * @param {number} currentTemp 
 */
async function checkAndSendEmergencyAlert(machineId, currentTemp) {
    if (currentTemp <= TEMP_THRESHOLD) return;

    console.warn(`CRITICAL: Machine ${machineId} is overheating at ${currentTemp}°C!`);

    // Fetch all L4 Admin device tokens
    const db = admin.database();
    const adminsSnapshot = await db.ref('users').orderByChild('role_level').equalTo(4).once('value');
    
    if (!adminsSnapshot.exists()) {

        return;
    }

    const tokens = [];
    adminsSnapshot.forEach((childSnapshot) => {
        const userData = childSnapshot.val();
        if (userData.fcm_tokens) {
            // Assuming fcm_tokens is an array or object mapping devices
            const userTokens = Object.values(userData.fcm_tokens);
            tokens.push(...userTokens);
        }
    });

    if (tokens.length === 0) {

        return;
    }

    const payload = {
        notification: {
            title: '🔥 EMERGENCY ALARM 🔥',
            body: `Machine ${machineId} is critically overheating (${currentTemp}°C). Immediate action required!`,
        },
        android: {
            notification: {
                priority: 'high',
                sound: 'siren.mp3', // Custom loud notification sound
                color: '#FF0000',
            }
        },
        apns: {
            payload: {
                aps: {
                    sound: 'siren.wav', // Custom sound for iOS
                }
            }
        },
        tokens: tokens,
    };

    try {
        const response = await admin.messaging().sendMulticast(payload);

        if (response.failureCount > 0) {
            console.error(`Failed to send to ${response.failureCount} devices.`);
        }
        
        // Update machine status to Overheating in RTDB
        await db.ref(`factory/machines/${machineId}`).update({ status: 'Overheating' });
    } catch (error) {
        console.error('Error sending emergency multicast alert:', error);
    }
}

module.exports = {
    checkAndSendEmergencyAlert
};
