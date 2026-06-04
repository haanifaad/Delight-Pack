/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Package, Activity, FileText } from 'lucide-react';

export default function App() {
  const [orderId, setOrderId] = useState('ORD-10024');
  const [status, setStatus] = useState('Pending');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [invoiceUrl, setInvoiceUrl] = useState<string | null>(null);

  const simulateStatusChange = async (newStatus: string) => {
    setLoading(true);
    setStatus(newStatus);
    try {
      const res = await fetch('/api/orders/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, newStatus }),
      });
      const data = await res.json();
      setResponse(data);
    } catch (err: any) {
      setResponse({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const generateInvoice = async () => {
    setInvoiceLoading(true);
    setInvoiceUrl(null);
    try {
      const mockInvoiceData = {
        invoiceNumber: `INV-${Math.floor(Math.random() * 10000)}`,
        date: new Date().toLocaleDateString(),
        clientName: 'Global Logistics LLC',
        clientAddress: 'Office 402, Business Bay, Dubai',
        items: [
          { description: 'Premium Matte Paper Roll (10m)', quantity: 20, unitPrice: 150 },
          { description: 'Cyan Industrial Ink (1L)', quantity: 4, unitPrice: 400 },
          { description: 'Magenta Industrial Ink (1L)', quantity: 4, unitPrice: 400 },
        ],
      };

      const res = await fetch('/api/invoice/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockInvoiceData),
      });
      const data = await res.json();
      
      if (data.success) {
         setInvoiceUrl(data.url);
      } else {
         setResponse(data);
      }
    } catch (err: any) {
      setResponse({ error: err.message });
    } finally {
      setInvoiceLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-4 font-sans text-gray-900">
      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Previous feature */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 space-y-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-medium tracking-tight text-gray-900">Order Production</h1>
              <p className="text-sm text-gray-500">Test Postgres event hook</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-sm"
                placeholder="e.g. ORD-10024"
              />
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Current Status:</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                {status}
              </span>
            </div>

            <div className="pt-4 grid grid-cols-2 gap-3">
              <button
                onClick={() => simulateStatusChange('Pending')}
                disabled={loading}
                className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Set Pending
              </button>
              <button
                onClick={() => simulateStatusChange('In Production')}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                Set In Production
              </button>
            </div>
          </div>
        </div>

        {/* New Feature */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 space-y-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-medium tracking-tight text-gray-900">Invoice Generation</h1>
              <p className="text-sm text-gray-500">PDFKit B2B Invoice & GCS Upload</p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Generates a corporate B2B PDF invoice including UAE VAT calculation, and simulated upload to Google Cloud Storage.
            </p>

            <button
              onClick={generateInvoice}
              disabled={invoiceLoading}
              className="w-full px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
            >
              {invoiceLoading ? 'Building PDF...' : 'Generate B2B Invoice'}
            </button>
            
            {invoiceUrl && (
               <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-800 text-sm break-all">
                  <span className="font-semibold block mb-1">Upload Successful:</span>
                  <a href={invoiceUrl} target="_blank" rel="noreferrer" className="underline hover:text-emerald-900">
                     {invoiceUrl}
                  </a>
               </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Response Box Modal / Overlay or just bottom row */}
      {response && Object.keys(response).length > 0 && (
         <div className="fixed bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[600px] z-50">
            <div className="bg-gray-900 bg-opacity-95 text-gray-100 rounded-xl shadow-xl p-4 border border-gray-800 relative">
               <button 
                  onClick={() => setResponse(null)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white"
               >
                  ✕
               </button>
               <h2 className="text-sm font-semibold mb-2">Operation Result</h2>
               <pre className="text-xs font-mono overflow-auto max-h-[300px] whitespace-pre-wrap">
                  {JSON.stringify(response, null, 2)}
               </pre>
            </div>
         </div>
      )}
    </div>
  );
}
