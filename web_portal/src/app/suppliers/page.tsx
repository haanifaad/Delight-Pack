'use client';
import { useState } from 'react';

type Supplier = {
  id: string;
  name: string;
  category: string;
  leadTime: number;
  contracts: number;
  slaMeeting: boolean;
};

const initialData: Supplier[] = [
  { id: '1', name: 'Global Papers Inc.', category: 'Raw Materials', leadTime: 12, contracts: 3, slaMeeting: true },
  { id: '2', name: 'FastInks Ltd.', category: 'Ink', leadTime: 4, contracts: 1, slaMeeting: false },
  { id: '3', name: 'BoxMakers Co.', category: 'Printed Boxes', leadTime: 7, contracts: 5, slaMeeting: true },
];

export default function SupplierManagement() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialData);

  const handleEdit = (id: string, field: keyof Supplier, value: string | number | boolean) => {
    setSuppliers(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8 font-sans">
      <h1 className="text-3xl font-light text-slate-100 mb-8 border-b border-slate-800 pb-4">Supplier Management</h1>
      
      <div className="overflow-x-auto rounded-lg border border-slate-800 shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 text-muted-foreground text-sm uppercase tracking-wider">
              <th className="p-4 font-semibold">Supplier Name</th>
              <th className="p-4 font-semibold">Material Category</th>
              <th className="p-4 font-semibold">Avg Lead Time (Days)</th>
              <th className="p-4 font-semibold">Active Contracts</th>
              <th className="p-4 font-semibold">SLA Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {suppliers.map((sup) => (
              <tr key={sup.id} className="bg-slate-900/50 hover:bg-slate-800/50 transition-colors">
                <td className="p-4">
                  <input 
                    type="text" 
                    value={sup.name} 
                    onChange={e => handleEdit(sup.id, 'name', e.target.value)}
                    className="bg-transparent border-none focus:ring-2 focus:ring-emerald-500 rounded px-2 py-1 w-full text-slate-100 font-medium"
                  />
                </td>
                <td className="p-4">
                  <input 
                    type="text" 
                    value={sup.category} 
                    onChange={e => handleEdit(sup.id, 'category', e.target.value)}
                    className="bg-transparent border-none focus:ring-2 focus:ring-emerald-500 rounded px-2 py-1 w-full text-slate-300"
                  />
                </td>
                <td className="p-4">
                  <input 
                    type="number" 
                    value={sup.leadTime} 
                    onChange={e => handleEdit(sup.id, 'leadTime', parseInt(e.target.value) || 0)}
                    className="bg-transparent border-none focus:ring-2 focus:ring-emerald-500 rounded px-2 py-1 w-24 text-slate-300"
                  />
                </td>
                <td className="p-4">
                  <input 
                    type="number" 
                    value={sup.contracts} 
                    onChange={e => handleEdit(sup.id, 'contracts', parseInt(e.target.value) || 0)}
                    className="bg-transparent border-none focus:ring-2 focus:ring-emerald-500 rounded px-2 py-1 w-24 text-slate-300"
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2 px-2">
                    <div className={`w-3 h-3 rounded-full ${sup.slaMeeting ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'}`}></div>
                    <span className={`text-sm font-semibold ${sup.slaMeeting ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {sup.slaMeeting ? 'Meeting SLA' : 'At Risk'}
                    </span>
                    <button 
                      onClick={() => handleEdit(sup.id, 'slaMeeting', !sup.slaMeeting)}
                      className="ml-auto text-xs text-muted-foreground hover:text-slate-300 underline"
                    >
                      Toggle
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
