const express = require('express');
const { PubSub } = require('@google-cloud/pubsub');

const app = express();
app.use(express.json());

const pubSubClient = new PubSub();
const TOPIC_NAME = process.env.PUBSUB_TOPIC || 'factory-telemetry';

// Middleware for IoT device authentication
const verifyIotToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid token' });
    }
    const token = authHeader.split(' ')[1];
    
    // Replace with actual verification logic (e.g., against a DB or Secret Manager)
    const validTokens = ['your_iot_device_token', 'esp32_secret_token'];
    if (!validTokens.includes(token)) {
        return res.status(403).json({ error: 'Unauthorized device' });
    }
    next();
};

app.post('/ingest/telemetry', verifyIotToken, async (req, res) => {
    try {
        const payload = req.body;

        // Basic Validation
        if (!payload.machine_id) {
            return res.status(400).json({ error: 'Missing machine_id' });
        }

        // Convert payload to buffer
        const dataBuffer = Buffer.from(JSON.stringify(payload));

        // Publish to Pub/Sub
        const messageId = await pubSubClient.topic(TOPIC_NAME).publishMessage({ data: dataBuffer });

        res.status(200).json({ success: true, messageId });
    } catch (error) {
        console.error('Error publishing to Pub/Sub:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {

});
