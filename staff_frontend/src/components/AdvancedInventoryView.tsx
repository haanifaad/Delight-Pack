import { useState, useEffect } from 'react';
import { Layers, ScanLine, Scale, Repeat, ShieldAlert, ArrowLeftRight, Activity, Package } from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '../firebase';
import type { Warehouse, RfidLog, RMA } from '../types';

export default function AdvancedInventoryView() {
  const [activeTab, setActiveTab] = useState<'multi_warehouse' | 'cycle_count' | 'rma_quarantine' | 'scale_repack'>('multi_warehouse');
  const [rmas, setRmas] = useState<RMA[]>([]);
  const processRMA = httpsCallable(functions, 'staff-processRMA');

  useEffect(() => {
    const unsubRmas = onSnapshot(collection(db, 'rmas'), snapshot => {
      setRmas(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RMA)));
    });
    return () => unsubRmas();
  }, []);

  const handleCreateRMA = async () => {
    try {
      await processRMA({ supplierName: 'Test Supplier', itemName: 'Test Item', reason: 'Defective' });
      alert('RMA Created (Test Data)');
    } catch (e) {
      console.error(e);
      alert('Failed to create RMA');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex border-b border-gray-100 bg-indigo-50 rounded-t-xl overflow-x-auto">
        <button onClick={() => setActiveTab('multi_warehouse')} className={`px-6 py-4 font-bold text-sm whitespace-nowrap ${activeTab === 'multi_warehouse' ? 'text-indigo-700 border-b-2 border-indigo-700 bg-white' : 'text-indigo-900/60 hover:bg-white/50'}`}>Multi-Warehouse & RFID</button>
        <button onClick={() => setActiveTab('cycle_count')} className={`px-6 py-4 font-bold text-sm whitespace-nowrap ${activeTab === 'cycle_count' ? 'text-indigo-700 border-b-2 border-indigo-700 bg-white' : 'text-indigo-900/60 hover:bg-white/50'}`}>Cycle Count & LPNs</button>
        <button onClick={() => setActiveTab('rma_quarantine')} className={`px-6 py-4 font-bold text-sm whitespace-nowrap ${activeTab === 'rma_quarantine' ? 'text-indigo-700 border-b-2 border-indigo-700 bg-white' : 'text-indigo-900/60 hover:bg-white/50'}`}>RMA & Quarantine</button>
        <button onClick={() => setActiveTab('scale_repack')} className={`px-6 py-4 font-bold text-sm whitespace-nowrap ${activeTab === 'scale_repack' ? 'text-indigo-700 border-b-2 border-indigo-700 bg-white' : 'text-indigo-900/60 hover:bg-white/50'}`}>Scales & Repacking</button>
      </div>

      <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
        {activeTab === 'multi_warehouse' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div>
                <h3 className="font-bold text-gray-800 flex items-center gap-2"><Layers size={20} className="text-indigo-600"/> Multi-Warehouse Status</h3>
                <p className="text-sm text-gray-500">Real-time capacity across all active zones.</p>
              </div>
              <select className="bg-gray-100 border-none font-bold text-gray-700 rounded-lg py-2 px-4 outline-none focus:ring-2 focus:ring-indigo-500">
                <option>All Warehouses</option>
                <option>WH-A (Main Factory)</option>
                <option>WH-B (Overflow)</option>
                <option>WH-C (Chemicals)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'WH-A (Main Factory)', capacity: 85, color: 'bg-green-500', alert: null },
                { name: 'WH-B (Overflow)', capacity: 42, color: 'bg-blue-500', alert: null },
                { name: 'WH-C (Chemicals)', capacity: 96, color: 'bg-orange-500', alert: 'Near Capacity' },
              ].map((wh, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-bold text-gray-800">{wh.name}</h4>
                    {wh.alert && <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2 py-1 rounded">{wh.alert}</span>}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div className={`${wh.color} h-3 rounded-full`} style={{ width: `${wh.capacity}%` }}></div>
                  </div>
                  <p className="text-right text-sm font-bold text-gray-600">{wh.capacity}% Full</p>
                  <button className="mt-4 text-sm font-bold text-indigo-600 hover:text-indigo-800 border border-indigo-200 hover:bg-indigo-50 py-2 rounded transition-colors">
                    Request Transfer
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><ScanLine size={18} className="text-indigo-600"/> RFID Gate Activity Log</h4>
              <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                    <tr>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Gate ID</th>
                      <th className="p-3">Asset/Pallet LPN</th>
                      <th className="p-3">Direction</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { time: '10:42:15 AM', gate: 'Gate 4 (Loading)', lpn: 'LPN-9923-AA', dir: 'Outbound', status: 'Cleared' },
                      { time: '10:38:02 AM', gate: 'Gate 1 (Receiving)', lpn: 'LPN-8811-BB', dir: 'Inbound', status: 'Cleared' },
                      { time: '10:15:44 AM', gate: 'Gate 2 (Transfer)', lpn: 'LPN-UNREGISTERED', dir: 'Outbound', status: 'Flagged' },
                    ].map((log, i) => (
                      <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                        <td className="p-3 font-mono text-gray-500">{log.time}</td>
                        <td className="p-3 font-semibold text-gray-700">{log.gate}</td>
                        <td className="p-3 font-mono font-bold text-indigo-600">{log.lpn}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${log.dir === 'Inbound' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>{log.dir}</span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${log.status === 'Cleared' ? 'text-gray-600' : 'bg-red-100 text-red-800'}`}>{log.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cycle_count' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-indigo-900 text-white p-8 rounded-xl shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-3xl font-black mb-2">Cycle Counting Mode</h2>
                <p className="text-indigo-200 mb-6">Aisle B, Racks 10-15 are due for audit today.</p>
                <div className="flex gap-4">
                  <button className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2">
                    <ScanLine size={20} /> Start Guided Audit
                  </button>
                  <button className="bg-transparent border-2 border-indigo-400 hover:bg-indigo-800 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                    View Variances
                  </button>
                </div>
              </div>
              <Activity className="absolute -right-10 -bottom-10 text-indigo-800 opacity-50" size={200} />
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Package size={20} className="text-indigo-600"/> Pallet License Plates (LPN)</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center text-center hover:border-indigo-400 cursor-pointer transition-colors bg-gray-50">
                    <div className="bg-white border-2 border-black p-2 mb-3">
                      {/* Fake barcode block */}
                      <div className="flex gap-0.5 h-12">
                        <div className="w-1.5 bg-black h-full"></div><div className="w-1 bg-black h-full"></div><div className="w-2 bg-black h-full"></div><div className="w-1 bg-black h-full"></div><div className="w-3 bg-black h-full"></div><div className="w-1 bg-black h-full"></div><div className="w-2 bg-black h-full"></div>
                      </div>
                    </div>
                    <span className="font-mono font-black text-lg text-gray-800 tracking-wider">LPN-00{i}</span>
                    <span className="text-xs text-gray-500 mt-1">2,000x Kraft Bags</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rma_quarantine' && (
          <div className="flex gap-6 h-full">
            <div className="flex-1 space-y-6">
              <div className="bg-red-50 border border-red-200 p-6 rounded-xl flex flex-col items-center justify-center text-center h-48 shadow-sm">
                <ShieldAlert size={40} className="text-red-500 mb-3" />
                <h3 className="font-bold text-red-900 text-xl">Quarantine Zone Drop</h3>
                <p className="text-red-700 text-sm mt-2 mb-4">Move defective or unverified items to quarantine lockdown.</p>
                <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded shadow transition-colors">
                  Initiate Lockdown Transfer
                </button>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2"><ArrowLeftRight size={18} className="text-indigo-600"/> Supplier Return Authorization (RMA)</h3>
                  <button onClick={handleCreateRMA} className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-bold px-3 py-1.5 rounded text-sm transition-colors">
                    + New RMA
                  </button>
                </div>
                <div className="space-y-3">
                  {rmas.map((rma, i) => (
                    <div key={i} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center bg-gray-50">
                      <div>
                        <h4 className="font-bold text-gray-800">{rma.supplierName}</h4>
                        <p className="text-xs font-semibold text-gray-500">{rma.itemName} &bull; <span className="text-red-600">{rma.reason}</span></p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${rma.status.includes('Pending') ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                        {rma.status}
                      </span>
                    </div>
                  ))}
                  {rmas.length === 0 && <p className="text-sm text-gray-500 text-center p-4">No RMAs created yet.</p>}
                </div>
              </div>
            </div>
            
            <div className="w-1/3 bg-white border border-gray-200 rounded-xl flex flex-col overflow-hidden shadow-sm">
              <div className="bg-gray-100 p-4 border-b border-gray-200">
                <h3 className="font-bold text-gray-800">Expiry Date Tracking</h3>
              </div>
              <div className="p-4 flex-1 overflow-y-auto space-y-4">
                <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                  <p className="font-bold text-red-900 text-sm">Cyan Ink (Lot 882)</p>
                  <p className="text-xs text-red-700">Expired 2 days ago</p>
                </div>
                <div className="bg-orange-50 border-l-4 border-orange-500 p-3 rounded">
                  <p className="font-bold text-orange-900 text-sm">Adhesive Glue P2</p>
                  <p className="text-xs text-orange-700">Expires in 5 days</p>
                </div>
                <div className="bg-gray-50 border-l-4 border-gray-400 p-3 rounded">
                  <p className="font-bold text-gray-700 text-sm">Gloss Varnish</p>
                  <p className="text-xs text-gray-500">Expires in 14 days</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'scale_repack' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm flex flex-col items-center">
              <Scale size={64} className="text-indigo-400 mb-6" />
              <h2 className="text-2xl font-black text-gray-800 mb-2">Digital Scale Integration</h2>
              <p className="text-gray-500 text-center mb-8">Place item on COM1 serial scale. Weight will automatically populate.</p>

              <div className="w-full bg-gray-900 rounded-xl p-8 flex flex-col items-center justify-center mb-8">
                <span className="font-mono font-black text-6xl text-green-400">0.00 <span className="text-2xl text-green-700">KG</span></span>
                <span className="text-gray-500 text-xs mt-4 font-bold tracking-widest uppercase">Scale Offline - Awaiting Connection</span>
              </div>

              <div className="w-full border-t border-gray-200 pt-8 mt-4">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Repeat size={18} className="text-indigo-600"/> Bulk Re-packing Workflow</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Source Bulk Container</label>
                    <select className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500">
                      <option>Select container...</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Target Individual SKU</label>
                    <select className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500">
                      <option>Select SKU...</option>
                    </select>
                  </div>
                </div>
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-3 rounded-lg mt-6 transition-colors">
                  Execute Repack Transaction
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
