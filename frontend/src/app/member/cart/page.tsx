'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useGridHotkeys } from '@/hooks/useGridHotkeys';
import { ShoppingCart, Trash2, Zap, Send, Copy, Plus } from 'lucide-react';

type CartItem = {
  id: string;
  sku: string;
  description: string;
  quantity: number;
  unit_price: number;
  discount_pct: number;
};

const PRODUCT_CATALOG = [
  { sku: 'BOX-CRG-S', description: 'Corrugated Box – Small', unit_price: 2.5 },
  { sku: 'BOX-CRG-M', description: 'Corrugated Box – Medium', unit_price: 4.0 },
  { sku: 'BOX-CRG-L', description: 'Corrugated Box – Large', unit_price: 6.5 },
  { sku: 'BAG-PAP-S', description: 'Paper Bag – Small', unit_price: 1.2 },
  { sku: 'BAG-PAP-L', description: 'Paper Bag – Large', unit_price: 2.0 },
  { sku: 'BOX-FOOD', description: 'Food-Grade Box 300GSM', unit_price: 3.8 },
  { sku: 'LBL-STICK', description: 'Sticker Label Roll (1000pcs)', unit_price: 45.0 },
  { sku: 'TISSUE-BRD', description: 'Branded Tissue Paper (500 sheets)', unit_price: 12.0 },
  { sku: 'WRAP-SHRK', description: 'Shrink Wrap Roll 50m', unit_price: 18.0 },
  { sku: 'BOX-COSM', description: 'Cosmetic Display Box', unit_price: 8.5 },
];

let nextId = 1;

