'use client';
import { useState, useEffect } from 'react';
import QRLabelPrinter from '@/components/inventory/QRLabelPrinter';
import { useBarcodeScanner } from '@/hooks/useBarcodeScanner';

export default function InventoryDashboard() {
  const [scannedCode, setScannedCode] = useState('');

  // Example hook usage
  useBarcodeScanner((code) => {
    setScannedCode(code);
    alert(`Scanned: ${code}`);
  });

  const categories = [
    { name: 'Raw Materials', count: 120 },
    { name: 'Printed Boxes', count: 350 },
    { name: 'Ink', count: 45 },
    { name: 'Spare Parts', count: 12 }
  ];

  return (
    <div className="min-h-screen bg-neutral-900 text-foreground p-8">
      <h1 className="text-4xl font-bold text-amber-500 mb-8 border-b-4 border-amber-600 pb-2">Inventory Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {categories.map(cat => (
          <div key={cat.name} className="bg-neutral-800 border-4 border-amber-500 rounded-xl p-6 shadow-[8px_8px_0_#f59e0b] hover:translate-y-1 hover:shadow-[4px_4px_0_#f59e0b] transition-all cursor-pointer">
            <h2 className="text-2xl font-black uppercase text-neutral-300">{cat.name}</h2>
            <p className="text-5xl font-black text-amber-400 mt-4">{cat.count}</p>
          </div>
        ))}
      </div>

      <div className="bg-neutral-800 border-4 border-neutral-700 rounded-xl p-8 max-w-md print:border-none print:bg-white print:p-0">
        <h3 className="text-2xl font-bold text-amber-500 mb-4 print:hidden">Incoming Batch QR Generator</h3>
        <QRLabelPrinter />
      </div>
    </div>
  );
}
