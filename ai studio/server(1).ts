import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
app.use(express.json());
const PORT = 3000;

// Centralized "Database" representing Realtime DB & Shared State
const factoryState = {
  machines: {
    'MACHINE_001': { id: 'MACHINE_001', name: 'Packaging Unit A', status: 'Online', temperature: 45, box_count: 1250, lastUpdate: Date.now() },
    'MACHINE_002': { id: 'MACHINE_002', name: 'Packaging Unit B', status: 'Online', temperature: 60, box_count: 890, lastUpdate: Date.now() },
    'MACHINE_003': { id: 'MACHINE_003', name: 'Conveyor Main', status: 'Online', temperature: 35, box_count: 4500, lastUpdate: Date.now() },
  },
  alerts: [] as any[]
};

// Prompt 7: Cloud Data Ingestion (Pub/Sub entrypoint)
app.post('/api/telemetry', (req, res) => {
  const { machine_id, temperature_celsius, timestamp } = req.body;
  const authHeader = req.headers.authorization;

  if (!authHeader || authHeader !== 'Bearer secure-factory-token') {
    return res.status(401).json({ error: 'Unauthorized IoT Device' });
  }

  if (!machine_id || temperature_celsius === undefined) {
    return res.status(400).json({ error: 'Invalid telemetry payload' });
  }

  // Pub/Sub Queue implementation would go here.
  // We simulate immediate execution of the worker below.

  // Prompt 8: Firebase Realtime Database Sync
  if (factoryState.machines[machine_id]) {
    factoryState.machines[machine_id].temperature = temperature_celsius;
    factoryState.machines[machine_id].lastUpdate = timestamp || Date.now();
    
    // Prompt 9: Emergency Overheating Alerts
    if (temperature_celsius > 180) {
      factoryState.machines[machine_id].status = 'Overheating';
      
      const alert = {
        id: Date.now().toString(),
        machine_id,
        message: `CRITICAL: ${factoryState.machines[machine_id].name} temperature exceeded 180°C! (${temperature_celsius}°C)`,
        timestamp: Date.now(),
        level: 'critical'
      };
      
      // Ensure we don't spam identical alerts immediately
      const recentAlert = factoryState.alerts[0];
      if (!recentAlert || recentAlert.machine_id !== machine_id || (Date.now() - recentAlert.timestamp > 5000)) {
        factoryState.alerts.unshift(alert);
        // Simulated FCM Push
        console.log(`[FCM PUSH] To L4 Admins: ${alert.message}`);
      }
    } else if (factoryState.machines[machine_id].status === 'Overheating' && temperature_celsius < 150) {
       factoryState.machines[machine_id].status = 'Online';
    } else if (factoryState.machines[machine_id].status !== 'Overheating') {
       factoryState.machines[machine_id].status = 'Online';
    }
  }

  res.json({ success: true, message: 'Telemetry ingested via Pub/Sub' });
});

// Production Counter backend target
app.post('/api/counter', (req, res) => {
  const { machine_id, box_count, timestamp } = req.body;
  
  if (factoryState.machines[machine_id]) {
    factoryState.machines[machine_id].box_count += box_count;
    factoryState.machines[machine_id].lastUpdate = timestamp || Date.now();
  }
  
  res.json({ success: true });
});

// Endpoint for the Next.js/React Live Factory Floor Map Dashboard
app.get('/api/state', (req, res) => {
  res.json(factoryState);
});

// Clear alerts
app.post('/api/alerts/clear', (req, res) => {
  factoryState.alerts = [];
  res.json({ success: true });
});

// Vite middleware for full-stack SPA
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Factory IoT Backend running on port ${PORT}`);
  });
}

startServer();