export default function QuoteCartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isRush, setIsRush] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const addItemFromCatalog = (product: typeof PRODUCT_CATALOG[0]) => {
    // Check if already in cart
    const existing = items.find(i => i.sku === product.sku);
    if (existing) {
      setItems(prev => prev.map(i => i.sku === product.sku ? { ...i, quantity: i.quantity + 100 } : i));
    } else {
      setItems(prev => [...prev, {
        id: String(nextId++),
        sku: product.sku,
        description: product.description,
        quantity: 100,
        unit_price: product.unit_price,
        discount_pct: 0,
      }]);
    }
    setCatalogOpen(false);
    setSearchTerm('');
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const updateItem = (id: string, field: keyof CartItem, value: number) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  // Calculations
  const subtotal = items.reduce((sum, i) => sum + (i.quantity * i.unit_price), 0);
  const discountTotal = items.reduce((sum, i) => sum + (i.quantity * i.unit_price * i.discount_pct / 100), 0);
  const rushSurcharge = isRush ? (subtotal - discountTotal) * 0.2 : 0;
  const grandTotal = subtotal - discountTotal + rushSurcharge;
  const baseCost = subtotal * 0.3; // Assume 30% COGS
  const marginPct = grandTotal > 0 ? ((grandTotal - baseCost) / grandTotal) * 100 : 0;

  const getMarginColor = () => {
    if (marginPct >= 40) return 'text-green-400 bg-green-500/10 border-green-500/30';
    if (marginPct >= 20) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
    return 'text-red-400 bg-red-500/10 border-red-500/30';
  };

  const getMarginLabel = () => {
    if (marginPct >= 40) return 'HEALTHY';
    if (marginPct >= 20) return 'THIN';
    return 'BELOW FLOOR';
  };

  // Volume discount suggestion
  const getVolumeHint = (qty: number): string | null => {
    if (qty >= 1000) return null;
    if (qty >= 500) return `Add ${1000 - qty} more → save 10%`;
    if (qty >= 200) return `Add ${500 - qty} more → save 5%`;
    return null;
  };

  // Hotkeys
  useGridHotkeys([
    { key: 'a', altKey: true, action: () => setCatalogOpen(true) },
  ]);

  const filteredCatalog = PRODUCT_CATALOG.filter(p =>
    p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-neutral-900">
      {/* Main Area: Product catalog / info */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Quick Quote Builder</h1>
            <p className="text-neutral-400 mt-1">Fast-Food style B2B ordering. Press <kbd className="font-mono bg-neutral-700 px-1.5 py-0.5 rounded text-amber-400 text-xs">Alt + A</kbd> to add items.</p>
          </div>
        </div>

        {/* Items Table */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-neutral-700 rounded-xl">
            <ShoppingCart className="w-16 h-16 text-neutral-600 mb-4" />
            <p className="text-neutral-500 text-lg">Your cart is empty</p>
            <p className="text-neutral-600 text-sm mt-1">Press <kbd className="font-mono bg-neutral-700 px-1.5 py-0.5 rounded text-amber-400 text-xs">Alt + A</kbd> or click below to add products</p>
            <button onClick={() => setCatalogOpen(true)} className="mt-4 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-black font-medium rounded-lg transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add First Item
            </button>
          </div>
        ) : (
          <div className="bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-neutral-800 text-neutral-400 text-xs uppercase border-b border-neutral-700">
                <tr>
                  <th className="p-3 text-left">SKU</th>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-right w-28">Qty</th>
                  <th className="p-3 text-right w-28">Unit (AED)</th>
                  <th className="p-3 text-right w-28">Disc %</th>
                  <th className="p-3 text-right w-32">Line Total</th>
                  <th className="p-3 w-12"></th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => {
                  const lineTotal = item.quantity * item.unit_price * (1 - item.discount_pct / 100);
                  const hint = getVolumeHint(item.quantity);
                  return (
                    <tr key={item.id} className="border-b border-neutral-700/50 hover:bg-neutral-700/30">
                      <td className="p-3 font-mono text-sm text-amber-400">{item.sku}</td>
                      <td className="p-3 text-white">
                        {item.description}
                        {hint && <div className="text-xs text-blue-400 mt-1">💡 {hint}</div>}
                      </td>
                      <td className="p-3 text-right">
                        <input type="number" value={item.quantity} min={1}
                          onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                          className="w-24 bg-neutral-900 border border-neutral-600 rounded px-2 py-1 text-right text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </td>
                      <td className="p-3 text-right">
                        <input type="number" value={item.unit_price} step={0.1}
                          onChange={(e) => updateItem(item.id, 'unit_price', Number(e.target.value))}
                          className="w-24 bg-neutral-900 border border-neutral-600 rounded px-2 py-1 text-right text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </td>
                      <td className="p-3 text-right">
                        <input type="number" value={item.discount_pct} min={0} max={100}
                          onChange={(e) => updateItem(item.id, 'discount_pct', Number(e.target.value))}
                          className="w-20 bg-neutral-900 border border-neutral-600 rounded px-2 py-1 text-right text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </td>
                      <td className="p-3 text-right font-bold text-white">AED {lineTotal.toFixed(2)}</td>
                      <td className="p-3 text-center">
                        <button onClick={() => removeItem(item.id)} className="text-neutral-500 hover:text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="p-3 border-t border-neutral-700">
              <button onClick={() => setCatalogOpen(true)} className="text-sm text-amber-400 hover:text-amber-300 flex items-center gap-1">
                <Plus className="w-4 h-4" /> Add another item
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Side: Persistent Basket Summary */}
      <div className="w-96 bg-neutral-800 border-l border-neutral-700 p-6 flex flex-col">
        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-amber-500" /> Quote Summary
        </h2>

        {/* Margin Indicator */}
        <div className={`rounded-lg border p-4 mb-6 ${getMarginColor()}`}>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Margin</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-black/20">{getMarginLabel()}</span>
          </div>
          <p className="text-3xl font-bold mt-1">{marginPct.toFixed(1)}%</p>
        </div>

        {/* Totals */}
        <div className="space-y-3 mb-6 flex-1">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-400">Subtotal</span>
            <span className="text-white font-mono">AED {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-400">Discounts</span>
            <span className="text-red-400 font-mono">- AED {discountTotal.toFixed(2)}</span>
          </div>

          {/* Rush Toggle */}
          <div className="flex justify-between items-center text-sm pt-2 border-t border-neutral-700">
            <button
              onClick={() => setIsRush(!isRush)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                isRush ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-neutral-700 text-neutral-400 border border-neutral-600'
              }`}
            >
              <Zap className="w-3.5 h-3.5" /> Rush +20%
            </button>
            {isRush && <span className="text-red-400 font-mono">+ AED {rushSurcharge.toFixed(2)}</span>}
          </div>

          <div className="flex justify-between text-lg font-bold pt-3 border-t border-neutral-700">
            <span className="text-white">Grand Total</span>
            <span className="text-amber-400 font-mono">AED {grandTotal.toFixed(2)}</span>
          </div>
          <p className="text-xs text-neutral-500">{items.length} line item(s) · {items.reduce((s, i) => s + i.quantity, 0)} units total</p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-black font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
            <Send className="w-4 h-4" /> Send Quote to Client
          </button>
          <div className="flex gap-3">
            <button className="flex-1 py-2.5 bg-neutral-700 hover:bg-neutral-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5">
              <Copy className="w-3.5 h-3.5" /> Duplicate Last
            </button>
            <button className="flex-1 py-2.5 bg-neutral-700 hover:bg-neutral-600 text-white text-sm font-medium rounded-lg transition-colors">
              Save Draft
            </button>
          </div>
        </div>
      </div>

      {/* Catalog Modal */}
      {catalogOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setCatalogOpen(false)}>
          <div className="bg-neutral-800 border border-neutral-700 rounded-xl w-[500px] max-h-[600px] shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-neutral-700">
              <h3 className="text-lg font-bold text-white mb-3">Add Product to Cart</h3>
              <input
                type="text"
                autoFocus
                placeholder="Search SKU or product name..."
                className="w-full bg-neutral-900 border border-neutral-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="overflow-y-auto max-h-[400px] p-2">
              {filteredCatalog.map(p => (
                <button
                  key={p.sku}
                  onClick={() => addItemFromCatalog(p)}
                  className="w-full text-left p-3 rounded-lg hover:bg-neutral-700 transition-colors flex justify-between items-center"
                >
                  <div>
                    <span className="font-mono text-sm text-amber-400">{p.sku}</span>
                    <p className="text-white text-sm">{p.description}</p>
                  </div>
                  <span className="text-neutral-400 font-mono text-sm">AED {p.unit_price.toFixed(2)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
