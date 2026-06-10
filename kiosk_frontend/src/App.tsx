import { useState, useEffect } from 'react';
import { ShoppingBasket, ChevronUp, ChevronLeft } from 'lucide-react';
import { ProductCard } from './components/ProductCard';
import { JarIcon, StrawsIcon, UmbrellaIcon, PetJarIcon, WaterBottleIcon, JuiceBottleIcon, MilkBottleIcon, BoxIcon } from './components/ThreeIcons';

const CATEGORIES = [
  { id: 'glass_jars', name: 'GLASS JARS', icon: JarIcon },
  { id: 'pet_jars', name: 'PET BOTTLES & JARS', icon: PetJarIcon },
  { id: 'water_bottles', name: 'WATER BOTTLES', icon: WaterBottleIcon },
  { id: 'juice_bottles', name: 'JUICE BOTTLES', icon: JuiceBottleIcon },
  { id: 'milk_oil', name: 'MILK & OIL BOTTLES', icon: MilkBottleIcon },
  { id: 'packings', name: 'BOXES & PACKAGING', icon: BoxIcon },
  { id: 'cutlery', name: 'CUTLERY & STRAWS', icon: StrawsIcon },
  { id: 'custom', name: 'CUSTOM PACKINGS', icon: UmbrellaIcon }
];

