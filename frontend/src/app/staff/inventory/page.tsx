'use client';

import { useState } from 'react';
import Scanner from '@/components/Scanner';

export default function InventoryPage() {
  const [scannedSku, setScannedSku] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleScanSuccess = (sku: string) => {
    setScannedSku(sku);
    setMessage(null);
  };

  const handleLog = async (type: 'CHECK_IN' | 'CHECK_OUT' | 'USAGE' | 'SCRAP') => {
    if (!scannedSku) return;
    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch('http://localhost:5000/api/staff/inventory/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ sku: scannedSku, type, quantity })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to log inventory');
      }

      setMessage(\`Success: Logged \${quantity} unit(s) of \${type} for \${scannedSku}\`);
      setScannedSku(null); // Reset to scan again
      setQuantity(1);
    } catch (e: any) {
      setMessage(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 style={{ color: '#ff9800', marginBottom: '24px' }}>Material Scanning</h1>
      
      {message && (
        <div style={{ padding: '16px', backgroundColor: message.startsWith('Success') ? '#1b5e20' : '#b71c1c', borderRadius: '8px', marginBottom: '24px' }}>
          {message}
        </div>
      )}

      {!scannedSku ? (
        <div style={{ backgroundColor: '#1a1a1a', padding: '16px', borderRadius: '8px' }}>
          <p style={{ textAlign: 'center', marginBottom: '16px', color: '#aaa' }}>Point camera at barcode/QR code</p>
          <Scanner onScanSuccess={handleScanSuccess} />
        </div>
      ) : (
        <div style={{ backgroundColor: '#1a1a1a', padding: '24px', borderRadius: '8px' }}>
          <h2 style={{ marginBottom: '8px' }}>SKU: <span style={{ color: '#ff9800' }}>{scannedSku}</span></h2>
          <p style={{ color: '#aaa', marginBottom: '24px' }}>Specify quantity and action below.</p>
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Quantity</label>
            <input 
              type="number" 
              value={quantity} 
              onChange={(e) => setQuantity(Number(e.target.value))}
              min="0.1"
              step="0.1"
              style={{ width: '100%', padding: '12px', fontSize: '18px', backgroundColor: '#121212', color: '#fff', border: '1px solid #333', borderRadius: '8px' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <button 
              disabled={isSubmitting}
              onClick={() => handleLog('CHECK_IN')}
              style={{ padding: '16px', backgroundColor: '#2e7d32', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px' }}
            >
              📥 Check In
            </button>
            <button 
              disabled={isSubmitting}
              onClick={() => handleLog('CHECK_OUT')}
              style={{ padding: '16px', backgroundColor: '#1565c0', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px' }}
            >
              📤 Check Out
            </button>
            <button 
              disabled={isSubmitting}
              onClick={() => handleLog('USAGE')}
              style={{ padding: '16px', backgroundColor: '#e65100', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px' }}
            >
              ⚙️ Log Usage
            </button>
            <button 
              disabled={isSubmitting}
              onClick={() => handleLog('SCRAP')}
              style={{ padding: '16px', backgroundColor: '#c62828', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px' }}
            >
              🗑️ Log Scrap
            </button>
          </div>

          <button 
            onClick={() => setScannedSku(null)}
            style={{ width: '100%', padding: '16px', marginTop: '24px', backgroundColor: 'transparent', color: '#aaa', border: '1px solid #555', borderRadius: '8px', fontWeight: 'bold' }}
          >
            Cancel / Scan Again
          </button>
        </div>
      )}
    </div>
  );
}
