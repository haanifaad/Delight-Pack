import { useState } from 'react';
import { Clock, ShieldAlert, Award, FileText, Globe, RefreshCcw, Handshake } from 'lucide-react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';

export default function WorkforceManagementView() {
  const [activeTab, setActiveTab] = useState<'time_attendance' | 'skills_gamification' | 'safety_incidents' | 'shift_ops'>('time_attendance');
  const reportIncident = httpsCallable(functions, 'staff-reportIncident');

  const handleReportIncident = async () => {
    try {
      await reportIncident({ description: 'Test Incident', type: 'Near Miss' });
      alert('Incident Reported (Test Data)');
    } catch (e) {
      console.error(e);
      alert('Failed to report incident');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex border-b border-gray-100 bg-indigo-50 rounded-t-xl overflow-x-auto">
        <button onClick={() => setActiveTab('time_attendance')} className={`px-6 py-4 font-bold text-sm whitespace-nowrap ${activeTab === 'time_attendance' ? 'text-indigo-700 border-b-2 border-indigo-700 bg-white' : 'text-indigo-900/60 hover:bg-white/50'}`}>Time & Attendance</button>
        <button onClick={() => setActiveTab('skills_gamification')} className={`px-6 py-4 font-bold text-sm whitespace-nowrap ${activeTab === 'skills_gamification' ? 'text-indigo-700 border-b-2 border-indigo-700 bg-white' : 'text-indigo-900/60 hover:bg-white/50'}`}>Skills & gamification</button>
        <button onClick={() => setActiveTab('safety_incidents')} className={`px-6 py-4 font-bold text-sm whitespace-nowrap ${activeTab === 'safety_incidents' ? 'text-indigo-700 border-b-2 border-indigo-700 bg-white' : 'text-indigo-900/60 hover:bg-white/50'}`}>Safety & Incidents</button>
        <button onClick={() => setActiveTab('shift_ops')} className={`px-6 py-4 font-bold text-sm whitespace-nowrap ${activeTab === 'shift_ops' ? 'text-indigo-700 border-b-2 border-indigo-700 bg-white' : 'text-indigo-900/60 hover:bg-white/50'}`}>Shift Operations</button>
      </div>

      <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
        {/* Skipping unaltered content for brevity */ activeTab === 'time_attendance' && (
          <div className="flex gap-6 h-full">
            <div className="flex-1 space-y-6">
              <div className="bg-indigo-900 text-white p-8 rounded-xl shadow-lg relative overflow-hidden flex justify-between items-center">
                <div className="relative z-10">
                  <h2 className="text-3xl font-black mb-2 flex items-center gap-2"><Clock size={28} /> Physical Clock-in Sync</h2>
                  <p className="text-indigo-200">Terminal 3 (Main Entrance) connected.</p>
                </div>
                <div className="relative z-10 text-right">
                  <div className="text-4xl font-mono font-black text-green-400">08:14:22</div>
                  <p className="text-sm font-bold text-indigo-300">Shift A (Morning)</p>
                </div>
                <Clock className="absolute -left-10 -bottom-10 text-indigo-800 opacity-50" size={200} />
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4">Overtime Pre-Approval Requests</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Sarah J.', role: 'Die-Cut Operator', hours: 2, reason: 'Finish ORD-8812', status: 'Pending' },
                    { name: 'Ahmed K.', role: 'Forklift Driver', hours: 1, reason: 'Late inbound truck', status: 'Approved' },
                  ].map((req, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-bold text-gray-800">{req.name} <span className="text-xs font-normal text-gray-500">({req.role})</span></h4>
                        <p className="text-sm text-gray-600">Request: <span className="font-bold">{req.hours}h</span> &bull; {req.reason}</p>
                      </div>
                      {req.status === 'Pending' ? (
                        <div className="flex gap-2">
                          <button className="bg-green-100 hover:bg-green-200 text-green-800 text-xs font-bold px-3 py-1.5 rounded">Approve</button>
                          <button className="bg-red-100 hover:bg-red-200 text-red-800 text-xs font-bold px-3 py-1.5 rounded">Deny</button>
                        </div>
                      ) : (
                        <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1.5 rounded">{req.status}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-1/3 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><FileText size={20} className="text-indigo-600"/> Digital Pay Stubs</h3>
              <p className="text-sm text-gray-500 mb-6">Employees can securely access their latest pay stubs here.</p>
              
              <div className="space-y-3">
                <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-colors flex justify-between items-center">
                  <div>
                    <span className="block font-bold text-gray-800">May 2026</span>
                    <span className="text-xs text-gray-500">Issued: June 1, 2026</span>
                  </div>
                  <span className="text-indigo-600 font-bold text-xs bg-indigo-100 px-2 py-1 rounded">View PDF</span>
                </button>
                <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-colors flex justify-between items-center">
                  <div>
                    <span className="block font-bold text-gray-800">April 2026</span>
                    <span className="text-xs text-gray-500">Issued: May 1, 2026</span>
                  </div>
                  <span className="text-indigo-600 font-bold text-xs bg-indigo-100 px-2 py-1 rounded">View PDF</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'skills_gamification' && (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4">Machine Skills Matrix</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                    <tr>
                      <th className="p-3">Staff</th>
                      <th className="p-3 text-center">Heidelberg P1</th>
                      <th className="p-3 text-center">Die Cutter Alpha</th>
                      <th className="p-3 text-center">Folder Gluer</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="p-3 font-bold text-gray-800">Sarah J.</td>
                      <td className="p-3 text-center"><span className="w-4 h-4 rounded-full bg-green-500 inline-block" title="Expert"></span></td>
                      <td className="p-3 text-center"><span className="w-4 h-4 rounded-full bg-yellow-400 inline-block" title="Intermediate"></span></td>
                      <td className="p-3 text-center"><span className="w-4 h-4 rounded-full bg-gray-200 inline-block" title="Untrained"></span></td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-3 font-bold text-gray-800">Mike R.</td>
                      <td className="p-3 text-center"><span className="w-4 h-4 rounded-full bg-gray-200 inline-block" title="Untrained"></span></td>
                      <td className="p-3 text-center"><span className="w-4 h-4 rounded-full bg-green-500 inline-block" title="Expert"></span></td>
                      <td className="p-3 text-center"><span className="w-4 h-4 rounded-full bg-green-500 inline-block" title="Expert"></span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex gap-4 text-xs text-gray-500 justify-center border-t border-gray-100 pt-4">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500"></span> Expert</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-400"></span> Intermediate</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-gray-200"></span> Untrained</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Award size={20} className="text-yellow-500"/> Shift Leaderboard (This Week)</h3>
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-4 bg-yellow-50 border border-yellow-200 p-4 rounded-lg relative overflow-hidden">
                  <div className="font-black text-2xl text-yellow-600 w-8">1</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800">Shift C (Night)</h4>
                    <p className="text-xs font-semibold text-gray-500">Zero safety incidents, +1.2% Yield</p>
                  </div>
                  <div className="font-black text-xl text-yellow-600">1,250 pts</div>
                </div>
                <div className="flex items-center gap-4 border border-gray-200 p-4 rounded-lg">
                  <div className="font-black text-2xl text-gray-400 w-8">2</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800">Shift A (Morning)</h4>
                    <p className="text-xs font-semibold text-gray-500">1 minor incident, +0.8% Yield</p>
                  </div>
                  <div className="font-black text-xl text-gray-600">1,100 pts</div>
                </div>
                <div className="flex items-center gap-4 border border-gray-200 p-4 rounded-lg">
                  <div className="font-black text-2xl text-orange-400 w-8">3</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800">Shift B (Afternoon)</h4>
                    <p className="text-xs font-semibold text-gray-500">0 incidents, -0.4% Yield</p>
                  </div>
                  <div className="font-black text-xl text-gray-600">950 pts</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'safety_incidents' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm flex justify-between items-center">
              <div>
                <h3 className="font-black text-red-900 text-xl flex items-center gap-2"><ShieldAlert /> Report Safety Incident</h3>
                <p className="text-red-700 text-sm mt-1">Log any near-misses, injuries, or hazards immediately.</p>
              </div>
              <button onClick={handleReportIncident} className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg shadow-sm transition-colors text-lg">
                Log New Incident
              </button>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4">PPE Confirmation Check</h3>
              <p className="text-sm text-gray-500 mb-6">Staff must acknowledge they are wearing required PPE before operating heavy machinery.</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="border-2 border-green-500 bg-green-50 rounded-lg p-4 text-center">
                  <span className="block text-3xl mb-2">🥾</span>
                  <span className="font-bold text-green-900 text-sm">Steel Toe Boots</span>
                </div>
                <div className="border-2 border-green-500 bg-green-50 rounded-lg p-4 text-center">
                  <span className="block text-3xl mb-2">🦺</span>
                  <span className="font-bold text-green-900 text-sm">Hi-Vis Vest</span>
                </div>
                <div className="border-2 border-gray-200 bg-gray-50 rounded-lg p-4 text-center opacity-50">
                  <span className="block text-3xl mb-2">🥽</span>
                  <span className="font-bold text-gray-600 text-sm">Safety Glasses</span>
                  <p className="text-xs text-gray-500 mt-1">(Area Specific)</p>
                </div>
                <div className="border-2 border-gray-200 bg-gray-50 rounded-lg p-4 text-center opacity-50">
                  <span className="block text-3xl mb-2">🎧</span>
                  <span className="font-bold text-gray-600 text-sm">Ear Protection</span>
                  <p className="text-xs text-gray-500 mt-1">(Area Specific)</p>
                </div>
              </div>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors">
                I Confirm I am Wearing Required PPE
              </button>
            </div>
          </div>
        )}

        {activeTab === 'shift_ops' && (
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Globe size={20} className="text-indigo-600"/> Multilingual UI Toggle</h3>
                <p className="text-sm text-gray-500 mb-4">Switch the factory floor terminal language for the current session.</p>
                <div className="flex gap-2">
                  <button className="flex-1 bg-indigo-600 text-white font-bold py-2 rounded">English</button>
                  <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 rounded">Español</button>
                  <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 rounded">العربية</button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Handshake size={20} className="text-indigo-600"/> Task Delegation</h3>
                <div className="flex gap-2 mb-4">
                  <input type="text" placeholder="Task description..." className="flex-1 p-2 bg-gray-50 border border-gray-300 rounded outline-none text-sm" />
                  <select className="p-2 bg-gray-50 border border-gray-300 rounded outline-none text-sm font-semibold">
                    <option>Assign to...</option>
                    <option>Ahmed K.</option>
                    <option>Sarah J.</option>
                  </select>
                </div>
                <button className="w-full bg-indigo-100 text-indigo-800 font-bold py-2 rounded text-sm hover:bg-indigo-200 transition-colors">Assign Task</button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><RefreshCcw size={20} className="text-indigo-600"/> Shift Swap Requests</h3>
              <div className="space-y-3">
                <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-gray-800">Tom H. <span className="text-gray-400 font-normal">wants to swap with</span> You</p>
                      <p className="text-xs text-gray-500">Tom takes: Wed 14:00 (Your shift)</p>
                      <p className="text-xs text-gray-500">You take: Fri 06:00 (Tom's shift)</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button className="flex-1 bg-green-100 text-green-800 font-bold text-xs py-1.5 rounded hover:bg-green-200">Accept Swap</button>
                    <button className="flex-1 bg-red-100 text-red-800 font-bold text-xs py-1.5 rounded hover:bg-red-200">Decline</button>
                  </div>
                </div>
                
                <button className="w-full mt-2 border-2 border-dashed border-gray-300 text-gray-500 hover:text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50 font-bold py-3 rounded-lg transition-colors text-sm">
                  + Propose a Shift Swap
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
