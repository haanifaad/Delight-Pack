import { useState, useEffect } from 'react';
import { Truck, MapPin, Upload, SplitSquareHorizontal, Printer } from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '../firebase';
import type { ProductionOrder, DispatchDriver } from '../types';

export default function LogisticsView() {
  const [activeTab, setActiveTab] = useState<'dispatch' | 'pod'>('dispatch');
  const [orders, setOrders] = useState<ProductionOrder[]>([]);
  const [drivers, setDrivers] = useState<DispatchDriver[]>([]);
  
  const assignDriver = httpsCallable(functions, 'staff-assignDriver');

  useEffect(() => {
    const unsubOrders = onSnapshot(collection(db, 'production_orders'), snapshot => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProductionOrder)));
    });
    const unsubDrivers = onSnapshot(collection(db, 'dispatch_drivers'), snapshot => {
      setDrivers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DispatchDriver)));
    });
    return () => { unsubOrders(); unsubDrivers(); };
  }, []);

  const readyOrders = orders.filter(o => o.status === 'Finished');

  const handleAssignDriver = async (driverId: string, orderIds: string[]) => {
    try {
      await assignDriver({ driverId, orderIds });
      alert('Driver assigned successfully');
    } catch (e) {
      console.error(e);
      alert('Failed to assign driver');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex border-b border-gray-100">
        <button onClick={() => setActiveTab('dispatch')} className={`flex-1 py-4 font-bold text-sm ${activeTab === 'dispatch' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>Dispatch & Routing</button>
        <button onClick={() => setActiveTab('pod')} className={`flex-1 py-4 font-bold text-sm ${activeTab === 'pod' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>Proof of Delivery (POD)</button>
      </div>

      <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
        {activeTab === 'dispatch' && (
          <div className="flex gap-6 h-full">
            {/* Orders ready for dispatch */}
            <div className="flex-1 bg-white border border-gray-200 rounded-xl flex flex-col overflow-hidden">
              <div className="p-4 bg-gray-100 border-b border-gray-200">
                <h3 className="font-bold text-gray-800 flex items-center gap-2"><Package size={18}/> Ready for Dispatch</h3>
              </div>
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {readyOrders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors cursor-pointer bg-gray-50">
                    <div className="flex justify-between mb-1">
                      <span className="font-bold text-sm text-gray-800">{order.orderNumber}</span>
                      <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">{order.routeGroup || 'Unassigned Zone'}</span>
                    </div>
                    <p className="text-xs text-gray-600 flex items-center gap-1 mb-2"><MapPin size={12}/> {order.destination || 'Pending Address'}</p>
                    <p className="text-xs font-semibold text-gray-700">{order.itemsDescription}</p>
                    <div className="flex gap-2 mt-3 pt-2 border-t border-gray-200">
                      <button className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold py-1.5 rounded flex items-center justify-center gap-1">
                        <Printer size={12}/> Print Slip
                      </button>
                      <button className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold py-1.5 rounded flex items-center justify-center gap-1">
                        <SplitSquareHorizontal size={12}/> Partial
                      </button>
                    </div>
                  </div>
                ))}
                {readyOrders.length === 0 && <p className="text-gray-500 text-sm p-4 text-center">No orders currently ready for dispatch.</p>}
              </div>
            </div>

            {/* Drivers & Assignment */}
            <div className="flex-1 flex flex-col gap-6">
              <div className="bg-white border border-gray-200 rounded-xl flex flex-col flex-1 overflow-hidden">
                <div className="p-4 bg-gray-100 border-b border-gray-200">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2"><Truck size={18}/> Driver Allocation</h3>
                </div>
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {drivers.map(driver => (
                    <div key={driver.id} className={`border rounded-lg p-4 ${driver.vehicleStatus === 'Loading' ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                      <div className="flex justify-between items-center mb-3">
                        <h4 className={`font-bold ${driver.vehicleStatus === 'Loading' ? 'text-green-900' : 'text-gray-800'}`}>{driver.name}</h4>
                        <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${driver.vehicleStatus === 'Loading' ? 'text-green-700 bg-green-200' : 'text-gray-500 bg-gray-200'}`}>
                          {driver.vehicleStatus}
                        </span>
                      </div>
                      
                      {driver.assignedOrderIds && driver.assignedOrderIds.length > 0 ? (
                        <div className="space-y-2">
                          {driver.assignedOrderIds.map(oid => {
                            const o = orders.find(x => x.id === oid);
                            return (
                              <div key={oid} className="bg-white p-2 rounded border border-green-100 text-sm flex justify-between">
                                <span className="font-bold">{o?.orderNumber || oid}</span>
                                <span className="text-xs text-gray-500">{o?.destination || 'Unknown'}</span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center text-sm text-gray-400 font-semibold">
                          Drag orders here to assign
                        </div>
                      )}

                      {driver.vehicleStatus === 'Loading' && (
                        <button className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded text-sm">
                          Dispatch Vehicle
                        </button>
                      )}
                    </div>
                  ))}
                  {drivers.length === 0 && <p className="text-gray-500 text-sm text-center">No drivers registered.</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pod' && (
          <div className="bg-white border border-gray-200 rounded-xl p-8 max-w-2xl mx-auto flex flex-col items-center">
            <h3 className="font-bold text-gray-800 text-xl mb-2">Upload Proof of Delivery</h3>
            <p className="text-gray-500 text-sm mb-8">Attach signed delivery notes or photos from returning drivers.</p>

            <div className="w-full space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Order ID</label>
                <input type="text" className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. ORD-9912" />
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center text-gray-500 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                <Upload size={48} className="mb-4 text-blue-500" />
                <p className="font-bold">Click or drag file to upload POD</p>
                <p className="text-xs mt-1">Supports PDF, JPG, PNG</p>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-lg transition-colors">
                Submit POD
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Simple fallback for Package icon if not imported at top
function Package(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width={props.size||24} height={props.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>;
}