const DEFAULT_PRODUCTS = [
  {
    "id": "50",
    "category": "pet_jars",
    "name": "PET ROUND JAR",
    "price": 1,
    "description": "DPPC250 - 120 ml\nDPPC287- 180 ml\nDPPC283 - 300 ml\nDPPC284 - 350 ml\nDPPC285- 400 ml\nDPPC286 - 500 ml\n",
    "tag": "NEW",
    "bestseller": true,
    "images": [
      "https://api.delightpackuae.com/uploads/img_69af9c81e43c06.11390959.png"
    ]
  },
  {
    "id": "49",
    "category": "pet_jars",
    "name": "PET CONSUMER JAR",
    "price": 1,
    "description": "DPPC314 - 100 ml\nDPPC317 - 250 ml\nDPPC320 - 500 ml\nDPPC321 - 750 ml\nDPPC322- 1000 ml\nDPPC324 - 2000 ",
    "tag": null,
    "bestseller": false,
    "images": [
      "https://api.delightpackuae.com/uploads/img_69af9ca8cf3c65.07850182.png"
    ]
  },
  {
    "id": "48",
    "category": "water_bottles",
    "name": "PET BOTTLE",
    "price": 1,
    "description": "DPPC310 - 200 ml\nDPPC065 - 250 ml\nDPPC066 - 330 ml\nDPPC067 - 500 ml\nDPPC068- 1000 ml\nDPPC069 - 1500 ",
    "tag": null,
    "bestseller": false,
    "images": [
      "https://api.delightpackuae.com/uploads/img_69af9cdb950646.07630382.png"
    ]
  },
  {
    "id": "47",
    "category": "water_bottles",
    "name": "ESSENTIAL- BOTTLE",
    "price": 1,
    "description": "DGB014 - 15 ml\nDGB015 - 25 ml\nDGB016 - 40 ml\nDGB017 - 50 ml\nDGB018 - 60 ml\nDGB019 - 10 ml\nDGB020 - 2",
    "tag": null,
    "bestseller": false,
    "images": [
      "https://api.delightpackuae.com/uploads/img_69af9cfc755126.01755144.png"
    ]
  },
  {
    "id": "46",
    "category": "water_bottles",
    "name": "ESSENTIAL BOTTLE",
    "price": 1,
    "description": "DGB009 - 15 ml\nDGB010 - 25 ml\nDGB011 - 35 ml\nDGB012 - 50 ml\nDGB013 - 90 ml",
    "tag": null,
    "bestseller": true,
    "images": [
      "https://api.delightpackuae.com/uploads/img_69af9d13d84fa4.24828084.png"
    ]
  },
  {
    "id": "45",
    "category": "milk_oil",
    "name": "OIL BOTTLE",
    "price": 1,
    "description": "DGB035 - 250ml\nDGB036 - 500 ml\nDGB037 - 1000 ml",
    "tag": "NEW",
    "bestseller": false,
    "images": [
      "https://api.delightpackuae.com/uploads/img_69af9d41064557.46414755.png"
    ]
  },
  {
    "id": "44",
    "category": "milk_oil",
    "name": "FLAT BOTTLE",
    "price": 1,
    "description": "DGB023 - 50ml\nDGB024 - 10O ml",
    "tag": null,
    "bestseller": false,
    "images": []
  },
  {
    "id": "43",
    "category": "juice_bottles",
    "name": "JUICE BOTTLE -OV",
    "price": 1,
    "description": "DGB030 - 1OO ml\nDGB031 - 280 ml\nDGB032 - 350 ml",
    "tag": null,
    "bestseller": false,
    "images": []
  },
  {
    "id": "42",
    "category": "juice_bottles",
    "name": "JUICE BOTTLE -NT",
    "price": 1,
    "description": "DGB027 - 300 ml\nDGB028 - 330 ml\nDGB029 - 500 ml",
    "tag": null,
    "bestseller": true,
    "images": []
  },
  {
    "id": "41",
    "category": "water_bottles",
    "name": "WATER BOTTLE",
    "price": 1,
    "description": "DGB033 - 300 ml\nDGB034 - 50O ml",
    "tag": null,
    "bestseller": false,
    "images": []
  },
  {
    "id": "40",
    "category": "water_bottles",
    "name": "WATER- BOTTLE",
    "price": 1,
    "description": "DGB007 - 250 ml\nDGB008 - 500 ml",
    "tag": "NEW",
    "bestseller": false,
    "images": []
  },
  {
    "id": "39",
    "category": "juice_bottles",
    "name": "JUICE BOTTLE",
    "price": 1,
    "description": "DGB001 - 80 ml\nDGB002 - 18O ml\nDGB003 - 300 ml",
    "tag": null,
    "bestseller": false,
    "images": []
  },
  {
    "id": "38",
    "category": "water_bottles",
    "name": "SWING BOTTLE",
    "price": 1,
    "description": "DGB025 - 500 ml\nDGB026 - 1000 ml\nDGB027 - 250 ml",
    "tag": null,
    "bestseller": true,
    "images": []
  },
  {
    "id": "37",
    "category": "milk_oil",
    "name": "MILK-BOTTLE",
    "price": 1,
    "description": "DGB004 - 200 ml\nDGB005 - 250 ml\nDGB006 - 300 ml",
    "tag": null,
    "bestseller": false,
    "images": []
  },
  {
    "id": "33",
    "category": "juice_bottles",
    "name": "ROUND JUICE BOTTLE",
    "price": 1,
    "description": "DGB022 - 300 ml\nDGB038 - 250 ml\nDGB039 - 500 ml",
    "tag": null,
    "bestseller": false,
    "images": []
  },
  {
    "id": "32",
    "category": "packings",
    "name": "Burger Boxes",
    "price": 1,
    "description": "Burger Boxes",
    "tag": "NEW",
    "bestseller": false,
    "images": [
      "https://api.delightpackuae.com/uploads/img_6995ac2ae3cd79.07319858.jpeg"
    ]
  },
  {
    "id": "31",
    "category": "milk_oil",
    "name": "Milk Bottle",
    "price": 1,
    "description": "Milk Bottle",
    "tag": null,
    "bestseller": true,
    "images": [
      "https://api.delightpackuae.com/uploads/img_698f27139f7fa8.06812566.jpeg"
    ]
  },
  {
    "id": "29",
    "category": "glass_jars",
    "name": "Hex Glass Jar",
    "price": 1,
    "description": "Hex Glass Jar",
    "tag": null,
    "bestseller": false,
    "images": [
      "https://api.delightpackuae.com/uploads/img_698dda641a6fd9.65559093.jpeg"
    ]
  },
  {
    "id": "28",
    "category": "pet_jars",
    "name": "Glass spice Jar",
    "price": 1,
    "description": "Glass spice Jar",
    "tag": null,
    "bestseller": false,
    "images": [
      "https://api.delightpackuae.com/uploads/img_698dd9f7b4fb48.54989859.jpeg"
    ]
  },
  {
    "id": "27",
    "category": "glass_jars",
    "name": "Hex GL Jar",
    "price": 1,
    "description": "Hexagonal Jar",
    "tag": null,
    "bestseller": false,
    "images": [
      "https://api.delightpackuae.com/uploads/img_698dd8d5c2b819.83875715.jpeg"
    ]
  },
  {
    "id": "25",
    "category": "glass_jars",
    "name": "Glass Jar",
    "price": 1,
    "description": "Glass Jar with Lid ",
    "tag": "NEW",
    "bestseller": true,
    "images": [
      "https://api.delightpackuae.com/uploads/img_698dd6dca99c90.16306415.jpeg"
    ]
  },
  {
    "id": "24",
    "category": "water_bottles",
    "name": "Glass swing bottles",
    "price": 1,
    "description": "Glass swing bottles",
    "tag": null,
    "bestseller": false,
    "images": [
      "https://api.delightpackuae.com/uploads/img_698dd665c51680.86436112.jpeg"
    ]
  },
  {
    "id": "23",
    "category": "pet_jars",
    "name": "DGJ003-ROUND JAR TWIST LID",
    "price": 10,
    "description": "DGJ003-ROUND JAR TWIST LID 100ml 160 /CTN HJ",
    "tag": null,
    "bestseller": false,
    "images": [
      "https://api.delightpackuae.com/uploads/img_698a03f5db54b1.02950324.png"
    ]
  },
  {
    "id": "22",
    "category": "pet_jars",
    "name": "DGJ002-ROUND JAR SRCEW LID",
    "price": 10,
    "description": "DGJ002-ROUND JAR SRCEW LID 250ml 105 /CTN HJ",
    "tag": null,
    "bestseller": false,
    "images": [
      "https://api.delightpackuae.com/uploads/img_698a02e888e0c5.92860424.png"
    ]
  },
  {
    "id": "21",
    "category": "pet_jars",
    "name": "DGJ001-ROUND JAR SCREW LID",
    "price": 10,
    "description": "DGJ001-ROUND JAR SCREW LID 200ml 96 /CTN HJ",
    "tag": null,
    "bestseller": true,
    "images": [
      "https://api.delightpackuae.com/uploads/img_698a018bdba492.38499953.png"
    ]
  },
  {
    "id": "17",
    "category": "water_bottles",
    "name": "Water Bottle (DGB008):",
    "price": 10,
    "description": "500ml capacity bottle with a screw lid.",
    "tag": "NEW",
    "bestseller": false,
    "images": [
      "https://api.delightpackuae.com/uploads/img_698a0008cf5a92.31747919.png"
    ]
  },
  {
    "id": "14",
    "category": "pet_jars",
    "name": "Round Jars",
    "price": 10,
    "description": "Available as general-purpose jars, pickle jars, jam jars, and chocolate jars.",
    "tag": null,
    "bestseller": false,
    "images": [
      "https://api.delightpackuae.com/uploads/img_6989fbfb569ce2.10921041.png"
    ]
  }
];

