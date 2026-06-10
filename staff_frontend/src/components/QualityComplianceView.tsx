import { useState } from 'react';
import { CheckCircle, ShieldCheck, Microscope, UserX, AlertTriangle, FileSignature } from 'lucide-react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';

export default function QualityComplianceView() {
  const [activeTab, setActiveTab] = useState<'audits' | 'defects' | 'testing' | 'vendor'>('audits');
  const logQualityAudit = httpsCallable(functions, 'staff-logQualityAudit');

  const handleSignOff = async () => {
    try {
      await logQualityAudit({ target: 'Machine P1', status: 'Passed', notes: 'ISO 9001 compliance check OK' });
      alert('Digital Sign-off Logged');
    } catch (e) {
      console.error(e);
      alert('Failed to log sign-off');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex border-b border-gray-100 bg-indigo-50 rounded-t-xl overflow-x-auto">
        <button onClick={() => setActiveTab('audits')} className={`px-6 py-4 font-bold text-sm whitespace-nowrap ${activeTab === 'audits' ? 'text-indigo-700 border-b-2 border-indigo-700 bg-white' : 'text-indigo-900/60 hover:bg-white/50'}`}>Sign-offs & Audits</button>
        <button onClick={() => setActiveTab('defects')} className={`px-6 py-4 font-bold text-sm whitespace-nowrap ${activeTab === 'defects' ? 'text-indigo-700 border-b-2 border-indigo-700 bg-white' : 'text-indigo-900/60 hover:bg-white/50'}`}>Defects & Complaints</button>
        <button onClick={() => setActiveTab('testing')} className={`px-6 py-4 font-bold text-sm whitespace-nowrap ${activeTab === 'testing' ? 'text-indigo-700 border-b-2 border-indigo-700 bg-white' : 'text-indigo-900/60 hover:bg-white/50'}`}>Testing & Proofing</button>
        <button onClick={() => setActiveTab('vendor')} className={`px-6 py-4 font-bold text-sm whitespace-nowrap ${activeTab === 'vendor' ? 'text-indigo-700 border-b-2 border-indigo-700 bg-white' : 'text-indigo-900/60 hover:bg-white/50'}`}>Vendor & Quarantine</button>
      </div>

      <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
        {activeTab === 'audits' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-indigo-900 text-white p-8 rounded-xl shadow-lg relative overflow-hidden flex justify-between items-center">
              <div className="relative z-10">
                <h2 className="text-3xl font-black mb-2 flex items-center gap-2"><ShieldCheck size={28} /> ISO 9001 Compliance Desk</h2>
                <p className="text-indigo-200">All sign-offs are digitally watermarked with your Staff ID.</p>
              </div>
              <FileSignature className="absolute -right-10 -bottom-10 text-indigo-800 opacity-50" size={180} />
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><CheckCircle size={20} className="text-green-600"/> Pending Digital Sign-offs</h3>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-gray-800">Batch Q-1442 (Heidelberg P1)</h4>
                    <p className="text-sm text-gray-500">End-of-Run Quality Verification &bull; Req. by Mike R.</p>
                  </div>
                  <button onClick={handleSignOff} className="bg-green-600 text-white font-bold px-6 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors">Sign-off</button>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-gray-800">Monthly ISO Equipment Calibration</h4>
                    <p className="text-sm text-gray-500">Die-Cut Alpha Sector &bull; Due Today</p>
                  </div>
                  <button onClick={handleSignOff} className="bg-green-600 text-white font-bold px-6 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors">Sign-off</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'defects' && (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
              <h3 className="font-bold text-gray-800 mb-4">Log Internal Defect</h3>
              <p className="text-sm text-gray-500 mb-4">Categorize production defects for RCA (Root Cause Analysis).</p>
              
              <div className="space-y-4 flex-1">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Defect Code</label>
                  <select className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none font-semibold">
                    <option>DEF-01: Ink Smudge / Offset</option>
                    <option>DEF-02: Misaligned Die-cut</option>
                    <option>DEF-03: Glue Failure</option>
                    <option>DEF-04: Color Variation (Delta E &gt; 2)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Batch ID / Order Ref</label>
                  <input type="text" className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <button className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors">
                Log Defect
              </button>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><UserX size={20} className="text-red-500"/> Customer Complaint Linkage</h3>
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-red-900">CMP-9002: Boxes tearing on assembly</h4>
                  <span className="text-xs font-bold bg-red-200 text-red-900 px-2 py-0.5 rounded">High Prio</span>
                </div>
                <p className="text-sm text-red-800 mb-2">Client: PharmaCorp Ltd</p>
                <div className="flex gap-2">
                  <input type="text" placeholder="Link to Production Batch ID" className="flex-1 p-2 text-sm border border-red-300 rounded outline-none" />
                  <button className="bg-red-600 text-white font-bold px-3 py-2 text-sm rounded">Link</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'testing' && (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Microscope size={20} className="text-indigo-600"/> Physical Testing Logs</h3>
              <table className="w-full text-left text-sm mb-4">
                <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                  <tr>
                    <th className="p-3">Test Type</th>
                    <th className="p-3">Batch</th>
                    <th className="p-3">Result</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="p-3 font-bold">Edge Crush Test (ECT)</td>
                    <td className="p-3 font-mono">B-991</td>
                    <td className="p-3 text-green-600 font-bold">32.4 ECT (Pass)</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-3 font-bold">Mullen Burst Test</td>
                    <td className="p-3 font-mono">B-992</td>
                    <td className="p-3 text-red-600 font-bold">180 lbs (Fail)</td>
                  </tr>
                </tbody>
              </table>
              <button className="w-full bg-indigo-100 text-indigo-700 font-bold py-2 rounded-lg text-sm hover:bg-indigo-200">+ New Test Log</button>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4">A/B Proofing Log</h3>
              <div className="flex gap-4">
                <div className="flex-1 border-2 border-indigo-600 bg-indigo-50 p-4 rounded-lg relative">
                  <div className="absolute top-2 right-2 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded">Selected</div>
                  <h4 className="font-bold text-indigo-900 mb-1">Proof A (Matte Finish)</h4>
                  <p className="text-xs text-indigo-700">Client Approved: 10:45 AM</p>
                </div>
                <div className="flex-1 border border-gray-200 bg-gray-50 p-4 rounded-lg opacity-60">
                  <h4 className="font-bold text-gray-700 mb-1">Proof B (Gloss Finish)</h4>
                  <p className="text-xs text-gray-500">Rejected</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'vendor' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4">Vendor Quality Rating</h3>
                <div className="space-y-4">
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold">PaperMakers Inc</span>
                      <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">Score: 98/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                    </div>
                  </div>
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold">GlobalInks Ltd</span>
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded">Score: 74/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '74%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><AlertTriangle size={20} className="text-orange-500"/> Quarantine Release Lock</h3>
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="font-bold text-orange-900 mb-1">Pallet ID: PLT-9901</p>
                    <p className="text-sm text-orange-800 mb-3">Reason: Suspected moisture damage.</p>
                    <div className="flex gap-2">
                      <button className="flex-1 bg-green-600 text-white font-bold py-2 rounded text-sm hover:bg-green-700">Approve Release</button>
                      <button className="flex-1 bg-red-600 text-white font-bold py-2 rounded text-sm hover:bg-red-700">Destroy</button>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-4">Sanitization Logs (Food-Grade)</h3>
                  <div className="flex justify-between items-center bg-gray-50 p-3 rounded border border-gray-200">
                    <span className="text-sm font-semibold">Line 3 (Food Safe Area)</span>
                    <button className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded">Log Cleaning</button>
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
