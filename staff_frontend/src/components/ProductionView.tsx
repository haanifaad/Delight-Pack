import { useState, useEffect } from 'react';
import { Play, Square, AlertOctagon, CheckSquare, Camera, Clock } from 'lucide-react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '../firebase';
import type { ProductionOrder, Machine, ShiftLog, OrderStatus, MachineState } from '../types';

export default function ProductionView() {
  const [activeTab, setActiveTab] = useState<'kanban' | 'machines' | 'logbook'>('kanban');
  const [timer, setTimer] = useState<number>(0);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);

  const [orders, setOrders] = useState<ProductionOrder[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [shiftLogs, setShiftLogs] = useState<ShiftLog[]>([]);
  const [newLog, setNewLog] = useState('');

  const updateOrderStatus = httpsCallable(functions, 'staff-updateOrderStatus');
  const updateMachineStatus = httpsCallable(functions, 'staff-updateMachineStatus');
  const postShiftLog = httpsCallable(functions, 'staff-postShiftLog');

  useEffect(() => {
    let interval: any;
    if (timerRunning) {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  useEffect(() => {
    const unsubOrders = onSnapshot(collection(db, 'production_orders'), snapshot => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProductionOrder)));
    });
    const unsubMachines = onSnapshot(collection(db, 'machines'), snapshot => {
      setMachines(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Machine)));
    });
    const unsubLogs = onSnapshot(query(collection(db, 'shift_logs'), orderBy('timestamp', 'desc')), snapshot => {
      setShiftLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ShiftLog)));
    });
    return () => { unsubOrders(); unsubMachines(); unsubLogs(); };
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleMachineStatusChange = async (machineId: string, status: MachineState, reason?: string) => {
    try {
      await updateMachineStatus({ machineId, status, downtimeReason: reason });
    } catch (e) {
      console.error(e);
      alert('Failed to update machine');
    }
  };

  const handlePostLog = async () => {
    if (!newLog.trim()) return;
    try {
      await postShiftLog({ message: newLog });
      setNewLog('');
    } catch (e) {
      console.error(e);
      alert('Failed to post log');
    }
  };

  const getMachineColor = (status: string) => {
    switch(status) {
      case 'Active': return 'bg-green-500';
      case 'Idle': return 'bg-gray-400';
      case 'Under Maintenance': return 'bg-yellow-500';
      case 'Broken': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const kanbanColumns: { title: string, status: OrderStatus }[] = [
    { title: 'Pending / Up Next', status: 'Pending' },
    { title: 'Printing', status: 'Printing' },
    { title: 'Cutting / Assembly', status: 'Cutting' },
    { title: 'QA & Finished', status: 'Finished' }
  ];

  const handleMoveOrder = async (orderId: string, currentStatus: OrderStatus) => {
    const statuses: OrderStatus[] = ['Pending', 'Printing', 'Cutting', 'Finished', 'Dispatched'];
    const currentIndex = statuses.indexOf(currentStatus);
    if (currentIndex < 3) {
      try {
        await updateOrderStatus({ orderId, newStatus: statuses[currentIndex + 1] });
      } catch (e) {
        console.error(e);
        alert('Failed to move order');
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex border-b border-gray-100 bg-gray-50 rounded-t-xl justify-between items-center pr-4">
        <div className="flex flex-1">
          <button onClick={() => setActiveTab('kanban')} className={`py-4 px-6 font-bold text-sm ${activeTab === 'kanban' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-500 hover:bg-white'}`}>Live Kanban</button>
          <button onClick={() => setActiveTab('machines')} className={`py-4 px-6 font-bold text-sm ${activeTab === 'machines' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-500 hover:bg-white'}`}>Machine Status</button>
          <button onClick={() => setActiveTab('logbook')} className={`py-4 px-6 font-bold text-sm ${activeTab === 'logbook' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-500 hover:bg-white'}`}>Shift Logbook</button>
        </div>
        <button className="bg-red-600 hover:bg-red-700 text-white font-black px-4 py-2 rounded shadow-sm flex items-center gap-2 animate-pulse transition-colors">
          <AlertOctagon size={20} /> HALT ALL MACHINES
        </button>
      </div>

      <div className="flex-1 p-6 overflow-y-auto bg-gray-100">
        {activeTab === 'kanban' && (
          <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-xl text-gray-800">Factory Floor Orders</h2>
              <div className="flex items-center gap-4 bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
                <span className="font-semibold text-gray-600 flex items-center gap-2"><Clock size={16}/> Job Timer:</span>
                <span className="font-mono font-black text-xl w-16">{formatTime(timer)}</span>
                <button onClick={() => setTimerRunning(!timerRunning)} className={`p-1.5 rounded text-white ${timerRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}>
                  {timerRunning ? <Square size={16} /> : <Play size={16} fill="currentColor" />}
                </button>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-4 gap-4 h-full">
              {kanbanColumns.map((col, idx) => {
                const colOrders = orders.filter(o => o.status === col.status);
                return (
                  <div key={idx} className="bg-gray-200/50 rounded-xl p-4 flex flex-col">
                    <h3 className="font-bold text-gray-700 mb-3 flex justify-between items-center">
                      {col.title}
                      <span className="bg-gray-300 text-gray-700 text-xs px-2 py-0.5 rounded-full">{colOrders.length}</span>
                    </h3>
                    <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
                      {colOrders.map(order => (
                        <div key={order.id} onClick={() => handleMoveOrder(order.id, order.status)} className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:border-blue-400 transition-colors relative">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-black text-blue-600">{order.orderNumber}</span>
                            {order.isRush && <span className="bg-red-100 text-red-700 text-[10px] font-bold px-1.5 py-0.5 rounded">RUSH</span>}
                          </div>
                          <p className="font-bold text-sm text-gray-800 mb-2">{order.itemsDescription}</p>
                          <p className="text-[10px] text-gray-400 font-semibold mb-2">Tap to move forward</p>
                          {col.status === 'Finished' && (
                            <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between">
                              <button className="text-xs font-bold text-gray-600 hover:text-blue-600 flex items-center gap-1"><CheckSquare size={14}/> QA Form</button>
                              <button className="text-xs font-bold text-gray-600 hover:text-blue-600 flex items-center gap-1"><Camera size={14}/> Photo</button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'machines' && (
          <div className="space-y-6">
            <h2 className="font-bold text-xl text-gray-800">Machine Status Overview</h2>
            <div className="grid grid-cols-3 gap-6">
              {machines.map((m) => (
                <div key={m.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-3 h-3 rounded-full ${getMachineColor(m.status)} animate-pulse`}></div>
                    <h3 className="font-bold text-gray-800 text-lg">{m.name}</h3>
                  </div>
                  <div className="flex flex-col gap-2">
                    <select 
                      className="w-full p-2 bg-gray-50 border border-gray-300 rounded font-semibold text-sm outline-none focus:ring-2 focus:ring-blue-500" 
                      value={m.status}
                      onChange={(e) => handleMachineStatusChange(m.id, e.target.value as MachineState, m.downtimeReason)}
                    >
                      <option value="Active">🟢 Active / Running</option>
                      <option value="Idle">⚪ Idle / Standby</option>
                      <option value="Under Maintenance">🟡 Under Maintenance</option>
                      <option value="Broken">🔴 Broken / Down</option>
                    </select>
                    {m.status === 'Broken' && (
                      <select 
                        className="w-full p-2 bg-red-50 border border-red-200 rounded font-semibold text-sm outline-none text-red-800"
                        value={m.downtimeReason || ''}
                        onChange={(e) => handleMachineStatusChange(m.id, 'Broken', e.target.value)}
                      >
                        <option value="">Select reason...</option>
                        <option value="Power Outage">Power Outage</option>
                        <option value="Mechanical Failure">Mechanical Failure</option>
                        <option value="Waiting for Materials">Waiting for Materials</option>
                        <option value="No Operator Available">No Operator Available</option>
                      </select>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'logbook' && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-3xl mx-auto">
            <h3 className="font-bold text-gray-800 text-xl mb-6">Shift Handover Digital Logbook</h3>
            
            <div className="space-y-4 mb-8">
              {shiftLogs.map(log => (
                <div key={log.id} className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-blue-900 text-sm">{log.staffName || 'Staff Member'}</span>
                    <span className="text-xs text-blue-600 font-semibold">{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-blue-800">{log.message}</p>
                </div>
              ))}
              {shiftLogs.length === 0 && <p className="text-gray-500 text-sm text-center">No logs recorded yet.</p>}
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h4 className="font-bold text-sm text-gray-700 mb-2">Add Handover Note</h4>
              <textarea 
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 mb-3" 
                rows={4} 
                placeholder="Leave notes for the incoming shift regarding machine quirks, pending tasks, etc..."
                value={newLog}
                onChange={e => setNewLog(e.target.value)}
              ></textarea>
              <button onClick={handlePostLog} className="bg-gray-900 hover:bg-black text-white font-bold py-2 px-6 rounded-lg transition-colors">Post to Logbook</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
