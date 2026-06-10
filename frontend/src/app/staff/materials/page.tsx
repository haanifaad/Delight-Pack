'use client';

import React, { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';
import { Package, Plus, Minus, Search } from 'lucide-react';

type Material = {
  id: string;
  sku: string;
  name: string;
  stock_level: number;
  unit: string;
};

export default function MaterialsLoggerPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [jobId, setJobId] = useState<string>('');
  
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMaterials();
    // Auto-focus scanner input
    searchInputRef.current?.focus();
  }, []);

  const fetchMaterials = async () => {
    try {
      const { data } = await api.get('/staff/materials');
      setMaterials(data.materials);
    } catch (e) {
      console.error('Failed to fetch materials');
    }
  };

  const handleLogUsage = async () => {
    if (!selectedMaterial || !amount || isNaN(Number(amount))) return;
    
    try {
      await api.post('/staff/materials/usage', {
        material_id: selectedMaterial.id,
        job_id: jobId || '00000000-0000-0000-0000-000000000000', // fallback if empty
        amount_used: Number(amount)
      });
      
      // Reset
      setSelectedMaterial(null);
      setAmount('');
      setJobId('');
      setSearchTerm('');
      fetchMaterials(); // refresh stock
      searchInputRef.current?.focus();
    } catch (e) {
      console.error('Failed to log material');
    }
  };

  const filtered = materials.filter(m => 
    m.sku.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-6xl mx-auto h-screen flex flex-col">
      <div className="flex items-center space-x-4 mb-8">
        <Package className="w-8 h-8 text-blue-500" />
        <h1 className="text-3xl font-bold text-white">Material Check-out Logger</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1 min-h-0">
        
        {/* Left Side: Scanner & Selection */}
        <div className="flex flex-col bg-neutral-800 rounded-lg border border-neutral-700 p-6 overflow-hidden">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 w-5 h-5 text-neutral-400" />
            <input 
              ref={searchInputRef}
              type="text"
              placeholder="Scan Barcode or Search SKU..."
              className="w-full bg-neutral-900 border border-neutral-600 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {filtered.map(mat => (
              <div 
                key={mat.id}
                onClick={() => setSelectedMaterial(mat)}
                className={`p-4 rounded-lg cursor-pointer border transition-colors flex justify-between items-center ${
                  selectedMaterial?.id === mat.id 
                    ? 'bg-blue-500/20 border-blue-500' 
                    : 'bg-neutral-900 border-neutral-700 hover:border-neutral-500'
                }`}
              >
                <div>
                  <div className="font-mono text-sm text-blue-400">{mat.sku}</div>
                  <div className="font-bold text-white text-lg">{mat.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-neutral-200">{mat.stock_level}</div>
                  <div className="text-xs text-neutral-500">{mat.unit}s available</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Usage Action */}
        <div className="bg-neutral-800 rounded-lg border border-neutral-700 p-6 flex flex-col justify-center items-center text-center">
          {!selectedMaterial ? (
            <div className="text-neutral-500">
              <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Select a material or scan a barcode to log usage.</p>
            </div>
          ) : (
            <div className="w-full max-w-sm space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">{selectedMaterial.name}</h2>
                <p className="text-blue-400 font-mono">{selectedMaterial.sku}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Job ID (Optional)</label>
                <input 
                  type="text"
                  placeholder="Scan Job Ticket..."
                  className="w-full bg-neutral-900 border border-neutral-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-center text-xl font-mono"
                  value={jobId}
                  onChange={(e) => setJobId(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Amount Used ({selectedMaterial.unit})</label>
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => setAmount(prev => String(Math.max(0, Number(prev) - 1)))}
                    className="w-14 h-14 rounded-lg bg-neutral-700 hover:bg-neutral-600 flex items-center justify-center text-white"
                  >
                    <Minus className="w-6 h-6" />
                  </button>
                  <input 
                    type="number"
                    className="flex-1 bg-neutral-900 border border-neutral-600 rounded-lg py-3 text-center text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-3xl font-bold"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <button 
                    onClick={() => setAmount(prev => String(Number(prev) + 1))}
                    className="w-14 h-14 rounded-lg bg-neutral-700 hover:bg-neutral-600 flex items-center justify-center text-white"
                  >
                    <Plus className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <button 
                onClick={handleLogUsage}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xl rounded-lg shadow-lg transition-colors"
              >
                Log Usage & Deduct Stock
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
