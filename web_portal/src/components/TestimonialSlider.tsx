"use client";

import React, { useState, useEffect } from 'react';

const testimonials = [
  {
    id: 1,
    quote: "Delight Pack entirely transformed our supply chain. Their industrial packaging is top-notch.",
    author: "Sarah J., Logistics Director",
  },
  {
    id: 2,
    quote: "Fastest delivery and the best quality food packaging we've ever used. The KFC-style boxes are perfect.",
    author: "Mike T., Restaurant Owner",
  },
  {
    id: 3,
    quote: "Our premium products now look even better thanks to their custom box designs. Highly recommended!",
    author: "Elena R., Boutique CEO",
  }
];

export default function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex]); // reset timer on manual navigation

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-16 px-4">
      <div className="relative bg-charcoal-dark border-4 border-charcoal-light p-10 md:p-16 rounded-xl flex flex-col items-center justify-center min-h-[300px] shadow-2xl">
        
        {/* Navigation Arrows */}
        <button 
          onClick={goPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-primary hover:text-white transition-colors p-2"
          aria-label="Previous Testimonial"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        
        <button 
          onClick={goNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-primary hover:text-white transition-colors p-2"
          aria-label="Next Testimonial"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>

        {/* Quotes */}
        <div className="relative w-full overflow-hidden flex items-center justify-center">
          {testimonials.map((test, index) => (
            <div 
              key={test.id}
              className={`absolute top-0 left-0 w-full text-center transition-opacity duration-500 ease-in-out ${index === currentIndex ? 'opacity-100 relative z-10' : 'opacity-0 z-0'}`}
            >
              <p className="text-2xl md:text-3xl font-bold text-foreground mb-6 italic leading-relaxed">
                &quot;{test.quote}&quot;
              </p>
              <h4 className="text-primary text-xl font-black uppercase tracking-widest">
                — {test.author}
              </h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
