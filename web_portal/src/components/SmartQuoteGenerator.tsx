'use client';

import React, { useState } from 'react';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { Loader2, Calculator, ArrowRight } from 'lucide-react';
import { SpreadsheetRow } from '../lib/financeUtils';

export default function SmartQuoteGenerator() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState<{item: string, qty: number, unitPrice: number, total: number} | null>(null);
  const [error, setError] = useState('');
  
  // Fetch latest inventory snapshot for context
  const getInventoryContext = async () => {
    try {
      const docSnap = await getDoc(doc(db, 'inventory', 'master'));
      if (docSnap.exists() && docSnap.data().items) {
        return docSnap.data().items as SpreadsheetRow[];
      }
      return [];
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    setError('');
    setQuote(null);

    try {
      const inventory = await getInventoryContext();
      
      const prompt = `You are the Smart Quote Generator for Delight Pack.
We have the following inventory rates (AED):
${inventory.map(i => `- ${i.item}: ${i.rate} per unit`).join('\n')}

The user wants a quote based on this input: "${query}"
Extract the requested item (try to match it to our inventory) and the quantity. 
If the item exists, calculate the exact price based on the rate. If it doesn't exactly match, estimate based on the closest item or use a default of 10 AED.
Return ONLY a raw JSON object with this structure: {"item": "Matched Item Name", "qty": number, "unitPrice": number, "total": number}
Do not return any markdown code blocks, just the JSON string.`;

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] })
      });
      
      const data = await res.json();
      
      if (data.text) {
        try {
          // Parse the JSON string
          const parsedStr = data.text.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(parsedStr);
          setQuote(parsed);
        } catch {
          setError("Failed to parse quote from Smart System. Please try rephrasing.");
        }
      } else {
        setError("Error communicating with Smart Engine.");
      }
    } catch {
      setError("Network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-8 max-w-2xl mx-auto w-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-500/20 p-2.5 rounded-xl">
          <Calculator className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Smart Quote Generator</h2>
          <p className="text-sm text-muted-foreground">Describe what you need, and our Smart System will cross-reference live rates.</p>
        </div>
      </div>

      <form onSubmit={handleGenerate} className="flex gap-4 mb-8">
        <input 
          type="text" 
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="e.g. 'I need 500 corrugated boxes for shipping'"
          className="flex-1 bg-[#111] border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-blue-500 transition-colors"
        />
        <button 
          type="submit" 
          disabled={!query || loading}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-foreground px-6 rounded-xl font-medium transition-colors flex items-center justify-center min-w-[120px]"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Generate'}
        </button>
      </form>

      {error && <div className="text-red-400 text-sm mb-4">{error}</div>}

      {quote && (
        <div className="bg-[#111] border border-border rounded-xl p-6 animate-fade-in">
          <h3 className="text-muted-foreground text-sm font-medium uppercase tracking-wider mb-4">Generated Quote structure</h3>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Item Match</div>
                <div className="text-foreground font-medium">{quote.item}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Quantity</div>
                <div className="text-foreground font-medium">{quote.qty.toLocaleString()} Units</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Unit Price</div>
                <div className="text-foreground font-medium">{quote.unitPrice.toFixed(2)} AED</div>
              </div>
            </div>
            
            <div className="md:border-l md:border-[#1c1c1c] md:pl-6 flex flex-col justify-center">
              <div className="text-xs text-muted-foreground mb-1">Estimated Total</div>
              <div className="text-3xl font-bold text-foreground mb-2">{quote.total.toFixed(2)} AED</div>
              <button className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                Approve & Proceed <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
