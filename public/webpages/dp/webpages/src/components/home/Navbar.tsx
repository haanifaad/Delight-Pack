import { Link } from 'react-router-dom';
import { Package2, Globe } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-obsidian-black/80 backdrop-blur-md border-b border-b2b-gray">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <Package2 className="w-6 h-6 text-editorial-white group-hover:text-slate-300 transition-colors" />
          <span className="font-semibold text-lg tracking-tighter text-editorial-white">Delight Pack</span>
        </Link>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-sm text-slate-400 hover:text-editorial-white transition-colors">
            <Globe className="w-4 h-4" />
            <span>EN</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
