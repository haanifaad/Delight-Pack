'use client';
import { useState } from 'react';
import { generateBatchQR } from '@/lib/qrcode';
import { Printer } from 'lucide-react';

export default function QRLabelPrinter() {
  const [qrSrc, setQrSrc] = useState<string | null>(null);

  const handleGenerate = async () => {
    const src = await generateBatchQR({
      batch_id: 'BATCH-' + Math.floor(Math.random() * 10000),
      material_type: 'Printed Boxes',
      supplier_id: 'SUP-991',
      arrival_date: new Date().toISOString()
    });
    setQrSrc(src);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #print-section, #print-section * {
            visibility: visible;
          }
          #print-section {
            position: absolute;
            left: 0;
            top: 0;
            width: 4in;
            height: 6in;
            padding: 0.25in;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: black;
            background: white;
          }
        }
      `}} />

      <button 
        onClick={handleGenerate}
        className="print:hidden w-full bg-neutral-700 hover:bg-neutral-600 text-foreground font-bold py-4 px-6 border-4 border-neutral-500 rounded text-xl"
      >
        Generate Test Label
      </button>

      {qrSrc && (
        <div className="flex flex-col items-center gap-4">
          <div id="print-section" className="bg-white p-4 rounded flex flex-col items-center">
            <h2 className="text-black font-bold text-2xl mb-2 text-center">DELIGHT PACK</h2>
            <h3 className="text-black font-semibold text-lg mb-4 text-center">Material: Printed Boxes</h3>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrSrc} alt="Batch QR Code" className="w-64 h-64 object-contain" />
            <p className="text-black text-sm mt-4 font-mono">BATCH-XXXX | SUP-991</p>
          </div>
          
          <button 
            onClick={handlePrint}
            className="print:hidden w-full bg-amber-500 hover:bg-amber-400 text-neutral-900 font-black py-4 px-6 border-4 border-amber-600 rounded text-xl flex items-center justify-center gap-2"
          >
            <Printer size={28} />
            PRINT BATCH
          </button>
        </div>
      )}
    </div>
  );
}
