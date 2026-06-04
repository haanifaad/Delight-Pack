'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { db } from '../../../firebase/config';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { calculateRowTotals, calculateAggregates, SpreadsheetRow } from '../../../lib/financeUtils';
import { Plus, Save, Loader2 } from 'lucide-react';

export default function TallySpreadsheet() {
  const [rows, setRows] = useState<SpreadsheetRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Listen to real-time inventory
    const unsub = onSnapshot(doc(db, 'inventory', 'master'), (docSnap) => {
      if (docSnap.exists()) {
        setRows(docSnap.data().items || []);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const saveToFirestore = useCallback(async (currentRows: SpreadsheetRow[]) => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'inventory', 'master'), { items: currentRows });
      
      // Also update finance ledger metrics automatically based on the grid shift
      const agg = calculateAggregates(currentRows);
      await setDoc(doc(db, 'finance', 'ledger_totals'), {
        lastUpdated: new Date().toISOString(),
        totalInventoryValue: agg.total,
        totalTaxVAT: agg.tax,
      }, { merge: true });

    } catch (err) {
      console.error("Error saving to Firestore", err);
    } finally {
      setSaving(false);
    }
  }, []);

  const handleRowChange = (id: string, field: keyof SpreadsheetRow, value: string | number) => {
    setRows(prevRows => {
      const newRows = prevRows.map(row => {
        if (row.id === id) {
          const updated = { ...row, [field]: value };
          if (field === 'quantity' || field === 'rate') {
            const numQty = Number(updated.quantity) || 0;
            const numRate = Number(updated.rate) || 0;
            const { subtotal, tax, total } = calculateRowTotals(numQty, numRate);
            return { ...updated, subtotal, tax, total };
          }
          return updated;
        }
        return row;
      });

      // Debounce the save operation to avoid rapid unbatched writes
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        saveToFirestore(newRows);
      }, 1000);

      return newRows;
    });
  };

  const addRow = () => {
    const newRow: SpreadsheetRow = {
      id: crypto.randomUUID(),
      item: 'New Item',
      quantity: 1,
      rate: 0,
      subtotal: 0,
      tax: 0,
      total: 0
    };
    setRows(prev => {
      const newRows = [...prev, newRow];
      saveToFirestore(newRows);
      return newRows;
    });
  };

  const aggregates = calculateAggregates(rows);

  if (loading) return <div className="flex justify-center items-center h-screen bg-background text-foreground"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-background text-foreground p-8 pt-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-8 border-b border-border pb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter">TallyAI Grid</h1>
            <p className="text-muted-foreground font-light text-sm mt-1">Live inventory & VAT ledger syncing.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              {saving ? <><Loader2 className="w-4 h-4 animate-spin text-emerald-500" /> Saving...</> : <><Save className="w-4 h-4" /> All changes saved</>}
            </div>
            <button onClick={addRow} className="bg-white text-black px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-slate-200 transition-colors">
              <Plus className="w-4 h-4" /> Add Row
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-card-hover border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium text-muted-foreground">Item Name</th>
                <th className="px-6 py-4 font-medium text-muted-foreground text-right">Quantity</th>
                <th className="px-6 py-4 font-medium text-muted-foreground text-right">Rate (AED)</th>
                <th className="px-6 py-4 font-medium text-muted-foreground text-right">Subtotal</th>
                <th className="px-6 py-4 font-medium text-muted-foreground text-right text-emerald-500">VAT (5%)</th>
                <th className="px-6 py-4 font-medium text-muted-foreground text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c1c1c]">
              {rows.map(row => (
                <tr key={row.id} className="hover:bg-[#111111]/50 transition-colors">
                  <td className="px-6 py-3">
                    <input 
                      type="text" 
                      value={row.item} 
                      onChange={e => handleRowChange(row.id, 'item', e.target.value)}
                      className="bg-transparent border-none outline-none w-full text-foreground placeholder-slate-600"
                    />
                  </td>
                  <td className="px-6 py-3 text-right">
                    <input 
                      type="number" 
                      value={row.quantity} 
                      onChange={e => handleRowChange(row.id, 'quantity', Number(e.target.value))}
                      className="bg-transparent border-none outline-none w-full text-right text-foreground"
                      min="0"
                    />
                  </td>
                  <td className="px-6 py-3 text-right">
                    <input 
                      type="number" 
                      value={row.rate} 
                      onChange={e => handleRowChange(row.id, 'rate', Number(e.target.value))}
                      className="bg-transparent border-none outline-none w-full text-right text-foreground"
                      min="0" step="0.01"
                    />
                  </td>
                  <td className="px-6 py-3 text-right text-slate-300">
                    {row.subtotal.toFixed(2)}
                  </td>
                  <td className="px-6 py-3 text-right text-emerald-400/90 font-medium">
                    {row.tax.toFixed(2)}
                  </td>
                  <td className="px-6 py-3 text-right font-semibold text-foreground">
                    {row.total.toFixed(2)}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground italic">No inventory items. Click &quot;Add Row&quot; to start.</td>
                </tr>
              )}
            </tbody>
            <tfoot className="bg-card-hover border-t border-border">
              <tr>
                <td colSpan={3} className="px-6 py-4 text-right font-medium text-muted-foreground">Grand Total</td>
                <td className="px-6 py-4 text-right font-medium text-foreground">{aggregates.subtotal.toFixed(2)} AED</td>
                <td className="px-6 py-4 text-right font-medium text-emerald-400">{aggregates.tax.toFixed(2)} AED</td>
                <td className="px-6 py-4 text-right font-bold text-foreground text-lg">{aggregates.total.toFixed(2)} AED</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
