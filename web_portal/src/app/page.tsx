'use client';

import React from 'react';
import Link from 'next/link';
import { Package2, Globe, Shield, ArrowUpRight, Box, Users, MapPin, Activity, MessageSquare } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans antialiased selection:bg-white selection:text-black">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Package2 className="w-6 h-6 text-foreground group-hover:text-slate-300 transition-colors" />
            <span className="font-semibold text-lg tracking-tighter text-foreground">Delight Pack</span>
          </Link>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors">
              <Globe className="w-4 h-4" />
              <span>EN</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex flex-col pt-24 px-6 md:px-12 max-w-7xl mx-auto w-full gap-16 pb-24">
        
        {/* Hero */}
        <section className="flex flex-col gap-6 pt-12">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-foreground leading-tight">
            Let&apos;s package something<br className="hidden md:block"/> exceptional.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl font-light">
            The central gateway to the Delight Pack enterprise ecosystem. Secure your supply chain, monitor real-time logistics, and craft bespoke industrial packaging solutions.
          </p>
        </section>

        {/* Gateway Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#1c1c1c]/50 border border-border rounded-xl overflow-hidden">
          
          {/* Card 1 */}
          <Link href="/login" className="group relative bg-card p-8 flex flex-col gap-4 hover:bg-[#111111] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105"></div>
            <div className="flex justify-between items-start z-10">
              <div className="p-3 bg-[#1c1c1c]/40 rounded-lg group-hover:bg-[#1c1c1c]/80 transition-colors duration-500">
                <Shield className="w-6 h-6 text-foreground" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-white transition-colors duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </div>
            <div className="z-10 mt-4">
              <h3 className="text-xl font-medium text-foreground mb-2">Customer Portal</h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">Secure B2B Client Dashboard & Order Tracking</p>
            </div>
          </Link>

          {/* Card 2 (Products/Brochure) */}
          <Link href="/products" className="group relative bg-card p-8 flex flex-col gap-4 hover:bg-[#111111] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105"></div>
            <div className="flex justify-between items-start z-10">
              <div className="p-3 bg-[#1c1c1c]/40 rounded-lg group-hover:bg-[#1c1c1c]/80 transition-colors duration-500">
                <Box className="w-6 h-6 text-foreground" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-white transition-colors duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </div>
            <div className="z-10 mt-4">
              <h3 className="text-xl font-medium text-foreground mb-2">Company Brochure & Products</h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">Luxury Custom Printing & Industrial Packaging Showcase</p>
            </div>
          </Link>

          {/* Card 3 */}
          <Link href="/careers" className="group relative bg-card p-8 flex flex-col gap-4 hover:bg-[#111111] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105"></div>
            <div className="flex justify-between items-start z-10">
              <div className="p-3 bg-[#1c1c1c]/40 rounded-lg group-hover:bg-[#1c1c1c]/80 transition-colors duration-500">
                <Users className="w-6 h-6 text-foreground" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-white transition-colors duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </div>
            <div className="z-10 mt-4">
              <h3 className="text-xl font-medium text-foreground mb-2">Careers Hub</h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">Join the Team. Explore Factory Floor, Logistics, & Internships</p>
            </div>
          </Link>

          {/* Card 4 */}
          <a href="https://wa.me/971559610972" target="_blank" rel="noopener noreferrer" className="group relative bg-card p-8 flex flex-col gap-4 hover:bg-[#111111] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105"></div>
            <div className="flex justify-between items-start z-10">
              <div className="p-3 bg-[#1c1c1c]/40 rounded-lg group-hover:bg-[#1c1c1c]/80 transition-colors duration-500">
                <MapPin className="w-6 h-6 text-foreground" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-white transition-colors duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </div>
            <div className="z-10 mt-4">
              <h3 className="text-xl font-medium text-foreground mb-2">Contact & Inquiries</h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">Direct Dubai Workspace Location & WhatsApp Integration</p>
            </div>
          </a>

        </section>

        {/* Mobile App Promo */}
        <section className="mt-8 border border-border rounded-2xl p-8 md:p-12 bg-gradient-to-b from-[#0a0a0a] to-[#050505] relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-white/5 blur-[120px] rounded-full pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1 flex flex-col gap-8">
              <div>
                <h2 className="text-3xl font-semibold tracking-tighter text-foreground mb-4">The Ecosystem Hub</h2>
                <p className="text-muted-foreground font-light max-w-md">Delight Pack Mobile Apps are designed for speed and uncompromising precision.</p>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex items-start gap-4 group">
                  <div className="mt-1">
                    <Activity className="w-5 h-5 text-foreground group-hover:text-emerald-400 transition-colors" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground text-sm">Admin Mobile App</h4>
                    <p className="text-xs text-muted-foreground mt-1">Live factory analytics, inventory alerts, and instant order approvals for management.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 group">
                  <div className="mt-1">
                    <MessageSquare className="w-5 h-5 text-foreground group-hover:text-blue-400 transition-colors" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground text-sm">Customer Mobile App</h4>
                    <p className="text-xs text-muted-foreground mt-1">Seamless on-the-go order placement, instant support chat, and real-time delivery tracking.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <button className="flex items-center justify-center gap-3 px-5 py-2.5 border border-border hover:border-slate-500 rounded-lg transition-colors bg-black/50 backdrop-blur-sm text-foreground">
                  <span className="text-xs font-medium text-left">Download on the<br/><span className="text-sm font-semibold">App Store</span></span>
                </button>
                <button className="flex items-center justify-center gap-3 px-5 py-2.5 border border-border hover:border-slate-500 rounded-lg transition-colors bg-black/50 backdrop-blur-sm text-foreground">
                  <span className="text-xs font-medium text-left">Get it on<br/><span className="text-sm font-semibold">Google Play</span></span>
                </button>
              </div>
            </div>

            <div className="flex-1 w-full max-w-sm">
              <div className="border border-border bg-card rounded-[2.5rem] p-6 shadow-2xl relative aspect-[1/1.5] flex flex-col">
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-muted rounded-full"></div>
                <div className="mt-6 flex flex-col gap-4 flex-grow">
                  <div className="flex justify-between items-center pb-4 border-b border-border">
                    <div>
                      <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Live Status</div>
                      <div className="text-sm font-semibold text-foreground">Factory Floor Alpha</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-xs text-emerald-500">Active</div>
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#1c1c1c]/30 p-4 rounded-xl border border-[#1c1c1c]/50 hover:bg-[#1c1c1c]/50 transition-colors cursor-pointer">
                      <div className="text-2xl font-semibold text-foreground mb-1">94%</div>
                      <div className="text-xs text-muted-foreground">Yield Rate</div>
                    </div>
                    <div className="bg-[#1c1c1c]/30 p-4 rounded-xl border border-[#1c1c1c]/50 hover:bg-[#1c1c1c]/50 transition-colors cursor-pointer">
                      <div className="text-2xl font-semibold text-foreground mb-1">1.2k</div>
                      <div className="text-xs text-muted-foreground">Orders Active</div>
                    </div>
                  </div>

                  <div className="bg-[#1c1c1c]/30 p-4 rounded-xl border border-[#1c1c1c]/50 mt-2 flex-grow">
                     <div className="text-xs text-muted-foreground mb-4">Recent Alerts</div>
                     <div className="flex flex-col gap-4">
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                           <Activity className="w-4 h-4 text-blue-400" />
                         </div>
                         <div>
                           <div className="text-sm text-foreground">Inventory Low: Box A</div>
                           <div className="text-[10px] text-muted-foreground">2 mins ago</div>
                         </div>
                       </div>
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                           <Shield className="w-4 h-4 text-emerald-400" />
                         </div>
                         <div>
                           <div className="text-sm text-foreground">Order #892 Approved</div>
                           <div className="text-[10px] text-muted-foreground">14 mins ago</div>
                         </div>
                       </div>
                     </div>
                  </div>
                </div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-muted rounded-full"></div>
              </div>
            </div>

          </div>
        </section>

      </main>
    </div>
  );
}
