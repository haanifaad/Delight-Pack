import { useState, useEffect } from 'react';
import { ShoppingBasket, ChevronUp, ChevronLeft } from 'lucide-react';
import { ProductCard } from './components/ProductCard';
import { JarIcon, BottleIcon, PaperRollIcon, StrawsIcon, UmbrellaIcon } from './components/ThreeIcons';

const CATEGORIES = [
  { id: 'jars', name: 'JARS', icon: JarIcon },
  { id: 'bottles', name: 'BOTTLES', icon: BottleIcon },
  { id: 'paper', name: 'PAPER ROLLS', icon: PaperRollIcon },
  { id: 'straws', name: 'STRAWS', icon: StrawsIcon },
  { id: 'umbrellas', name: 'UMBRELLAS', icon: UmbrellaIcon },
];

const DEFAULT_PRODUCTS = [
  { id: '1', category: 'jars', name: 'Set of 2 Mason Jars', price: 12.99, bestseller: true },
  { id: '2', category: 'jars', name: 'Large Mason Jar 1L', price: 8.99 },
  { id: '3', category: 'jars', name: 'Mini Spice Jars (6-pack)', price: 15.99 },
  
  { id: '4', category: 'bottles', name: 'Clear Glass Bottle 1L', price: 9.99, bestseller: true },
  { id: '5', category: 'bottles', name: 'Swing Top Bottle 500ml', price: 7.99 },
  
  { id: '6', category: 'paper', name: '6-Pack Premium Toilet Roll', price: 5.99, bestseller: true },
  { id: '7', category: 'paper', name: '12-Pack Family Toilet Roll', price: 10.99 },
  
  { id: '8', category: 'straws', name: 'Colorful Plastic Straws (100x)', price: 3.99 },
  { id: '9', category: 'straws', name: 'Reusable Silicone Straws', price: 6.99, bestseller: true },
  
  { id: '10', category: 'umbrellas', name: 'Cocktail Umbrellas (50x)', price: 4.99, bestseller: true },
  { id: '11', category: 'umbrellas', name: 'Neon Party Umbrellas', price: 5.99 },
];

