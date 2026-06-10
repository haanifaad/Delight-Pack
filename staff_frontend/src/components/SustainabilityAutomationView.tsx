import { useState } from 'react';
import { Leaf, Droplets, Recycle, Cpu, Mic, BellRing, Sparkles } from 'lucide-react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';

export default function SustainabilityAutomationView() {
  const [activeTab, setActiveTab] = useState<'eco_tracking' | 'ai_automation'>('eco_tracking');
  const updateEcoMetrics = httpsCallable(functions, 'staff-updateEcoMetrics');

  const handleUpdateEco = async () => {
    try {
      await updateEcoMetrics({ type: 'Water', value: 1200, unit: 'Liters' });
      alert('Eco Metrics Updated (Test Data)');
    } catch (e) {
      console.error(e);
      alert('Failed to update eco metrics');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex border-b border-gray-100 bg-indigo-50 rounded-t-xl overflow-x-auto">
        <button onClick={() => setActiveTab('eco_tracking')} className={`px-6 py-4 font-bold text-sm whitespace-nowrap ${activeTab === 'eco_tracking' ? 'text-indigo-700 border-b-2 border-indigo-700 bg-white' : 'text-indigo-900/60 hover:bg-white/50'}`}>Eco Tracking</button>
        <button onClick={() => setActiveTab('ai_automation')} className={`px-6 py-4 font-bold text-sm whitespace-nowrap ${activeTab === 'ai_automation' ? 'text-indigo-700 border-b-2 border-indigo-700 bg-white' : 'text-indigo-900/60 hover:bg-white/50'}`}>AI & Automation</button>
      </div>

      <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
        {activeTab === 'eco_tracking' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-50 border border-green-200 p-6 rounded-xl flex flex-col items-center justify-center text-center">
                <Leaf className="text-green-600 mb-2" size={32} />
                <h3 className="font-bold text-green-900">Carbon Footprint</h3>
                <p className="text-3xl font-black text-green-700 mt-2">1.2<span className="text-sm font-bold ml-1">tCO2e</span></p>
                <p className="text-xs text-green-800 mt-1">This shift (Est.)</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl flex flex-col items-center justify-center text-center">
                <Droplets className="text-blue-600 mb-2" size={32} />
                <h3 className="font-bold text-blue-900">Water Usage</h3>
                <p className="text-3xl font-black text-blue-700 mt-2">4,500<span className="text-sm font-bold ml-1">L</span></p>
                <p className="text-xs text-blue-800 mt-1">Cooling system daily</p>
              </div>
              <div className="bg-teal-50 border border-teal-200 p-6 rounded-xl flex flex-col items-center justify-center text-center">
                <Recycle className="text-teal-600 mb-2" size={32} />
                <h3 className="font-bold text-teal-900">Recycled Content</h3>
                <p className="text-3xl font-black text-teal-700 mt-2">82<span className="text-sm font-bold ml-1">%</span></p>
                <p className="text-xs text-teal-800 mt-1">Current batch average</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
                <h3 className="font-bold text-gray-800 mb-4">Manual Eco-Entry</h3>
                <div className="space-y-4 flex-1">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Metric Type</label>
                    <select className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none">
                      <option>Water Usage (Liters)</option>
                      <option>Electricity (kWh)</option>
                      <option>Scrap Sent to Recycling (kg)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Value</label>
                    <input type="number" className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none" />
                  </div>
                </div>
                <button onClick={handleUpdateEco} className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors">
                  Log Eco Metric
                </button>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4">Scrap Selling Ledger</h3>
                <div className="space-y-3">
                  <div className="p-3 border border-gray-200 rounded-lg flex justify-between items-center bg-gray-50">
                    <div>
                      <p className="font-bold">Corrugated Offcuts</p>
                      <p className="text-xs text-gray-500">Buyer: GreenRecycle Ltd</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">450 kg</p>
                      <p className="text-xs text-green-600 font-bold">+$22.50</p>
                    </div>
                  </div>
                  <div className="p-3 border border-gray-200 rounded-lg flex justify-between items-center bg-gray-50">
                    <div>
                      <p className="font-bold">Spent Ink Cartridges</p>
                      <p className="text-xs text-gray-500">Buyer: EcoInks Inc</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">12 units</p>
                      <p className="text-xs text-green-600 font-bold">+$15.00</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai_automation' && (
          <div className="grid grid-cols-2 gap-6 h-full">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Sparkles size={20} className="text-indigo-600"/> AI Troubleshooting Assistant</h3>
              <div className="flex-1 bg-gray-50 rounded-lg border border-gray-200 p-4 mb-4 flex flex-col overflow-y-auto">
                <div className="bg-indigo-100 text-indigo-900 p-3 rounded-lg rounded-tl-none self-start max-w-[80%] mb-4 text-sm shadow-sm">
                  Hello! I'm the DP-AI Assistant. Tell me what machine issue you're facing.
                </div>
                <div className="bg-white border border-gray-200 text-gray-800 p-3 rounded-lg rounded-tr-none self-end max-w-[80%] mb-4 text-sm shadow-sm">
                  Heidelberg P1 is showing Error 402 on the feeder.
                </div>
                <div className="bg-indigo-100 text-indigo-900 p-3 rounded-lg rounded-tl-none self-start max-w-[80%] mb-4 text-sm shadow-sm">
                  <strong>Error 402 (Feeder Jam):</strong>
                  <ul className="list-disc pl-4 mt-2">
                    <li>Check suction tape alignment.</li>
                    <li>Ensure paper stack height sensor is clean.</li>
                    <li>Verify air blast settings for the current paper weight.</li>
                  </ul>
                  <div className="mt-2 text-xs font-bold text-indigo-700">Would you like me to log a maintenance ticket?</div>
                </div>
              </div>
              <div className="flex gap-2">
                <input type="text" placeholder="Describe the issue..." className="flex-1 p-3 bg-gray-50 border border-gray-300 rounded-lg outline-none text-sm" />
                <button className="bg-indigo-600 text-white p-3 rounded-lg"><Cpu size={20} /></button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Mic size={20} className="text-indigo-600"/> Voice-to-Text Shift Notes</h3>
                <p className="text-sm text-gray-500 mb-4">Dictate your end-of-shift handover notes.</p>
                <button className="w-full py-8 border-2 border-dashed border-indigo-300 rounded-xl bg-indigo-50 hover:bg-indigo-100 flex flex-col items-center justify-center transition-colors group">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md mb-3 group-hover:scale-105 transition-transform">
                    <Mic size={32} className="text-red-500" />
                  </div>
                  <span className="font-bold text-indigo-900">Hold to Record</span>
                </button>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><BellRing size={20} className="text-yellow-500"/> Predictive Depletion Warnings</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <Sparkles size={20} className="text-yellow-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-yellow-900 text-sm">Cyan Ink low (Est. depletion: 2 hours)</p>
                      <p className="text-xs text-yellow-800 mt-1">Current job requires 4kg, only 3.2kg remains in vat.</p>
                      <button className="mt-2 text-xs font-bold text-indigo-700 bg-white px-2 py-1 rounded border border-yellow-300 hover:bg-yellow-100">Draft PO Request</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
