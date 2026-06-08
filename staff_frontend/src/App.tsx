import { useState, useEffect } from 'react';
import { Package, MessageSquare, Plus, Edit2, Trash2, Save, X, Star } from 'lucide-react';

type Product = {
  id: string;
  category: string;
  name: string;
  price: number;
  imageUrl?: string;
  images?: string[];
  bestseller?: boolean;
  tag?: string;
  description?: string;
};

const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 600;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
        } else {
          if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.6)); // Aggressive compression for localStorage
      };
      img.onerror = err => reject(err);
    };
    reader.onerror = err => reject(err);
  });
};

type Feedback = {
  id: string;
  productId: string;
  productName: string;
  rating: number;
  comment: string;
  date: string;
};

const DEFAULT_PRODUCTS: Product[] = [
  { id: '1', category: 'jars', name: 'Set of 2 Mason Jars', price: 12.99, bestseller: true },
  { id: '2', category: 'jars', name: 'Large Mason Jar 1L', price: 8.99 },
  { id: '4', category: 'bottles', name: 'Clear Glass Bottle 1L', price: 9.99, bestseller: true },
  { id: '6', category: 'paper', name: '6-Pack Premium Toilet Roll', price: 5.99, bestseller: true },
  { id: '8', category: 'straws', name: 'Colorful Plastic Straws (100x)', price: 3.99 },
  { id: '10', category: 'umbrellas', name: 'Cocktail Umbrellas (50x)', price: 4.99, bestseller: true },
];

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [activeTab, setActiveTab] = useState<'products' | 'feedback'>('products');
  
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({});

  useEffect(() => {
    // Load from localStorage
    const savedProducts = localStorage.getItem('DP_PRODUCTS');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(DEFAULT_PRODUCTS);
      localStorage.setItem('DP_PRODUCTS', JSON.stringify(DEFAULT_PRODUCTS));
    }

    const savedFeedbacks = localStorage.getItem('DP_FEEDBACK');
    if (savedFeedbacks) {
      setFeedbacks(JSON.parse(savedFeedbacks));
    }
  }, []);

  const saveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem('DP_PRODUCTS', JSON.stringify(newProducts));
  };

  const handleAdd = () => {
    const newProduct: Product = {
      id: Date.now().toString(),
      category: 'jars',
      name: '',
      price: 0,
      description: '',
      bestseller: false,
    };
    setEditingId(newProduct.id);
    setFormData(newProduct);
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({ ...product });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      saveProducts(products.filter(p => p.id !== id));
    }
  };

  const handleSave = () => {
    if (!formData.name) return alert('Name is required');
    
    let newProducts;
    if (products.find(p => p.id === editingId)) {
      newProducts = products.map(p => p.id === editingId ? formData as Product : p);
    } else {
      newProducts = [...products, formData as Product];
    }
    
    saveProducts(newProducts);
    setEditingId(null);
    setFormData({});
  };

  return (
    <div className="flex h-screen w-full bg-background-gray">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm flex flex-col z-10 border-r border-gray-200">
        <div className="p-6 border-b border-gray-100 flex items-center justify-center">
          <div className="w-16 h-16 bg-gray-900 text-white font-black flex items-center justify-center text-xl rounded-lg">
            STAFF
          </div>
        </div>
        <div className="flex-1 py-4">
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-6 py-3 font-semibold transition-colors ${activeTab === 'products' ? 'text-blue-600 bg-blue-50 border-r-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Package size={20} /> Manage Products
          </button>
          <button 
            onClick={() => setActiveTab('feedback')}
            className={`w-full flex items-center gap-3 px-6 py-3 font-semibold transition-colors ${activeTab === 'feedback' ? 'text-blue-600 bg-blue-50 border-r-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <MessageSquare size={20} /> Customer Feedback
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {activeTab === 'products' ? (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Products ({products.length})</h1>
              <button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-sm">
                <Plus size={20} /> Add Product
              </button>
            </div>

            {editingId && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 mb-8">
                <h2 className="text-xl font-bold mb-4">{products.find(p => p.id === editingId) ? 'Edit Product' : 'New Product'}</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                    <input type="text" className="w-full border border-gray-300 rounded-md p-2" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                    <select className="w-full border border-gray-300 rounded-md p-2" value={formData.category || 'jars'} onChange={e => setFormData({...formData, category: e.target.value})}>
                      <option value="jars">Jars</option>
                      <option value="bottles">Bottles</option>
                      <option value="paper">Paper Rolls</option>
                      <option value="straws">Straws</option>
                      <option value="umbrellas">Umbrellas</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Price ($)</label>
                    <input type="number" step="0.01" className="w-full border border-gray-300 rounded-md p-2" value={formData.price || ''} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Photos (From Device)</label>
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*"
                      className="w-full border border-gray-300 rounded-md p-1.5 text-sm" 
                      onChange={async (e) => {
                        if (!e.target.files) return;
                        const files = Array.from(e.target.files);
                        const compressed = await Promise.all(files.map(compressImage));
                        setFormData(prev => ({ ...prev, images: [...(prev.images || []), ...compressed] }));
                      }} 
                    />
                    {formData.images && formData.images.length > 0 && (
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {formData.images.map((img, idx) => (
                          <div key={idx} className="relative w-16 h-16 rounded border border-gray-200 overflow-hidden">
                            <img src={img} className="w-full h-full object-cover" alt="upload" />
                            <button 
                              onClick={() => setFormData(prev => ({ ...prev, images: prev.images?.filter((_, i) => i !== idx) }))}
                              className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                    <textarea className="w-full border border-gray-300 rounded-md p-2" rows={3} value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                  </div>
                  <div className="col-span-2 flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={formData.bestseller || false} onChange={e => setFormData({...formData, bestseller: e.target.checked})} />
                      <span className="font-semibold text-gray-700">Mark as Top Pick (Bestseller)</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-700">Offer Banner:</span>
                      <input type="text" placeholder="e.g. 20% OFF" className="border border-gray-300 rounded-md p-1 px-2" value={formData.tag || ''} onChange={e => setFormData({...formData, tag: e.target.value})} />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button onClick={() => setEditingId(null)} className="px-4 py-2 font-bold text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2">
                    <X size={20} /> Cancel
                  </button>
                  <button onClick={handleSave} className="px-4 py-2 font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg flex items-center gap-2">
                    <Save size={20} /> Save Product
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <div key={product.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col relative">
                  {product.bestseller && <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-[10px] font-black px-2 py-1 rounded-bl-lg rounded-tr-xl">BESTSELLER</div>}
                  {product.tag && <div className="absolute top-0 left-0 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-br-lg rounded-tl-xl">{product.tag}</div>}
                  
                  <div className="flex justify-between items-start mb-2 mt-2">
                    <h3 className="font-bold text-lg text-gray-900 leading-tight">{product.name}</h3>
                    <span className="font-black text-blue-600">${product.price.toFixed(2)}</span>
                  </div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{product.category}</span>
                  {product.description && <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">{product.description}</p>}
                  
                  <div className="flex gap-2 mt-auto pt-4 border-t border-gray-100">
                    <button onClick={() => handleEdit(product)} className="flex-1 flex justify-center items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold text-sm transition-colors">
                      <Edit2 size={16} /> Edit
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="flex-1 flex justify-center items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg font-semibold text-sm transition-colors">
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Customer Feedback</h1>
            {feedbacks.length === 0 ? (
              <div className="text-center py-20 text-gray-400 font-semibold text-lg">No feedback received yet.</div>
            ) : (
              <div className="space-y-4">
                {feedbacks.slice().reverse().map(fb => (
                  <div key={fb.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{fb.productName}</h3>
                        <div className="flex items-center text-yellow-400 my-1">
                          {[1,2,3,4,5].map(star => (
                            <Star key={star} size={16} fill={star <= fb.rating ? "currentColor" : "none"} className={star <= fb.rating ? "text-yellow-400" : "text-gray-300"} />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs font-bold text-gray-400">{new Date(fb.date).toLocaleDateString()} {new Date(fb.date).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg italic border border-gray-100">"{fb.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