export default function App() {
  const [activeCategory, setActiveCategory] = useState('jars');
  const [activeTab, setActiveTab] = useState('ALL');
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('DP_PRODUCTS');
    if (saved) {
      setProducts(JSON.parse(saved));
    } else {
      setProducts(DEFAULT_PRODUCTS);
      localStorage.setItem('DP_PRODUCTS', JSON.stringify(DEFAULT_PRODUCTS));
    }
  }, []);

  const baseProducts = products.filter(p => p.category === activeCategory);
  
  const displayedProducts = baseProducts.filter(p => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'NEW') return p.tag && p.tag.toUpperCase().includes('NEW');
    if (activeTab === 'SALE') return p.tag && (p.tag.toUpperCase().includes('SALE') || p.tag.toUpperCase().includes('OFF') || p.tag.includes('%'));
    if (activeTab === 'MORE') return !p.tag || (!p.tag.toUpperCase().includes('NEW') && !p.tag.toUpperCase().includes('SALE') && !p.tag.toUpperCase().includes('OFF') && !p.tag.includes('%'));
    return true;
  });

  const heroProduct = displayedProducts.find(p => p.bestseller) || displayedProducts[0];
  const regularProducts = displayedProducts.filter(p => p.id !== heroProduct?.id);

  const ActiveIcon = CATEGORIES.find(c => c.id === activeCategory)?.icon || JarIcon;

  return (
    <div className="flex h-screen w-full bg-background-gray text-gray-900 font-sans overflow-hidden select-none">
      
      {/* LEFT SIDEBAR - Categories */}
      <div className="w-[280px] bg-white flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20 relative">
        <div className="p-8 pb-4 flex flex-col items-center justify-center border-b border-gray-100 gap-4">
          <div className="w-24 h-24 bg-brand text-white font-black flex items-center justify-center text-2xl tracking-tighter rounded-xl">
            STORE
          </div>
          <a href="/webpages/dp/webpages/src/pages/CustomerPortalPage.tsx" className="text-xs text-brand font-bold text-center hover:underline opacity-80 hover:opacity-100 transition-opacity">
            Customer Portal<br/>Secure B2B Client Dashboard & Order Tracking
          </a>
        </div>

        <div className="flex-grow overflow-y-auto hide-scrollbar py-2">
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`w-full flex items-center gap-4 px-6 py-3 relative transition-colors ${isActive ? 'bg-red-50/50' : 'hover:bg-gray-50'}`}
              >
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-brand" />}
                
                <div className="w-16 h-16 flex-shrink-0">
                  <cat.icon />
                </div>
                
                <span className={`text-sm font-bold tracking-wide text-left uppercase leading-tight ${isActive ? 'text-brand' : 'text-gray-600'}`}>
                  {cat.name}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* RIGHT MAIN CONTENT */}
      <div className="flex-grow flex flex-col relative z-10">
        
        {/* Header Tabs */}
        <div className="pt-12 px-10 pb-6">
          <h1 className="text-[40px] font-black uppercase tracking-tighter mb-6 text-gray-900">
            {CATEGORIES.find(c => c.id === activeCategory)?.name || 'PRODUCTS'}
          </h1>
          
          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
            {['ALL', 'NEW', 'SALE', 'MORE'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all whitespace-nowrap
                  ${activeTab === tab 
                    ? 'border-2 border-brand text-brand shadow-sm' 
                    : 'border border-gray-200 text-gray-600 hover:border-gray-300 bg-white'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-grow overflow-y-auto px-10 pb-32">
          {displayedProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Highlighted Big Bestseller Card (Takes 2 cols) */}
              {heroProduct && (
                <div className="col-span-2 row-span-2 bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-yellow-200 overflow-hidden relative group cursor-pointer hover:shadow-[0_8px_20px_rgba(0,0,0,0.1)] transition-shadow">
                  <div className="absolute top-6 left-0 bg-[#c5b358] text-white text-xs font-bold px-4 py-1.5 uppercase tracking-wider z-10" style={{ clipPath: 'polygon(0 0, 100% 0, 90% 100%, 0 100%)' }}>
                    Top Pick
                  </div>
                  <div className="w-full h-3/4 bg-gradient-to-b from-yellow-50/50 to-white flex items-center justify-center p-8">
                    {/* Render the 3D icon of the active category as the giant placeholder image */}
                    <div className="w-64 h-64 pointer-events-none">
                       <ActiveIcon />
                    </div>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                    <h3 className="text-xl font-bold text-gray-800">{heroProduct.name}</h3>
                    <div className="bg-brand text-white px-3 py-1 font-black text-xl rounded">
                      {heroProduct.price.toFixed(2)}
                    </div>
                  </div>
                </div>
              )}

              {/* Standard Products */}
              {regularProducts.map(product => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400 font-bold">No products found in this category.</div>
          )}
        </div>

        {/* BOTTOM ORDER BAR */}
        <div className="absolute bottom-0 left-0 right-0 bg-white shadow-[0_-10px_30px_rgba(0,0,0,0.05)] p-4 px-6 flex items-center justify-between border-t border-gray-100 z-30">
          <button className="flex items-center gap-2 text-brand font-bold text-sm tracking-wide">
             <ChevronLeft className="w-4 h-4" /> RESTART
          </button>

          <div className="flex items-center gap-6">
            <button className="flex items-center gap-3 font-bold text-gray-800 tracking-wide">
              <div className="relative">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <ShoppingBasket className="w-5 h-5 text-gray-600" />
                </div>
                <div className="absolute -top-1 -right-1 bg-brand text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-white">
                  0
                </div>
              </div>
              SHOW BASKET <ChevronUp className="w-4 h-4" />
            </button>

            <button className="bg-[#8dc63f] hover:bg-[#7eb535] text-white px-10 py-4 rounded-lg font-black text-lg tracking-wider shadow-lg flex items-center gap-4 transition-colors">
              PLACE ORDER <span className="font-medium text-base">0.00</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
