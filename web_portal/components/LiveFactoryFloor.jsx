import React, { useState, useEffect } from 'react';
// Assuming you have initialized Firebase elsewhere in the Next.js app
// import { database } from '../lib/firebase';
// import { ref, onValue } from 'firebase/database';

// Mocking Firebase hooks for the component structure
const mockMachines = {
  'MCH-001': { status: 'Online', temperature: 45, total_boxes: 12500 },
  'MCH-002': { status: 'Overheating', temperature: 185, total_boxes: 8400 },
  'MCH-003': { status: 'Offline', temperature: 22, total_boxes: 5000 },
};

export default function LiveFactoryFloor() {
  const [machines, setMachines] = useState(mockMachines);

  /*
  // Real implementation using Firebase:
  useEffect(() => {
    const machinesRef = ref(database, 'factory/machines');
    const unsubscribe = onValue(machinesRef, (snapshot) => {
      if (snapshot.exists()) {
        setMachines(snapshot.val());
      }
    });
    return () => unsubscribe();
  }, []);
  */

  const getStatusColor = (status) => {
    switch (status) {
      case 'Online': return 'bg-green-500 shadow-green-500/50';
      case 'Overheating': return 'bg-red-600 shadow-red-600/70 animate-pulse';
      case 'Offline': return 'bg-gray-500 shadow-gray-500/50';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="p-6 bg-[#121212] min-h-screen text-white">
      <h2 className="text-3xl font-black tracking-wide mb-8 text-[#FFC107]">Live Factory Floor</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(machines).map(([id, data]) => (
          <div key={id} className="bg-[#1E1E1E] rounded-2xl p-6 border-2 border-white/10 relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold">{id}</h3>
                <span className={`inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/50`}>
                  <span className={`w-3 h-3 rounded-full shadow-lg ${getStatusColor(data.status)}`}></span>
                  {data.status}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400 font-semibold uppercase">Temp</p>
                <p className={`text-2xl font-bold ${data.temperature > 180 ? 'text-red-500' : 'text-white'}`}>
                  {data.temperature}°C
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t-2 border-white/10">
              <p className="text-sm text-gray-400 font-semibold uppercase mb-1">Production Count</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-[#FFC107]">
                  {data.total_boxes?.toLocaleString()}
                </span>
                <span className="text-sm font-bold text-gray-500 uppercase">Boxes</span>
              </div>
            </div>
            
            {/* Warning overlay for overheating */}
            {data.status === 'Overheating' && (
              <div className="absolute inset-0 border-4 border-red-600 rounded-2xl pointer-events-none"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
