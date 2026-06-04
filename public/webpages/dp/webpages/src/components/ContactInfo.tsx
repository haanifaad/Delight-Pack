import React from 'react';
import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

export function ContactInfo() {
  return (
    <div className="flex flex-col h-full gap-8">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
          Let's talk about your packaging.
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          From custom die-cuts to eco-friendly solutions, our Dubai-based experts are ready to elevate your brand.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-start gap-4">
          <div className="mt-1 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center shrink-0">
            <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white">Headquarters</h4>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Building 4, Dubai Industrial City<br />
              P.O. Box 12345, Dubai, UAE
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="mt-1 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center shrink-0">
            <Phone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white">Phone</h4>
            <p className="text-slate-600 dark:text-slate-400 mt-1">+971 4 123 4567</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="mt-1 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center shrink-0">
            <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white">Email</h4>
            <p className="text-slate-600 dark:text-slate-400 mt-1">sales@dubaipackaging.com</p>
          </div>
        </div>
      </div>

      <a
        href="https://wa.me/971501234567?text=Hi,%20I%20would%20like%20to%20discuss%20packaging%20options."
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center gap-3 w-full sm:w-auto bg-[#25D366] hover:bg-[#20BE5A] text-white px-8 py-4 rounded-2xl font-semibold transition-all overflow-hidden"
      >
        <span className="absolute inset-0 w-full h-full bg-white/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out" />
        <MessageCircle className="w-5 h-5 relative z-10" />
        <span className="relative z-10">Chat on WhatsApp</span>
      </a>

      {/* Stylized Maps Placeholder */}
      <div className="mt-auto pt-8">
        <div className="relative w-full h-48 rounded-3xl overflow-hidden bg-slate-200 dark:bg-slate-800 isolate ring-1 ring-black/5 dark:ring-white/10">
          {/* Abstract map pattern */}
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
               style={{ 
                 backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', 
                 backgroundSize: '24px 24px' 
               }} 
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-transparent" />
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <motion.div 
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ delay: 0.2, type: "spring", bounce: 0.6 }}
               className="relative"
            >
              <div className="absolute -inset-4 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
              <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl shadow-xl flex items-center justify-center relative z-10">
                <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </motion.div>
          </div>
          
          <div className="absolute bottom-4 left-4 right-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 dark:border-slate-700/50 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-900 dark:text-white">Dubai Industrial City</span>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/50 rounded-md">HQ</span>
          </div>
        </div>
      </div>
    </div>
  );
}
