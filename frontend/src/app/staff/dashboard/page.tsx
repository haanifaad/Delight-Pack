import Link from 'next/link';
import { ClipboardCheck, LayoutDashboard, Package, ShieldCheck } from 'lucide-react';

export default function StaffDashboard() {
  return (
    <div className="p-8 max-w-5xl mx-auto min-h-screen">
      <div className="flex items-center space-x-4 mb-8">
        <LayoutDashboard className="w-8 h-8 text-amber-500" />
        <h1 className="text-3xl font-bold text-white">Staff Operational Hub</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/staff/kanban" className="block group">
          <div className="bg-neutral-800 p-6 rounded-lg border border-neutral-700 hover:border-amber-500 transition-colors h-full flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mb-4 group-hover:bg-amber-500 group-hover:text-black transition-colors">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Live Kanban</h2>
              <p className="text-neutral-400 text-sm">Drag and drop jobs across production stages (Pre-Press, Printing, Die-Cut).</p>
            </div>
          </div>
        </Link>

        <Link href="/staff/materials" className="block group">
          <div className="bg-neutral-800 p-6 rounded-lg border border-neutral-700 hover:border-blue-500 transition-colors h-full flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-500 group-hover:text-black transition-colors">
                <Package className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Material Logger</h2>
              <p className="text-neutral-400 text-sm">One-tap rapid entry interface for scanning and deducting raw inventory.</p>
            </div>
          </div>
        </Link>

        <Link href="/staff/qa" className="block group">
          <div className="bg-neutral-800 p-6 rounded-lg border border-neutral-700 hover:border-green-500 transition-colors h-full flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-500 group-hover:text-black transition-colors">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">QA Checklists</h2>
              <p className="text-neutral-400 text-sm">Mandatory quality assurance sign-offs required to advance jobs.</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
