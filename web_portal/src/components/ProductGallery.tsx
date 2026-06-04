import React from 'react';

const products = [
  { id: 1, title: 'Food Packaging', image: '/images/food.jpg', description: 'Safe, eco-friendly food containers.' },
  { id: 2, title: 'Box Packaging', image: '/images/box.jpg', description: 'Durable corrugated and custom boxes.' },
  { id: 3, title: 'Industrial Packaging', image: '/images/industrial.jpg', description: 'Heavy-duty industrial wrapping.' }
];

export default function ProductGallery() {
  return (
    <section className="w-full py-20 px-4 bg-charcoal">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-black text-foreground text-center mb-12 uppercase tracking-wide">
          Our Packaging Solutions
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div 
              key={product.id}
              className="group relative cursor-pointer block w-full rounded-lg overflow-hidden border-4 border-charcoal-light focus-within:border-primary transition-colors"
              tabIndex={0}
            >
              {/* Image Container with fast hover scale */}
              <div className="relative h-80 w-full overflow-hidden bg-charcoal-dark">
                {/* Fallback color/image for placeholder */}
                <div 
                  className="absolute inset-0 bg-charcoal-light bg-cover bg-center transition-transform duration-[150ms] ease-out group-hover:scale-105"
                  style={{ backgroundImage: `url(${product.image})` }}
                ></div>
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-[150ms]"></div>
              </div>
              
              {/* Content Box */}
              <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-charcoal-dark to-transparent">
                <h3 className="text-2xl font-bold text-foreground mb-2">{product.title}</h3>
                <p className="text-text-muted text-lg font-medium">{product.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
