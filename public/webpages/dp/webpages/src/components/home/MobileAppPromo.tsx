import { Activity, MessageSquare, Shield } from 'lucide-react';

export function MobileAppPromo() {
  return (
    <section className="mt-8 border border-b2b-gray rounded-2xl p-8 md:p-12 bg-gradient-to-b from-obsidian-black to-[#050505] relative overflow-hidden">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-card glass-card backdrop-blur-2xl/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="flex-1 flex flex-col gap-8">
          <div>
            <h2 className="text-3xl font-semibold tracking-tighter text-editorial-white mb-4">
              The Ecosystem Hub
            </h2>
            <p className="text-slate-400 font-light max-w-md">
              Delight Pack Mobile Apps are designed for speed and uncompromising precision.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-4 group">
              <div className="mt-1">
                <Activity className="w-5 h-5 text-editorial-white group-hover:text-emerald-400 transition-colors" />
              </div>
              <div>
                <h4 className="font-medium text-editorial-white text-sm">Admin Mobile App</h4>
                <p className="text-xs text-slate-400 mt-1">Live factory analytics, inventory alerts, and instant order approvals for management.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 group">
              <div className="mt-1">
                <MessageSquare className="w-5 h-5 text-editorial-white group-hover:text-blue-400 transition-colors" />
              </div>
              <div>
                <h4 className="font-medium text-editorial-white text-sm">Customer Mobile App</h4>
                <p className="text-xs text-slate-400 mt-1">Seamless on-the-go order placement, instant support chat, and real-time delivery tracking.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <button className="flex items-center justify-center gap-3 px-5 py-2.5 border border-b2b-gray hover:border-slate-500 rounded-lg transition-colors bg-black/50 backdrop-blur-sm text-editorial-white">
              <span className="text-xs font-medium text-left">Download on the<br/><span className="text-sm font-semibold">App Store</span></span>
            </button>
            <button className="flex items-center justify-center gap-3 px-5 py-2.5 border border-b2b-gray hover:border-slate-500 rounded-lg transition-colors bg-black/50 backdrop-blur-sm text-editorial-white">
              <span className="text-xs font-medium text-left">Get it on<br/><span className="text-sm font-semibold">Google Play</span></span>
            </button>
          </div>
        </div>

        <div className="flex-1 w-full max-w-sm">
          <div className="border border-b2b-gray bg-obsidian-black rounded-[2.5rem] p-6 shadow-2xl relative aspect-[1/1.5] flex flex-col">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-b2b-gray rounded-full" />
            <div className="mt-6 flex flex-col gap-4 flex-grow">
              <div className="flex justify-between items-center pb-4 border-b border-b2b-gray">
                <div>
                  <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Live Status</div>
                  <div className="text-sm font-semibold text-editorial-white">Factory Floor Alpha</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs text-emerald-500">Active</div>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-b2b-gray/30 p-4 rounded-xl border border-b2b-gray/50 hover:bg-b2b-gray/50 transition-colors cursor-pointer">
                  <div className="text-2xl font-semibold text-editorial-white mb-1">94%</div>
                  <div className="text-xs text-slate-400">Yield Rate</div>
                </div>
                <div className="bg-b2b-gray/30 p-4 rounded-xl border border-b2b-gray/50 hover:bg-b2b-gray/50 transition-colors cursor-pointer">
                  <div className="text-2xl font-semibold text-editorial-white mb-1">1.2k</div>
                  <div className="text-xs text-slate-400">Orders Active</div>
                </div>
              </div>

              <div className="bg-b2b-gray/30 p-4 rounded-xl border border-b2b-gray/50 mt-2 flex-grow">
                 <div className="text-xs text-slate-400 mb-4">Recent Alerts</div>
                 <div className="flex flex-col gap-4">
                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                       <Activity className="w-4 h-4 text-blue-400" />
                     </div>
                     <div>
                       <div className="text-sm text-editorial-white">Inventory Low: Box A</div>
                       <div className="text-[10px] text-muted-foreground">2 mins ago</div>
                     </div>
                   </div>
                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                       <Shield className="w-4 h-4 text-emerald-400" />
                     </div>
                     <div>
                       <div className="text-sm text-editorial-white">Order #892 Approved</div>
                       <div className="text-[10px] text-muted-foreground">14 mins ago</div>
                     </div>
                   </div>
                 </div>
              </div>
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-b2b-gray rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
