import { useState } from 'react';
import { Star, MessageSquare, X, Send, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  images?: string[];
  bestseller?: boolean;
  tag?: string;
}

export function ProductCard({ id, name, price, imageUrl, images, bestseller, tag }: ProductCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [imageIndex, setImageIndex] = useState(0);

  const handleSubmit = () => {
    const feedback = {
      id: Date.now().toString(),
      productId: id,
      productName: name,
      rating,
      comment,
      date: new Date().toISOString()
    };
    
    const existing = JSON.parse(localStorage.getItem('DP_FEEDBACK') || '[]');
    localStorage.setItem('DP_FEEDBACK', JSON.stringify([...existing, feedback]));
    
    setShowModal(false);
    setComment('');
    alert('Thank you for your feedback!');
  };

  return (
    <>
    <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden flex flex-col relative group hover:shadow-[0_8px_20px_rgba(0,0,0,0.1)] transition-shadow">
      {bestseller && (
        <div className="absolute top-4 left-0 bg-[#c5b358] text-white text-[10px] font-bold px-3 py-1 uppercase tracking-wider z-10" style={{ clipPath: 'polygon(0 0, 100% 0, 90% 100%, 0 100%)' }}>
          Bestseller
        </div>
      )}
      
      {tag && !bestseller && (
        <div className="absolute top-4 right-4 bg-brand text-white text-xs font-bold px-2 py-1 rounded">
          {tag}
        </div>
      )}

      <div className="h-48 p-4 flex items-center justify-center bg-gray-50/50 relative group/carousel">
        {images && images.length > 0 ? (
          <>
            <img src={images[imageIndex]} alt={name} className="max-h-full max-w-full object-contain filter drop-shadow-sm group-hover:scale-105 transition-transform duration-300" />
            {images.length > 1 && (
              <>
                <button 
                  onClick={(e) => { e.stopPropagation(); setImageIndex((i) => (i === 0 ? images.length - 1 : i - 1)); }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full shadow opacity-0 group-hover/carousel:opacity-100 transition-opacity"
                >
                  <ChevronLeft size={16} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setImageIndex((i) => (i === images.length - 1 ? 0 : i + 1)); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full shadow opacity-0 group-hover/carousel:opacity-100 transition-opacity"
                >
                  <ChevronRight size={16} />
                </button>
                <div className="absolute bottom-2 flex gap-1">
                  {images.map((_, idx) => (
                    <div key={idx} className={`w-1.5 h-1.5 rounded-full ${idx === imageIndex ? 'bg-gray-800' : 'bg-gray-300'}`} />
                  ))}
                </div>
              </>
            )}
          </>
        ) : imageUrl ? (
          <img src={imageUrl} alt={name} className="max-h-full object-contain filter drop-shadow-sm group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
            <span className="text-xs">Image</span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-sm font-bold text-gray-800 leading-tight mb-2 line-clamp-2">{name}</h3>
        <div className="mt-auto flex items-end justify-between">
          <div className="text-lg font-black text-gray-900 tracking-tight">
            {price.toFixed(2)}<span className="text-xs align-top font-bold opacity-75">$</span>
          </div>
        </div>

        <button onClick={() => setShowModal(true)} className="w-full py-3 mt-4 flex items-center justify-center gap-2 text-sm font-bold text-gray-500 bg-gray-50 hover:bg-gray-100 transition-colors border-t border-gray-100">
          <MessageSquare size={16} /> Rate & Feedback
        </button>
      </div>
    </div>

    {/* Feedback Modal */}
    {showModal && (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <h3 className="text-xl font-black text-gray-900">Feedback: {name}</h3>
            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={24} /></button>
          </div>
          <div className="p-6">
            <div className="mb-6 flex flex-col items-center">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Rate this product</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} onClick={() => setRating(star)} className="focus:outline-none transition-transform hover:scale-110">
                    <Star size={40} fill={star <= rating ? "#facc15" : "none"} className={star <= rating ? "text-yellow-400" : "text-gray-200"} />
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">Your Comments</label>
              <textarea 
                rows={4} 
                className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-brand focus:ring-0 transition-colors resize-none"
                placeholder="What did you think about this product?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </div>
            <button onClick={handleSubmit} className="w-full bg-brand hover:bg-brand-hover text-white py-4 rounded-xl font-black text-lg tracking-wider flex items-center justify-center gap-2 transition-colors">
              <Send size={20} /> SUBMIT FEEDBACK
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
