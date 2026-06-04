'use client';
import { useState } from 'react';
import { Download } from 'lucide-react';

export default function FinancialExport() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleExport = () => {
    if (!startDate || !endDate) {
      alert('Please select a valid date range.');
      return;
    }
    // Redirect browser to stream the CSV file download
    window.location.href = '/api/finance/export?startDate=' + startDate + '&endDate=' + endDate;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl flex flex-col gap-4">
      <h2 className="text-xl font-light text-slate-200 uppercase tracking-widest">Export Financials (CSV)</h2>
      
      <div className="flex flex-col md:flex-row gap-4 mt-2">
        <div className="flex flex-col flex-1">
          <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Start Date</label>
          <input 
            type="date" 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded p-3 text-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
        <div className="flex flex-col flex-1">
          <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1">End Date</label>
          <input 
            type="date" 
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded p-3 text-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
      </div>

      <button 
        onClick={handleExport}
        className="mt-4 bg-emerald-600 hover:bg-emerald-500 text-foreground font-bold py-3 px-6 rounded flex items-center justify-center gap-2 transition-colors"
      >
        <Download size={20} />
        DOWNLOAD CSV
      </button>
    </div>
  );
}
