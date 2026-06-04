"use client";

import React, { useState } from 'react';
import { Truck, Package, Globe, Plus, Search } from 'lucide-react';

// B2B Wholesale Product Inventory Mock
const PRODUCTS = [
  {
    id: 'dp-1',
    name: 'Industrial Cardboard Boxes (Double Wall)',
    description: 'Heavy-duty double fluted cartons. 250 GSM. MOQ: 500 pcs.',
    originalPrice: 4200,
    discountedPrice: 2100,
    discountTag: '50% OFF',
    image: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=500&auto=format&fit=crop',
    category: 'Industrial Cardboard Boxes 📦'
  },
  {
    id: 'dp-2',
    name: 'Custom Food-Grade Burger Boxes',
    description: '10,000pcs Custom Printed Burger Boxes. High-Gloss Eco Coating. Food safe certified.',
    originalPrice: 1520,
    discountedPrice: 1064,
    discountTag: '30% OFF',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=500&auto=format&fit=crop',
    category: 'Custom Food-Grade Boxes 🍔'
  },
  {
    id: 'dp-3',
    name: 'High-Volume Printed Rolls',
    description: 'BOPP Laminated flexo printed rolls for automated packaging lines. MOQ: 10 Rolls.',
    originalPrice: 3200,
    discountedPrice: 2880,
    discountTag: '10% OFF',
    image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?q=80&w=500&auto=format&fit=crop',
    category: 'High-Volume Printed Rolls 🎨'
  }
];

const CATEGORIES = [
  'Exclusive Bulk Deals 🔥',
  'Custom Food-Grade Boxes 🍔',
  'Industrial Cardboard Boxes 📦',
  'High-Volume Printed Rolls 🎨',
  'Protective Wraps & Sleeves 🌯'
];