export default function App() {
  const [activeCategory, setActiveCategory] = useState('pet_jars');
  const [activeTab, setActiveTab] = useState('ALL');
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    // We append _V3 to the key to force-clear previous cache so new products show up.
    const savedProducts = localStorage.getItem('DP_PRODUCTS_V5');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(DEFAULT_PRODUCTS);
      localStorage.setItem('DP_PRODUCTS_V5', JSON.stringify(DEFAULT_PRODUCTS));
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
          <p className="text-xs text-brand font-bold text-center">
            Customer Portal<br/>Secure B2B Client Dashboard &amp; Order Tracking
          </p>
          <a href="../index.html" className="text-[11px] text-gray-500 hover:text-brand font-semibold transition-colors">
            ← Back to Gateway
          </a>
          <a href="../contact/index.html" className="text-[11px] text-gray-500 hover:text-brand font-semibold transition-colors">
            Contact &amp; Inquiries
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
                <div className="col-span-2 row-span-2 bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-yellow-200 overflow-hidden flex flex-col group cursor-pointer hover:shadow-[0_8px_20px_rgba(0,0,0,0.1)] transition-shadow relative">
                  <div className="absolute top-6 left-0 bg-[#c5b358] text-white text-xs font-bold px-4 py-1.5 uppercase tracking-wider z-10" style={{ clipPath: 'polygon(0 0, 100% 0, 90% 100%, 0 100%)' }}>
                    Top Pick
                  </div>
                  <div className="flex-1 w-full bg-gradient-to-b from-yellow-50/50 to-white flex items-center justify-center p-8 min-h-[300px]">
                    {heroProduct.images && heroProduct.images.length > 0 ? (
                      <img src={heroProduct.images[0]} alt={heroProduct.name} className="w-64 h-64 object-contain filter drop-shadow-md" />
                    ) : heroProduct.imageUrl ? (
                      <img src={heroProduct.imageUrl} alt={heroProduct.name} className="w-64 h-64 object-contain filter drop-shadow-md" />
                    ) : (
                      <div className="w-64 h-64 pointer-events-none">
                         <ActiveIcon />
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex justify-between items-end bg-white z-10 relative">
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
