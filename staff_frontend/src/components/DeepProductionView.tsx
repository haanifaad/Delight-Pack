import { useState, useEffect } from 'react';
import { Wrench, Droplet, ThermometerSun, Waypoints, Activity, AlertOctagon } from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '../firebase';
import type { MaintenanceOrder } from '../types';

export default function DeepProductionView() {
  const [activeTab, setActiveTab] = useState<'maintenance' | 'ink_formulas' | 'environmental' | 'yield_routing'>('maintenance');
  const [mOrders, setMOrders] = useState<MaintenanceOrder[]>([]);
  const createMaintenanceOrder = httpsCallable(functions, 'staff-createMaintenanceOrder');

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'maintenance_orders'), snapshot => {
      setMOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MaintenanceOrder)));
    });
    return () => unsub();
  }, []);

  const handleCreateMO = async () => {
    try {
      await createMaintenanceOrder({ machineName: 'Test Machine', issueDescription: 'Test Issue', priority: 'High' });
      alert('Maintenance Order Created (Test Data)');
    } catch (e) {
      console.error(e);
      alert('Failed to create order');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex border-b border-gray-100 bg-indigo-50 rounded-t-xl overflow-x-auto">
        <button onClick={() => setActiveTab('maintenance')} className={`px-6 py-4 font-bold text-sm whitespace-nowrap ${activeTab === 'maintenance' ? 'text-indigo-700 border-b-2 border-indigo-700 bg-white' : 'text-indigo-900/60 hover:bg-white/50'}`}>Maintenance & Tools</button>
        <button onClick={() => setActiveTab('ink_formulas')} className={`px-6 py-4 font-bold text-sm whitespace-nowrap ${activeTab === 'ink_formulas' ? 'text-indigo-700 border-b-2 border-indigo-700 bg-white' : 'text-indigo-900/60 hover:bg-white/50'}`}>Ink & Chemicals</button>
        <button onClick={() => setActiveTab('environmental')} className={`px-6 py-4 font-bold text-sm whitespace-nowrap ${activeTab === 'environmental' ? 'text-indigo-700 border-b-2 border-indigo-700 bg-white' : 'text-indigo-900/60 hover:bg-white/50'}`}>Environment & Energy</button>
        <button onClick={() => setActiveTab('yield_routing')} className={`px-6 py-4 font-bold text-sm whitespace-nowrap ${activeTab === 'yield_routing' ? 'text-indigo-700 border-b-2 border-indigo-700 bg-white' : 'text-indigo-900/60 hover:bg-white/50'}`}>Yield & Job Routing</button>
      </div>

      <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
        {activeTab === 'maintenance' && (
          <div className="flex gap-6 h-full">
            <div className="flex-1 space-y-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Wrench size={20} className="text-indigo-600"/> Maintenance Work Orders</h3>
                <div className="space-y-3">
                  {mOrders.map((wo, i) => (
                    <div key={i} className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-gray-800">{wo.machineName}</h4>
                        <p className="text-sm text-gray-600">{wo.issueDescription}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${wo.priority === 'High' ? 'bg-red-100 text-red-800' : wo.priority === 'Medium' ? 'bg-orange-100 text-orange-800' : 'bg-gray-200 text-gray-700'}`}>
                          {wo.priority} Priority
                        </span>
                        <span className="text-xs font-bold text-indigo-600 uppercase">{wo.status}</span>
                      </div>
                    </div>
                  ))}
                  {mOrders.length === 0 && <p className="text-sm text-gray-500 p-4 text-center">No maintenance orders pending.</p>}
                </div>
                <button onClick={handleCreateMO} className="w-full mt-4 border-2 border-dashed border-gray-300 text-gray-500 hover:text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50 font-bold py-3 rounded-lg transition-colors">
                  + Create New Work Order
                </button>
              </div>
            </div>
            
            <div className="w-1/3 flex flex-col gap-6">
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-orange-900 mb-2 flex items-center gap-2"><Activity size={18}/> Predictive Alerts</h3>
                <p className="text-sm text-orange-800 mb-4">AI analysis of motor vibration data indicates potential anomalies.</p>
                <div className="bg-white p-3 rounded border border-orange-200 text-sm">
                  <span className="font-bold">Die Cutter Beta:</span> Motor 3 vibration increased by 14% over last 48 hours. Suggest bearing inspection.
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex-1">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">Digital Tool Crib</h3>
                <input type="text" placeholder="Scan or search tool..." className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 mb-4" />
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                    <span className="text-sm font-semibold">Torque Wrench (TW-01)</span>
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">Available</span>
                  </div>
                  <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                    <span className="text-sm font-semibold">Calipers (CA-04)</span>
                    <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded">Checked Out (Ahmed)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ink_formulas' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-black text-gray-800 mb-2 flex items-center gap-2"><Droplet className="text-indigo-600"/> Ink Mixing Formulas</h2>
              <p className="text-gray-500 mb-6">Select a target Pantone to generate precise mixing ratios by weight.</p>

              <div className="flex gap-4 mb-6">
                <input type="text" placeholder="e.g. PMS 185 C" className="flex-1 p-3 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-lg font-bold" />
                <input type="number" placeholder="Batch Size (kg)" className="w-48 p-3 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-lg font-bold" />
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 rounded-lg transition-colors">Calculate</button>
              </div>

              <div className="bg-gray-900 rounded-xl p-6 text-white">
                <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
                  <h3 className="font-black text-xl">PMS 185 C</h3>
                  <span className="bg-gray-800 px-3 py-1 rounded text-sm font-bold text-gray-300">Target: 5.00 kg</span>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-red-600"></div>
                      <span className="font-semibold text-gray-300">Rubine Red</span>
                    </div>
                    <span className="font-mono font-bold text-xl">64.5% &bull; 3.225 kg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                      <span className="font-semibold text-gray-300">Yellow 012</span>
                    </div>
                    <span className="font-mono font-bold text-xl">35.5% &bull; 1.775 kg</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'environmental' && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center">
                <ThermometerSun size={40} className="text-orange-500 mb-2" />
                <h3 className="font-semibold text-gray-500 text-sm">Factory Floor Temp</h3>
                <p className="text-3xl font-black text-gray-800 mt-1">22.4&deg;C</p>
                <p className="text-xs font-bold text-green-600 mt-2 bg-green-50 px-2 py-1 rounded-full">Optimal</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center">
                <Droplet size={40} className="text-blue-500 mb-2" />
                <h3 className="font-semibold text-gray-500 text-sm">Relative Humidity</h3>
                <p className="text-3xl font-black text-gray-800 mt-1">45%</p>
                <p className="text-xs font-bold text-green-600 mt-2 bg-green-50 px-2 py-1 rounded-full">Optimal for Paper</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center">
                <Activity size={40} className="text-yellow-500 mb-2" />
                <h3 className="font-semibold text-gray-500 text-sm">Current Power Draw</h3>
                <p className="text-3xl font-black text-gray-800 mt-1">450 kW</p>
                <p className="text-xs font-bold text-orange-600 mt-2 bg-orange-50 px-2 py-1 rounded-full">Peak Tariff Period</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4">Manual Environmental Logs</h3>
              <p className="text-sm text-gray-500 mb-4">Required twice per shift for ISO 14001 compliance.</p>
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-gray-50 text-gray-600 font-semibold">
                  <tr>
                    <th className="p-3 border border-gray-200">Zone</th>
                    <th className="p-3 border border-gray-200">Temp (&deg;C)</th>
                    <th className="p-3 border border-gray-200">Humidity (%)</th>
                    <th className="p-3 border border-gray-200">Logged By</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 border border-gray-200 font-semibold">Paper Storage</td>
                    <td className="p-0 border border-gray-200"><input type="number" className="w-full h-full p-3 outline-none" placeholder="--" /></td>
                    <td className="p-0 border border-gray-200"><input type="number" className="w-full h-full p-3 outline-none" placeholder="--" /></td>
                    <td className="p-3 border border-gray-200 text-gray-500">Auto-fill (CurrentUser)</td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-gray-200 font-semibold">Ink Mixing Room</td>
                    <td className="p-0 border border-gray-200"><input type="number" className="w-full h-full p-3 outline-none" placeholder="--" /></td>
                    <td className="p-0 border border-gray-200"><input type="number" className="w-full h-full p-3 outline-none" placeholder="--" /></td>
                    <td className="p-3 border border-gray-200 text-gray-500">Auto-fill (CurrentUser)</td>
                  </tr>
                </tbody>
              </table>
              <button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded transition-colors">Submit Logs</button>
            </div>
          </div>
        )}

        {activeTab === 'yield_routing' && (
          <div className="flex gap-6 h-full">
            <div className="flex-1 space-y-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Waypoints size={20} className="text-indigo-600"/> Automated Job Routing</h3>
                <p className="text-sm text-gray-500 mb-6">AI-suggested routing based on machine availability and order specifications.</p>
                
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-black text-gray-800">Job: ORD-4492 (100k Corrugated Boxes)</span>
                    <button className="bg-indigo-100 text-indigo-800 font-bold px-3 py-1 text-xs rounded hover:bg-indigo-200">Optimize Route</button>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-white border border-gray-300 p-2 text-center rounded flex-1 text-sm font-semibold">Corrugator 1</div>
                    <span className="text-gray-400">&rarr;</span>
                    <div className="bg-indigo-50 border border-indigo-300 p-2 text-center rounded flex-1 text-sm font-bold text-indigo-800">Flexo Press B</div>
                    <span className="text-gray-400">&rarr;</span>
                    <div className="bg-white border border-gray-300 p-2 text-center rounded flex-1 text-sm font-semibold">Die Cutter Alpha</div>
                  </div>
                  <p className="text-xs text-green-600 font-bold mt-3">Route optimal. Estimated completion: 14:00 tomorrow.</p>
                </div>
              </div>
            </div>

            <div className="w-1/3 space-y-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">Yield Variance Flags</h3>
                <div className="space-y-4">
                  <div className="p-3 bg-red-50 border border-red-200 rounded text-sm">
                    <div className="flex justify-between font-bold text-red-900 mb-1">
                      <span>ORD-8812</span>
                      <span>-4.2% Yield</span>
                    </div>
                    <p className="text-red-700 text-xs">Excessive waste detected at Die Cutter Alpha. Inspect immediately.</p>
                  </div>
                  <div className="p-3 bg-green-50 border border-green-200 rounded text-sm">
                    <div className="flex justify-between font-bold text-green-900 mb-1">
                      <span>ORD-8811</span>
                      <span>+1.5% Yield</span>
                    </div>
                    <p className="text-green-700 text-xs">Efficient setup minimized makeready waste.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">Sub-Assembly Tracking</h3>
                <p className="text-sm text-gray-500 mb-4">Track WIP items moving between phases.</p>
                <div className="flex items-center justify-between p-2 border-b border-gray-100 text-sm">
                  <span className="font-semibold text-gray-700">Printed Sheets (Job 112)</span>
                  <span className="bg-gray-200 text-gray-700 font-bold px-2 py-0.5 rounded text-xs">Awaiting Curing</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
