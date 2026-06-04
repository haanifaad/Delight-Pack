"use client";

import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video (Placeholder) */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/placeholder-packaging.mp4" type="video/mp4" />
      </video>

      {/* 60% Charcoal Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-[#121212] opacity-60 z-10"></div>

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-7xl font-black text-foreground mb-6 uppercase tracking-tight"
        >
          Premium Packaging <br className="hidden md:block" /> Delivered Fast
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl font-medium"
        >
          Industrial, Food, and Box packaging tailored for your business needs.
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9, transition: { type: "spring", stiffness: 400, damping: 10 } }}
          className="btn-retail shadow-xl shadow-primary/20"
        >
          Get Quote
        </motion.button>
      </div>
    </section>
  );
}
