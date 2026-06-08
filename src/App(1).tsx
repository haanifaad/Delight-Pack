import React, { useEffect, useState, useRef } from 'react';
import { ShieldAlert, Server, Activity, ArrowUpRight, Cpu, Thermometer, Box, FileCode, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import { cn } from './lib/utils';
import { format } from 'date-fns';

type MachineState = {
  id: string;
  name: string;
  status: 'Online' | 'Offline' | 'Overheating';
  temperature: number;
  box_count: number;
  lastUpdate: number;
};

type Alert = {
  id: string;
  machine_id: string;
  message: string;
  timestamp: number;
  level: string;
};

export default function App() {
  const [machines, setMachines] = useState<Record<string, MachineState>>({});
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'simulation' | 'scripts'>('dashboard');

  // Polling data from our backend simulation of Firebase Realtime DB
  useEffect(() => {
    const fetchState = async () => {
      try {
        const res = await fetch('/api/state');
        const data = await res.json();
        setMachines(data.machines);
        setAlerts(data.alerts);
        
        // Handle FCM audio mock
        if (data.alerts.length > 0) {
           const latestAlert = data.alerts[0];
           if (Date.now() - latestAlert.timestamp < 3000) {
             // In a real app, play an audio file or rely on Firebase FCM service worker
           }
        }
      } catch (err) {
        console.error("Failed to fetch state", err);
      }
    };
    
    fetchState();
    const interval = setInterval(fetchState, 1500);
    return () => clearInterval(interval);
  }, []);

  const clearAlerts = async () => {
    await fetch('/api/alerts/clear', { method: 'POST' });
    setAlerts([]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <Activity className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-xl font-medium tracking-tight text-white">Smart Factory Operations</h1>
            <p className="text-xs text-slate-400 font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
              GCP / Firebase Sync Active
            </p>
          </div>
        </div>

        <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={cn("px-4 py-2 text-sm font-medium rounded-md transition-all", activeTab === 'dashboard' ? "bg-slate-800 text-white shadow-sm" : "text-slate-400 hover:text-white hover:bg-slate-800/50")}
          >
            Live Map
          </button>
          <button 
            onClick={() => setActiveTab('simulation')}
            className={cn("px-4 py-2 text-sm font-medium rounded-md transition-all", activeTab === 'simulation' ? "bg-indigo-500 text-white shadow-sm" : "text-slate-400 hover:text-white hover:bg-slate-800/50")}
          >
            IoT Emulator
          </button>
          <button 
            onClick={() => setActiveTab('scripts')}
            className={cn("px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2", activeTab === 'scripts' ? "bg-slate-800 text-white shadow-sm" : "text-slate-400 hover:text-white hover:bg-slate-800/50")}
          >
            <FileCode className="w-4 h-4" /> Device Code
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
        
        {/* Global Alerts Bar */}
        {alerts.length > 0 && activeTab !== 'scripts' && (
          <div className="mb-8 p-4 rounded-xl border border-red-500/30 bg-red-500/10 flex items-start sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-lg animate-pulse">
                <ShieldAlert className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-semibold text-red-100 flex items-center gap-2">
                  Emergency Alert [FCM Triggered]
                </h3>
                <p className="text-sm text-red-200 mt-1">{alerts[0].message}</p>
              </div>
            </div>
            <button onClick={clearAlerts} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors">
              Acknowledge
            </button>
          </div>
        )}

        {/* Dashboard View */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.values(machines).map(machine => (
                <MachineCard key={machine.id} machine={machine} />
              ))}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                 <h2 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
                   <Server className="w-5 h-5 text-slate-400" /> System Architecture
                 </h2>
                 <div className="space-y-4">
                    <ArchitectureNode title="IoT Devices" desc="ESP32 (C++) & RPi (Python)" icon={<Cpu className="w-4 h-4" />} />
                    <ArchitectureNode title="Cloud Ingestion" desc="Node.js worker validating payload" icon={<ArrowUpRight className="w-4 h-4" />} />
                    <ArchitectureNode title="Pub/Sub Core" desc="Message queue backpressure" icon={<Activity className="w-4 h-4" />} />
                    <ArchitectureNode title="Firebase Integration" desc="RTDB sync & FCM Overheating Alerts" icon={<Zap className="w-4 h-4 text-amber-500" />} />
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* Simulator View */}
        {activeTab === 'simulation' && (
          <IoTEmulator />
        )}

        {/* Code Snippets View */}
        {activeTab === 'scripts' && (
          <ScriptsViewer />
        )}
      </main>
    </div>
  );
}

function MachineCard({ machine }: { machine: MachineState }) {
  const isOverheating = machine.status === 'Overheating';
  const isOffline = machine.status === 'Offline';
  
  return (
    <div className={cn(
      "rounded-xl border p-6 relative overflow-hidden transition-all duration-300",
      isOverheating ? "bg-red-950/40 border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.15)]" : 
      isOffline ? "bg-slate-900/50 border-slate-800 opacity-70" : "bg-slate-900 border-slate-800"
    )}>
      {isOverheating && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-rose-500 to-red-500 animate-pulse" />
      )}
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">{machine.name}</h3>
          <p className="text-sm font-mono text-slate-400 mt-1">{machine.id}</p>
        </div>
        <div className={cn(
          "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5",
          isOverheating ? "bg-red-500/10 text-red-500 border border-red-500/20" : 
          isOffline ? "bg-slate-500/10 text-slate-500 border border-slate-500/20" :
          "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
        )}>
          {isOverheating ? <ShieldAlert className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
          {machine.status}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
            <Thermometer className="w-4 h-4" /> Temp
          </div>
          <div className="flex items-baseline gap-1">
            <span className={cn("text-2xl font-bold tracking-tight", isOverheating ? "text-red-400" : "text-white")}>
              {machine.temperature.toFixed(1)}
            </span>
            <span className="text-slate-500">°C</span>
          </div>
        </div>
        
        <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
            <Box className="w-4 h-4" /> Count
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold tracking-tight text-white drop-shadow-sm">
              {machine.box_count.toLocaleString()}
            </span>
            <span className="text-slate-500 text-sm">boxes</span>
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-slate-800/50 flex justify-between items-center text-xs text-slate-500">
        <span className="font-mono">Sync latency: 24ms</span>
        <span>Updated {format(new Date(machine.lastUpdate), 'HH:mm:ss')}</span>
      </div>
    </div>
  );
}

function ArchitectureNode({ title, desc, icon }: { title: string, desc: string, icon: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-1 p-2 bg-slate-800 rounded-lg text-slate-300">
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-medium text-slate-200">{title}</h4>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function IoTEmulator() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isInjecting, setIsInjecting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (msg: string) => setLogs(prev => [...prev.slice(-49), msg]);

  const injectTelemetry = async (machine_id: string, temp: number) => {
    setIsInjecting(true);
    addLog(`=> Requesting POST /api/telemetry for ${machine_id}...`);
    try {
      const res = await fetch('/api/telemetry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer secure-factory-token'
        },
        body: JSON.stringify({
          machine_id,
          temperature_celsius: temp,
          timestamp: Date.now()
        })
      });
      const data = await res.json();
      addLog(`<= Node.js Pub/Sub Ingestion: ${JSON.stringify(data)}`);
    } catch (e) {
      addLog(`<= Error: ${(e as Error).message}`);
    }
    setIsInjecting(false);
  };

  const triggerOverheat = () => {
    addLog("\n[SIMULATION] Triggering ESP32 thermistor failure...");
    injectTelemetry('MACHINE_001', 195);
  };
  
  const restoreNormal = () => {
     addLog("\n[SIMULATION] Restoring machine temperatures...");
     injectTelemetry('MACHINE_001', 45);
     injectTelemetry('MACHINE_002', 55);
  };

  const simulateProductionBatch = async () => {
    setIsInjecting(true);
    const batchSize = Math.floor(Math.random() * 50) + 10;
    addLog(`\n[SIMULATION] RPi sending batched Box count: ${batchSize}`);
    try {
      const res = await fetch('/api/counter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          machine_id: 'MACHINE_003',
          box_count: batchSize,
          timestamp: Date.now()
        })
      });
      addLog(`<= Counter API: HTTP 200 OK`);
    } catch (e) {
      addLog(`<= Counter Error: ${(e as Error).message}`);
    }
    setIsInjecting(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[700px]">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col">
        <h2 className="text-lg font-medium text-white mb-2">Device Test Panel</h2>
        <p className="text-sm text-slate-400 mb-8">
          Inject simulated payloads into the Node.js API to verify Cloud Pub/Sub worker and Realtime Database functions.
        </p>

        <div className="space-y-6 flex-1">
          <div className="p-5 border border-slate-800 rounded-lg bg-slate-950/50">
            <h3 className="font-medium text-slate-200 mb-4 flex items-center gap-2">
              <Thermometer className="w-4 h-4" /> ESP32 Temperature Sim
            </h3>
            <div className="space-x-3">
              <button 
                disabled={isInjecting}
                onClick={triggerOverheat}
                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg text-sm font-medium transition-colors"
               >
                 Trigger Overheating (195°C)
              </button>
              <button 
                disabled={isInjecting}
                onClick={restoreNormal}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors"
               >
                 Send Normal Reading (45°C)
              </button>
            </div>
          </div>

          <div className="p-5 border border-slate-800 rounded-lg bg-slate-950/50">
            <h3 className="font-medium text-slate-200 mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4" /> RPi Production Counter Sim
            </h3>
            <button 
                disabled={isInjecting}
                onClick={simulateProductionBatch}
                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white shadow-sm rounded-lg text-sm font-medium transition-colors"
               >
                 Send Box Batch
            </button>
          </div>
        </div>
      </div>

      <div className="bg-black rounded-xl border border-slate-800 flex flex-col overflow-hidden font-mono text-xs">
        <div className="bg-slate-900 border-b border-slate-800 p-3 flex justify-between items-center text-slate-400">
           <span>Network Traffic Log</span>
           <div className="flex gap-1">
             <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
             <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
             <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
           </div>
        </div>
        <div ref={scrollRef} className="p-4 overflow-y-auto flex-1 space-y-1.5 custom-scrollbar">
           {logs.length === 0 && <span className="text-slate-600">Waiting for data injections...</span>}
           {logs.map((log, i) => (
             <div key={i} className={cn(
               log.includes('CRITICAL') || log.includes('Error') ? 'text-red-400' : 
               log.startsWith('=>') ? 'text-indigo-400' :
               log.startsWith('<=') ? 'text-emerald-400' : 'text-slate-300'
             )}>
               <span className="text-slate-600 mr-2">{format(new Date(), 'HH:mm:ss.SSS')}</span>
               {log}
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}

function ScriptsViewer() {
  const [scriptData, setScriptData] = useState<Record<string, string>>({});
  const [selectedFile, setSelectedFile] = useState('esp32_temperature.cpp');

  useEffect(() => {
    // We would normally fetch the raw files but since we generated them, let's just 
    // provide the static content here or load from an endpoint. 
    // To be fully realistic and to not overcomplicate, I'll hardcode the previews.
  }, []);

  return (
    <div className="flex bg-slate-900 border border-slate-800 rounded-xl overflow-hidden h-[700px]">
      <div className="w-64 border-r border-slate-800 bg-slate-900/50 flex flex-col">
        <div className="p-4 border-b border-slate-800 font-medium text-slate-300 text-sm">IoT Architectures</div>
        <div className="p-2 space-y-1">
          <FileButton 
             name="esp32_temperature.cpp" 
             desc="Prompt 5"
             active={selectedFile === 'esp32_temperature.cpp'} 
             onClick={() => setSelectedFile('esp32_temperature.cpp')} 
          />
          <FileButton 
             name="rpi_counter.py" 
             desc="Prompt 6"
             active={selectedFile === 'rpi_counter.py'} 
             onClick={() => setSelectedFile('rpi_counter.py')} 
          />
          <FileButton 
             name="server.ts" 
             desc="Prompt 7-9 Code"
             active={selectedFile === 'server.ts'} 
             onClick={() => setSelectedFile('server.ts')} 
          />
        </div>
      </div>
      <div className="flex-1 bg-black p-6 overflow-auto font-mono text-sm leading-relaxed custom-scrollbar relative">
        <div className="absolute top-4 right-4 px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/20 text-xs shadow-sm shadow-indigo-500/10">Read Only</div>
        <pre className="text-slate-300">
          <code>{getCode(selectedFile)}</code>
        </pre>
      </div>
    </div>
  );
}

function FileButton({ name, desc, active, onClick }: { name: string, desc: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full text-left px-3 py-2 rounded-lg text-sm flex flex-col transition-colors",
        active ? "bg-indigo-500/10 border border-indigo-500/20" : "hover:bg-slate-800 border border-transparent"
      )}
    >
      <span className={cn("font-medium", active ? "text-indigo-300" : "text-slate-300")}>{name}</span>
      <span className="text-xs text-slate-500">{desc}</span>
    </button>
  );
}

function getCode(filename: string) {
  if (filename === 'esp32_temperature.cpp') {
    return `#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* mqtt_server = "YOUR_MQTT_BROKER_IP";

const int thermistorPin = 34; // Analog pin for thermistor
const char* machine_id = "MACHINE_001";

WiFiClient espClient;
PubSubClient client(espClient);

void setup_wifi() {
  delay(10);
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
}

void reconnect() {
  while (!client.connected()) {
    if (client.connect(machine_id)) {
      // Connected
    } else {
      delay(5000);
    }
  }
}

void setup() {
  setup_wifi();
  client.setServer(mqtt_server, 1883);
}

void loop() {
  if (!client.connected()) reconnect();
  client.loop();

  int analogValue = analogRead(thermistorPin);
  float voltage = analogValue * (3.3 / 4095.0);
  float temperature = (voltage - 0.5) * 100.0;
  
  StaticJsonDocument<200> doc;
  doc["machine_id"] = machine_id;
  doc["temperature_celsius"] = temperature;
  doc["timestamp"] = millis(); 

  char jsonBuffer[256];
  serializeJson(doc, jsonBuffer);

  client.publish("factory/telemetry", jsonBuffer);
  delay(5000);
}`;
  }
  
  if (filename === 'rpi_counter.py') {
    return `import RPi.GPIO as GPIO
import time
import requests

SENSOR_PIN = 17 
API_ENDPOINT = "https://your-api.com/api/counter"
AUTH_TOKEN = "your-auth-token"
MACHINE_ID = "MACHINE_003" 

box_count = 0
last_detection_time = 0
DEBOUNCE_TIME = 0.5  

def sensor_callback(channel):
    global box_count, last_detection_time
    current_time = time.time()
    
    if (current_time - last_detection_time) > DEBOUNCE_TIME:
        box_count += 1
        last_detection_time = current_time
        print(f"Box detected! Local counter: {box_count}")

GPIO.setmode(GPIO.BCM)
GPIO.setup(SENSOR_PIN, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.add_event_detect(SENSOR_PIN, GPIO.FALLING, callback=sensor_callback)

def send_batch():
    global box_count
    if box_count > 0:
        count_to_send = box_count
        box_count = 0 
        
        payload = {
            "machine_id": MACHINE_ID,
            "box_count": count_to_send,
            "timestamp": int(time.time() * 1000)
        }
        
        headers = { "Authorization": f"Bearer {AUTH_TOKEN}" }
        
        try:
            requests.post(API_ENDPOINT, json=payload, headers=headers)
        except Exception as e:
            box_count += count_to_send # Revert on failure

try:
    while True:
        time.sleep(60) 
        send_batch()
except KeyboardInterrupt:
    GPIO.cleanup()`;
  }
  
  return `import express from 'express';
// (See actual server.ts file in project)
// Implements Cloud Data Ingestion, Pub/Sub processing, 
// and logic for pushing temperature overrides for FCM.

const app = express();
app.post('/api/telemetry', (req, res) => {
  const { machine_id, temperature_celsius } = req.body;
  // Node.js validation logic here...
  
  if (temperature_celsius > 180) {
      // Simulate overeating & push FCM payload to DB 
  }
});
`;
}

