import { useState } from 'react';
import { Bell, ShieldAlert, Trophy, Target, TrendingUp, AlertCircle } from 'lucide-react';

export default function CommunicationView() {
  const [activeTab, setActiveTab] = useState<'announcements' | 'metrics'>('announcements');

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex border-b border-gray-100">
        <button onClick={() => setActiveTab('announcements')} className={`flex-1 py-4 font-bold text-sm ${activeTab === 'announcements' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>Announcements & Alerts</button>
        <button onClick={() => setActiveTab('metrics')} className={`flex-1 py-4 font-bold text-sm ${activeTab === 'metrics' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>Shift Metrics</button>
      </div>

      <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
        {activeTab === 'announcements' && (
          <div className="flex gap-6 h-full">
            {/* Announcements Feed */}
            <div className="flex-1 bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col">
              <div className="p-4 bg-gray-100 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-bold text-gray-800 flex items-center gap-2"><Bell size={18}/> Operational Updates</h3>
              </div>
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {[
                  { title: 'New Safety Protocol for Die Cutter', date: 'Today, 08:00', type: 'info', msg: 'Please ensure safety guards are fully locked before operating the alpha die cutter.' },
                  { title: 'Lunch Break Schedule Change', date: 'Yesterday', type: 'notice', msg: 'Group A lunch is now 12:30. Group B remains at 13:00.' },
                  { title: 'Urgent: Check Kraft Paper Quality', date: 'Mon, 10:45', type: 'warning', msg: 'We received a bad batch of 300g Kraft. If you see tearing, log as wastage immediately.' }
                ].map((item, idx) => (
                  <div key={idx} className={`p-4 rounded-lg border-l-4 ${item.type === 'warning' ? 'bg-orange-50 border-orange-500' : item.type === 'notice' ? 'bg-blue-50 border-blue-500' : 'bg-gray-50 border-gray-500'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className={`font-bold ${item.type === 'warning' ? 'text-orange-900' : 'text-gray-800'}`}>{item.title}</h4>
                      <span className="text-xs font-semibold text-gray-500">{item.date}</span>
                    </div>
                    <p className="text-sm text-gray-700">{item.msg}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Admin Override */}
            <div className="w-1/3 flex flex-col">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-red-900 flex items-center gap-2 mb-2"><ShieldAlert size={20}/> Admin Override Ping</h3>
                <p className="text-sm text-red-700 mb-6">Need an L4 Admin to bypass a lock or approve an exception? Send an instant ping.</p>
                
                <textarea className="w-full p-3 bg-white border border-red-200 rounded-lg outline-none focus:ring-2 focus:ring-red-500 mb-4 text-sm" rows={4} placeholder="Reason for override (e.g., 'Need approval to use premium paper for standard order')"></textarea>
                
                <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2 transition-colors">
                  <ShieldAlert size={18}/> Request Override Now
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="font-bold text-2xl text-gray-800">Your Shift Performance</h2>
            
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                  <Target size={32} />
                </div>
                <h3 className="text-gray-500 font-semibold text-sm">Orders Processed</h3>
                <p className="text-4xl font-black text-gray-900 mt-1">42</p>
                <p className="text-xs font-bold text-green-600 mt-2 bg-green-50 px-2 py-1 rounded-full">+12% vs yesterday</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp size={32} />
                </div>
                <h3 className="text-gray-500 font-semibold text-sm">Efficiency Rate</h3>
                <p className="text-4xl font-black text-gray-900 mt-1">94%</p>
                <p className="text-xs font-bold text-orange-600 mt-2 bg-orange-50 px-2 py-1 rounded-full">Top 10% this shift</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 border border-yellow-500 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center text-center text-white">
                <Trophy size={48} className="mb-2 opacity-90" />
                <h3 className="font-semibold text-yellow-100 text-sm">Shift Rank</h3>
                <p className="text-4xl font-black mt-1">#2</p>
                <p className="text-xs font-bold mt-2 bg-black/20 px-3 py-1 rounded-full">Keep it up!</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4">Quality & Accuracy</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-600">QA Pass Rate</span>
                    <span className="text-sm font-bold text-gray-800">98.5%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '98.5%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-600">On-Time Dispatch</span>
                    <span className="text-sm font-bold text-gray-800">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
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