export default function DelightPackB2BPortal() {
  const [serviceMode, setServiceMode] = useState('delivery'); // delivery, pickup, export
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [cartCount, setCartCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const handleAddToCart = (price: number) => {
    setCartCount(prev => prev + 1);
    setTotalPrice(prev => prev + price);
  };

  // Filter products or just show them all for the demo
  const displayProducts = activeCategory === CATEGORIES[0] 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#0F111A] text-foreground font-sans antialiased selection:bg-[#DC2626] selection:text-white pb-32">
      
      {/* HEADER WITH LOGO & STATUS BAR */}
      <header className="sticky top-0 z-50 bg-[#000000]/90 backdrop-blur-md border-b border-zinc-800/80 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Delight Pack Premium Logo */}
          <div className="w-10 h-10 bg-[#1e293b] rounded-xl flex items-center justify-center p-1 shadow-inner border border-zinc-700">
            <span className="text-xl font-black text-[#2563EB] leading-none tracking-tighter">D</span>
            <span className="text-xl font-black text-[#DC2626] leading-none tracking-tighter">P</span>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-foreground uppercase m-0 leading-tight" style={{ fontFamily: 'Impact, sans-serif' }}>Delight Pack</h1>
            <span className="text-[10px] text-zinc-400 font-bold tracking-widest uppercase">B2B Wholesale</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Search className="w-6 h-6 text-zinc-400 cursor-pointer hover:text-white transition-colors" />
        </div>
      </header>

      <main className="px-4 max-w-md mx-auto sm:max-w-xl md:max-w-2xl lg:max-w-4xl">
        
        {/* 1. DYNAMIC LOGISTICS SERVICE SELECTOR */}
        <section className="my-5 bg-background p-1.5 rounded-2xl border border-zinc-800 flex justify-between gap-1 shadow-xl">
          <button 
            onClick={() => setServiceMode('delivery')}
            className={`flex-1 py-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-300 ${serviceMode === 'delivery' ? 'bg-[#DC2626] text-foreground shadow-lg shadow-red-600/30' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Truck className="w-5 h-5" />
            <span className="text-xs uppercase tracking-wider font-bold">Local Fleet</span>
          </button>
          
          <button 
            onClick={() => setServiceMode('pickup')}
            className={`flex-1 py-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-300 ${serviceMode === 'pickup' ? 'bg-[#DC2626] text-foreground shadow-lg shadow-red-600/30' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Package className="w-5 h-5" />
            <span className="text-xs uppercase tracking-wider font-bold">Factory Pickup</span>
          </button>

          <button 
            onClick={() => setServiceMode('export')}
            className={`flex-1 py-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-300 ${serviceMode === 'export' ? 'bg-[#DC2626] text-foreground shadow-lg shadow-red-600/30' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Globe className="w-5 h-5" />
            <span className="text-xs uppercase tracking-wider font-bold">GCC Export</span>
          </button>
        </section>

        {/* PROMO BANNER SECTION */}
        <section className="w-full h-48 rounded-2xl overflow-hidden mb-6 relative border border-zinc-800 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
          <div className="absolute top-4 left-4 z-20 bg-[#DC2626] text-foreground font-black text-xs px-3 py-1 rounded shadow-lg uppercase tracking-widest animate-bounce">
            Bulk Manufacturer Deals
          </div>
          <div className="absolute bottom-4 left-4 z-20">
            <h2 className="text-3xl font-black tracking-tighter uppercase leading-none text-foreground drop-shadow-lg" style={{ fontFamily: 'Impact, sans-serif' }}>MEGA CARDBOARD PALLET</h2>
            <p className="text-sm font-bold text-zinc-300 mt-1 uppercase tracking-wide">Factory Direct Pricing</p>
          </div>
          <img 
            src="https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=800&auto=format&fit=crop" 
            className="w-full h-full object-cover" 
            alt="Promo Backdrop" 
          />
        </section>

        {/* 2. HORIZONTAL PACKAGING CATEGORY CAPSULE ROW */}
        <section className="mb-8">
          <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-3 ml-1">Manufacturing Lines</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x">
            {CATEGORIES.map((cat) => {
              const isSelected = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`snap-start whitespace-nowrap px-4 py-2.5 rounded-full flex items-center transition-all border-2 ${isSelected ? 'bg-zinc-900 border-[#DC2626] text-foreground shadow-[0_0_15px_rgba(220,38,38,0.4)]' : 'bg-[#000000] border-zinc-800 text-zinc-400 hover:border-zinc-600'}`}
                >
                  <span className={`text-sm tracking-tight ${isSelected ? 'font-black' : 'font-bold'}`}>{cat}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 3. HIGH-CONTRAST B2B PRODUCT MATRIX CARDS */}
        <section className="flex flex-col gap-5">
          {displayProducts.length === 0 && (
            <div className="text-center py-10 text-zinc-500 font-bold uppercase">No products in this category.</div>
          )}
          {displayProducts.map((product) => (
            <div key={product.id} className="bg-[#000000] rounded-2xl p-4 border border-zinc-800 flex gap-4 items-center relative hover:border-zinc-600 transition-all shadow-xl group">
              <div className="flex-1 flex flex-col justify-between h-full">
                <div>
                  <h4 className="text-lg font-black text-foreground tracking-tighter leading-none uppercase">{product.name}</h4>
                  <p className="text-xs text-zinc-400 font-medium mt-2 leading-snug pr-2">{product.description}</p>
                </div>
                
                {/* Heavy Bold Pricing Structure */}
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="text-sm text-zinc-600 line-through font-black leading-none tracking-tight">AED {product.originalPrice}</span>
                    <span className="text-3xl font-black text-foreground tracking-tighter leading-none mt-1" style={{ fontFamily: 'Impact, sans-serif' }}>AED {product.discountedPrice}</span>
                  </div>
                  <span className="bg-[#DC2626]/10 border border-[#DC2626]/30 text-[#DC2626] font-black text-xs px-2 py-0.5 rounded uppercase tracking-wider">
                    {product.discountTag}
                  </span>
                </div>
              </div>

              {/* Product Layout Image on Right */}
              <div className="w-32 h-32 rounded-xl overflow-hidden bg-zinc-900 relative border border-zinc-800 flex-shrink-0 group-hover:border-zinc-500 transition-all">
                <img src={product.image} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" alt={product.name} />
                
                {/* Rectangular Action Add Trigger */}
                <button 
                  onClick={() => handleAddToCart(product.discountedPrice)}
                  className="absolute bottom-0 right-0 bg-[#DC2626] hover:bg-red-700 text-foreground font-black text-xs px-4 py-2 rounded-tl-xl flex items-center gap-1 transition-colors shadow-lg"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>BATCH</span>
                </button>
              </div>
            </div>
          ))}
        </section>

      </main>

      {/* 4. PERSISTENT STICKY ACTION BAR (Red Bulk Quote Drawer) */}
      <footer className="fixed bottom-0 inset-x-0 bg-[#0F111A] border-t border-zinc-800 px-4 py-4 z-50">
        <button className="w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto bg-[#DC2626] hover:bg-red-700 active:scale-[0.98] transition-all duration-200 py-4 px-6 rounded-2xl flex items-center justify-between shadow-[0_-5px_20px_rgba(220,38,38,0.2)]">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-white text-[#DC2626] font-black text-sm flex items-center justify-center shadow-lg">
              {cartCount}
            </div>
            <span className="text-base sm:text-lg font-black uppercase tracking-widest text-foreground mt-1">View Active Bulk Quote</span>
          </div>
          <div className="flex flex-col items-end">
             <span className="text-2xl sm:text-3xl font-black tracking-tighter text-foreground leading-none" style={{ fontFamily: 'Impact, sans-serif' }}>AED {totalPrice}</span>
             <span className="text-[10px] text-white/70 font-bold uppercase tracking-widest leading-none mt-1">Total Est. Excl. VAT</span>
          </div>
        </button>
      </footer>

    </div>
  );
}
