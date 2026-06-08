import React from 'react';
import { Package } from 'lucide-react';
import { LeadForm } from './components/LeadForm';
import { ContactInfo } from './components/ContactInfo';

export default function App() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground transition-colors duration-300 selection:bg-[#2563EB]/30 selection:text-white">
      {/* Navigation Bar */}
      <header className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <a href="../index.html" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#2563EB] rounded-md flex items-center justify-center text-white font-bold text-xl group-hover:bg-[#3B82F6] transition-colors">
              D
            </div>
            <span className="font-semibold text-xl tracking-tight text-foreground group-hover:text-blue-400 transition-colors">Delight Pack</span>
          </a>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="../index.html" className="hover:text-blue-600 transition-colors">Products</a>
          <a href="../index.html" className="hover:text-blue-600 transition-colors">About Us</a>
          <a href="#/careers" className="hover:text-blue-600 transition-colors">Careers</a>
          <a href="#/contact" className="text-blue-600">Contact</a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pt-12 pb-24 md:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <ContactInfo />
          <div className="lg:mt-0 mt-8">
            <LeadForm />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card glass-card backdrop-blur-2xl py-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Delight Pack LLC. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
