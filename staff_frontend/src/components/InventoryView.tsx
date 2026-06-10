import { useState, useEffect } from 'react';
import { Camera, Search, AlertTriangle, Plus, LayoutGrid, CheckCircle, Save } from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '../firebase';
import type { RawMaterial } from '../types';

export default function InventoryView() {
  const [activeTab, setActiveTab] = useState<'scan' | 'tally' | 'lowstock' | 'wastage'>('scan');
  const [materials, setMaterials] = useState<RawMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [wastageForm, setWastageForm] = useState({ materialId: '', quantity: '', unit: '', reason: '', lot: '' });

  const logMaterialUsage = httpsCallable(functions, 'staff-logMaterialUsage'); // Wait, the function name is logMaterialUsage exported from index.ts as staff.logMaterialUsage? 
  // No, if I exported it as `export * as staff from './staffFunctions'`, it might be deployed as `staff-logMaterialUsage`.

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'raw_materials'), (snapshot) => {
      const mats: RawMaterial[] = [];
      snapshot.forEach(doc => {
        mats.push({ id: doc.id, ...doc.data() } as RawMaterial);
      });
      setMaterials(mats);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleUseMaterial = async (materialId: string, quantity: number) => {
    try {
      await logMaterialUsage({ materialId, quantityUsed: quantity, type: 'production' });
    } catch (error) {
      console.error(error);
      alert('Failed to log usage');
    }
  };

  const handleLogWastage = async () => {
    if (!wastageForm.materialId || !wastageForm.quantity) return;
    try {
      await logMaterialUsage({ 
        materialId: wastageForm.materialId, 
        quantityUsed: Number(wastageForm.quantity), 
        type: 'wastage',
        reason: wastageForm.reason 
      });
      setWastageForm({ materialId: '', quantity: '', unit: '', reason: '', lot: '' });
      alert('Wastage logged successfully.');
    } catch (error) {
      console.error(error);
      alert('Failed to log wastage');
    }
  };

  const lowStockMaterials = materials.filter(m => m.systemStock <= m.safetyThreshold);

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex border-b border-gray-100">
        <button onClick={() => setActiveTab('scan')} className={`flex-1 py-4 font-bold text-sm ${activeTab === 'scan' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>Scan & Use</button>
        <button onClick={() => setActiveTab('tally')} className={`flex-1 py-4 font-bold text-sm ${activeTab === 'tally' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>Rapid Tally Grid</button>
        <button onClick={() => setActiveTab('lowstock')} className={`flex-1 py-4 font-bold text-sm ${activeTab === 'lowstock' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:bg-gray-50'}`}>Low Stock Alert</button>
        <button onClick={() => setActiveTab('wastage')} className={`flex-1 py-4 font-bold text-sm ${activeTab === 'wastage' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-500 hover:bg-gray-50'}`}>Scrap & Wastage</button>
      </div>

      <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-500 font-bold">Loading...</div>
        ) : (
          <>
            {activeTab === 'scan' && (
              <div className="space-y-6">
                <div className="bg-gray-900 rounded-xl p-8 flex flex-col items-center justify-center text-white min-h-[300px]">
                  <Camera size={48} className="mb-4 text-gray-400" />
                  <p className="font-bold text-lg mb-2">Camera / Scanner Active</p>
                  <p className="text-gray-400 text-sm">Waiting for Barcode or QR Code input...</p>
                  <input type="text" className="opacity-0 w-0 h-0" autoFocus />
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><LayoutGrid size={20}/> One-Tap Material Usage</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {materials.slice(0, 3).map(m => (
                      <button 
                        key={m.id}
                        onClick={() => handleUseMaterial(m.id, 1)}
                        className="bg-blue-50 hover:bg-blue-100 border border-blue-200 p-4 rounded-lg flex flex-col items-center justify-center gap-2 text-blue-800 transition-colors"
                      >
                        <span className="font-black text-xl">-1 {m.unit}</span>
                        <span className="font-semibold text-sm text-center">{m.name}</span>
                      </button>
                    ))}
                    <button className="bg-gray-100 hover:bg-gray-200 border border-gray-300 p-4 rounded-lg flex flex-col items-center justify-center gap-2 text-gray-700 transition-colors border-dashed">
                      <Plus size={24} />
                      <span className="font-semibold text-sm">Add Macro</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tally' && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-4 bg-gray-100 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="font-bold text-gray-800">Rapid Reconciliation Mode</h3>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Search item..." className="px-3 py-1.5 border border-gray-300 rounded text-sm w-64 focus:ring-2 focus:ring-blue-500 outline-none" />
                    <button className="bg-blue-600 text-white px-4 py-1.5 rounded font-bold text-sm hover:bg-blue-700 flex items-center gap-2"><Save size={16}/> Sync Count</button>
                  </div>
                </div>
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                    <tr>
                      <th className="p-3">SKU / Item</th>
                      <th className="p-3">Location</th>
                      <th className="p-3">System Stock</th>
                      <th className="p-3 bg-yellow-50 text-yellow-800 border-l border-yellow-200">Physical Count</th>
                      <th className="p-3">Variance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {materials.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-3 font-semibold text-gray-800">
                          <div>{item.sku}</div>
                          <div className="text-xs text-gray-500 font-normal">{item.name}</div>
                        </td>
                        <td className="p-3 text-gray-600">{item.location}</td>
                        <td className="p-3 font-mono">{item.systemStock}</td>
                        <td className="p-0 bg-yellow-50 border-l border-yellow-100">
                          <input type="number" defaultValue={item.systemStock} className="w-full h-full p-3 bg-transparent font-mono font-bold text-lg outline-none focus:bg-white focus:ring-2 focus:ring-yellow-400" />
                        </td>
                        <td className="p-3 font-mono text-gray-400">0</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'lowstock' && (
              <div className="space-y-4">
                {lowStockMaterials.length > 0 ? (
                  <>
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start gap-4">
                      <AlertTriangle className="text-red-600 mt-1" size={24} />
                      <div>
                        <h3 className="font-bold text-red-900 text-lg">Safety Threshold Alert!</h3>
                        <p className="text-red-700 mt-1">The following items have dropped below their critical safety thresholds.</p>
                      </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-0 overflow-hidden">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                          <tr>
                            <th className="p-4">Material</th>
                            <th className="p-4">Current Stock</th>
                            <th className="p-4">Threshold</th>
                            <th className="p-4">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lowStockMaterials.map(m => (
                            <tr key={m.id} className="border-b border-gray-100">
                              <td className="p-4 font-bold text-gray-800">{m.name}</td>
                              <td className="p-4 font-black text-red-600">{m.systemStock} {m.unit}</td>
                              <td className="p-4 font-mono text-gray-500">{m.safetyThreshold} {m.unit}</td>
                              <td className="p-4">
                                <button className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1.5 rounded font-bold text-xs transition-colors">Flag for Re-order</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <div className="bg-green-50 text-green-800 border border-green-200 p-6 rounded-xl flex items-center gap-3 font-bold">
                    <CheckCircle /> All stock levels are healthy.
                  </div>
                )}
              </div>
            )}

            {activeTab === 'wastage' && (
              <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-2xl mx-auto mt-4">
                <h3 className="font-bold text-gray-800 text-xl mb-6">Log Scrap & Wastage</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Material Item</label>
                    <select 
                      value={wastageForm.materialId}
                      onChange={e => setWastageForm({...wastageForm, materialId: e.target.value})}
                      className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Select material...</option>
                      {materials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Quantity Lost</label>
                      <input 
                        type="number" 
                        value={wastageForm.quantity}
                        onChange={e => setWastageForm({...wastageForm, quantity: e.target.value})}
                        className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500" 
                        placeholder="0" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Reason for Wastage</label>
                      <select 
                        value={wastageForm.reason}
                        onChange={e => setWastageForm({...wastageForm, reason: e.target.value})}
                        className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">Select reason...</option>
                        <option value="Machine Jam">Machine Jam / Damage</option>
                        <option value="Defective">Defective Raw Material</option>
                        <option value="Human Error">Human Error</option>
                        <option value="QC Reject">Quality Control Reject</option>
                      </select>
                    </div>
                  </div>
                  <button 
                    onClick={handleLogWastage}
                    disabled={!wastageForm.materialId || !wastageForm.quantity || !wastageForm.reason}
                    className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold p-3 rounded-lg mt-4 transition-colors"
                  >
                    Log Wastage
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
