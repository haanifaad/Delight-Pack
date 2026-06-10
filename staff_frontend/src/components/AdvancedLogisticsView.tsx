import { useState } from 'react';
import { Navigation, Banknote, Truck, Clock, ShieldAlert, ThermometerSnowflake, Route } from 'lucide-react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';

export default function AdvancedLogisticsView() {
  const [activeTab, setActiveTab] = useState<'routing' | 'driver_ops' | 'dispatch_returns' | 'maintenance'>('routing');
  const generateGatePass = httpsCallable(functions, 'staff-generateGatePass');

  const handleGeneratePass = async () => {
    try {
      await generateGatePass({ courierName: 'DHL Express', vehiclePlate: 'XYZ-1234', linkedOrders: ['ORD-9912'] });
      alert('Gate Pass Generated (Test Data)');
    } catch (e) {
      console.error(e);
      alert('Failed to generate gate pass');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex border-b border-gray-100 bg-indigo-50 rounded-t-xl overflow-x-auto">
        <button onClick={() => setActiveTab('routing')} className={`px-6 py-4 font-bold text-sm whitespace-nowrap ${activeTab === 'routing' ? 'text-indigo-700 border-b-2 border-indigo-700 bg-white' : 'text-indigo-900/60 hover:bg-white/50'}`}>Fleet & Routing</button>
        <button onClick={() => setActiveTab('driver_ops')} className={`px-6 py-4 font-bold text-sm whitespace-nowrap ${activeTab === 'driver_ops' ? 'text-indigo-700 border-b-2 border-indigo-700 bg-white' : 'text-indigo-900/60 hover:bg-white/50'}`}>Driver Operations</button>
        <button onClick={() => setActiveTab('dispatch_returns')} className={`px-6 py-4 font-bold text-sm whitespace-nowrap ${activeTab === 'dispatch_returns' ? 'text-indigo-700 border-b-2 border-indigo-700 bg-white' : 'text-indigo-900/60 hover:bg-white/50'}`}>Dispatch & Returns</button>
        <button onClick={() => setActiveTab('maintenance')} className={`px-6 py-4 font-bold text-sm whitespace-nowrap ${activeTab === 'maintenance' ? 'text-indigo-700 border-b-2 border-indigo-700 bg-white' : 'text-indigo-900/60 hover:bg-white/50'}`}>Fleet Maintenance</button>
      </div>

      <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
        {/* Skipping unaltered content up to the dispatch tab for brevity of replace tool */ activeTab === 'routing' && (
          <div className="flex gap-6 h-full">
            <div className="flex-1 space-y-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Navigation size={120} />
                </div>
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Route size={20} className="text-indigo-600"/> Multi-Stop Route Optimization</h3>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-gray-800">Route 4A - City North</h4>
                      <p className="text-sm text-gray-500">5 Stops &bull; 42 km &bull; Est. 3h 15m</p>
                    </div>
                    <button className="bg-indigo-100 text-indigo-700 font-bold px-4 py-2 rounded-lg text-sm hover:bg-indigo-200">View Map</button>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-gray-800">Route 1B - Industrial Park</h4>
                      <p className="text-sm text-gray-500">2 Stops &bull; 18 km &bull; Est. 1h 10m</p>
                    </div>
                    <button className="bg-indigo-100 text-indigo-700 font-bold px-4 py-2 rounded-lg text-sm hover:bg-indigo-200">View Map</button>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><ThermometerSnowflake size={20} className="text-indigo-600"/> Climate-Controlled Transport</h3>
                <div className="flex gap-4">
                  <div className="flex-1 bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                    <p className="text-sm font-semibold text-blue-900 mb-1">Truck T-04 (Reefer)</p>
                    <p className="text-3xl font-black text-blue-700">4.2&deg;C</p>
                    <p className="text-xs text-blue-600 font-bold mt-2">Optimal</p>
                  </div>
                  <div className="flex-1 bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <p className="text-sm font-semibold text-red-900 mb-1">Truck T-08 (Reefer)</p>
                    <p className="text-3xl font-black text-red-700">9.5&deg;C</p>
                    <p className="text-xs text-red-600 font-bold mt-2 animate-pulse">Warning: Temp Rising</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-1/3 space-y-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4">Live Traffic ETAs</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                    <div>
                      <p className="font-bold text-sm text-yellow-900">Route 4A</p>
                      <p className="text-xs text-yellow-700">Heavy Traffic (M1)</p>
                    </div>
                    <span className="font-mono font-bold text-red-600">+14m</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-green-50 border-l-4 border-green-500 rounded">
                    <div>
                      <p className="font-bold text-sm text-green-900">Route 1B</p>
                      <p className="text-xs text-green-700">Clear</p>
                    </div>
                    <span className="font-mono font-bold text-green-600">-2m</span>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4">Load Balancing</h3>
                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500 font-bold mb-2">Truck T-04 Axle Load</p>
                  <div className="w-full bg-gray-300 rounded-full h-4 mb-2">
                    <div className="bg-indigo-600 h-4 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <p className="text-xs font-bold text-gray-700">85% Capacity (3.4t / 4.0t)</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'driver_ops' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Banknote size={20} className="text-green-600"/> Cash on Delivery (COD)</h3>
                <div className="flex justify-between items-center mb-6 bg-green-50 p-4 rounded-lg border border-green-200">
                  <span className="font-bold text-green-900">Total Pending Collection</span>
                  <span className="text-2xl font-black text-green-700">$4,250.00</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <div>
                      <p className="font-bold text-sm text-gray-800">ORD-9912 (Alpha Corp)</p>
                      <p className="text-xs text-gray-500">Driver: John D.</p>
                    </div>
                    <button className="bg-gray-100 hover:bg-green-100 hover:text-green-800 text-gray-600 font-bold px-3 py-1 text-xs rounded transition-colors">Mark Collected</button>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <div>
                      <p className="font-bold text-sm text-gray-800">ORD-9915 (Beta Ltd)</p>
                      <p className="text-xs text-gray-500">Driver: Mike R.</p>
                    </div>
                    <button className="bg-gray-100 hover:bg-green-100 hover:text-green-800 text-gray-600 font-bold px-3 py-1 text-xs rounded transition-colors">Mark Collected</button>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">Driver Fuel Tracking</h3>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Driver ID / Truck" className="w-1/2 p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none text-sm" />
                    <input type="number" placeholder="Liters Filled" className="w-1/2 p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none text-sm" />
                  </div>
                  <button className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg text-sm transition-colors">Log Fuel</button>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Clock size={20} className="text-indigo-600"/> Driver Break Logging</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm font-semibold text-gray-700">John D.</span>
                      <span className="text-xs font-bold bg-yellow-100 text-yellow-800 px-2 py-1 rounded">On Lunch (14m)</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm font-semibold text-gray-700">Mike R.</span>
                      <span className="text-xs font-bold bg-green-100 text-green-800 px-2 py-1 rounded">Driving (2h 10m)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dispatch_returns' && (
          <div className="grid grid-cols-2 gap-6 h-full">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
              <h3 className="font-bold text-gray-800 mb-4">Gate Pass Generation</h3>
              <p className="text-sm text-gray-500 mb-6">Issue digital gate passes for outbound supplier trucks or 3rd party couriers.</p>
              
              <div className="space-y-4 flex-1">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Courier / Company Name</label>
                  <input type="text" className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Vehicle License Plate</label>
                  <input type="text" className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Linked Order IDs</label>
                  <input type="text" placeholder="e.g. ORD-123, ORD-124" className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <button onClick={handleGeneratePass} className="w-full mt-6 bg-indigo-900 hover:bg-indigo-800 text-white font-bold py-3 rounded-lg transition-colors flex justify-center items-center gap-2">
                Generate Digital Pass
              </button>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><ShieldAlert size={20} className="text-red-600"/> Return/Reject Processing</h3>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-red-900">ORD-9880 (Rejected at Door)</h4>
                    <span className="text-xs font-bold bg-red-200 text-red-900 px-2 py-0.5 rounded">Action Req</span>
                  </div>
                  <p className="text-sm text-red-800 mb-3">Reason: "Water damage on outer boxes."</p>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-white border border-red-300 text-red-700 text-xs font-bold py-2 rounded hover:bg-red-100">Send to Quarantine</button>
                    <button className="flex-1 bg-red-600 text-white text-xs font-bold py-2 rounded hover:bg-red-700">Process Refund</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'maintenance' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-800 flex items-center gap-2"><Truck size={20} className="text-indigo-600"/> Fleet Maintenance Logs</h3>
                <button className="bg-indigo-100 text-indigo-700 font-bold px-4 py-2 rounded-lg text-sm hover:bg-indigo-200">+ Log Service</button>
              </div>

              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                  <tr>
                    <th className="p-3">Vehicle</th>
                    <th className="p-3">Odometer</th>
                    <th className="p-3">Service Type</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Next Due</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-3 font-bold text-gray-800">T-04 (Hino 300)</td>
                    <td className="p-3 font-mono text-gray-600">145,200 km</td>
                    <td className="p-3 text-gray-600">Oil Change, Tires</td>
                    <td className="p-3"><span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">Completed</span></td>
                    <td className="p-3 text-gray-500 font-mono">155,000 km</td>
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-3 font-bold text-gray-800">T-08 (Isuzu NQR)</td>
                    <td className="p-3 font-mono text-gray-600">89,100 km</td>
                    <td className="p-3 text-gray-600">Reefer Unit Repair</td>
                    <td className="p-3"><span className="bg-orange-100 text-orange-800 text-xs font-bold px-2 py-1 rounded">In Shop</span></td>
                    <td className="p-3 text-gray-500 font-mono">--</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
