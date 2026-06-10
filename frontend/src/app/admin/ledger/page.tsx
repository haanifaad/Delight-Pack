'use client';

import { useState } from 'react';
import { DataGrid, ColumnDef, RowData } from '@/components/grid/DataGrid';

const ledgerColumns: ColumnDef[] = [
  { key: 'date', header: 'Date', width: 'w-32' },
  { key: 'reference', header: 'Voucher Ref.', width: 'w-40' },
  { key: 'account', header: 'Account Name', width: 'w-64' },
  { key: 'particulars', header: 'Particulars', width: 'w-64' },
  { key: 'debit', header: 'Debit (AED)', width: 'w-32' },
  { key: 'credit', header: 'Credit (AED)', width: 'w-32' },
];

const initialLedgerData: RowData[] = [
  { date: '2026-06-10', reference: 'V-001', account: 'Cash Account', particulars: 'Opening Balance', debit: '15000', credit: '' },
  { date: '2026-06-10', reference: 'V-002', account: 'Sales - Packaging', particulars: 'Invoice #101', debit: '', credit: '5000' },
  { date: '2026-06-11', reference: 'V-003', account: 'Raw Materials', particulars: 'Kraft Paper 200GSM', debit: '2500 * 1.05', credit: '' },
  { date: '', reference: '', account: '', particulars: '', debit: '', credit: '' },
  { date: '', reference: '', account: '', particulars: '', debit: '', credit: '' },
];

export default function AdminLedgerPage() {
  const [saveStatus, setSaveStatus] = useState<string>('');

  const handleSave = (data: RowData[]) => {
    console.log('Saving Ledger Data:', data);
    setSaveStatus('Ledger saved successfully at ' + new Date().toLocaleTimeString());
    setTimeout(() => setSaveStatus(''), 3000);
  };

  return (
    <div className="p-6 h-screen flex flex-col bg-black">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold text-amber-500">General Ledger</h1>
          <p className="text-neutral-400 mt-1">High-Velocity Entry Grid</p>
        </div>
        {saveStatus && <div className="text-green-500 text-sm font-medium animate-pulse">{saveStatus}</div>}
      </div>

      <div className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg shadow-2xl p-4">
        <DataGrid 
          columns={ledgerColumns}
          initialData={initialLedgerData}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}
