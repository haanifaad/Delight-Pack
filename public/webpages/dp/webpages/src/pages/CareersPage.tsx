import { ArrowRight } from 'lucide-react';

export function CareersPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <a href="../index.html" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold text-xl group-hover:bg-blue-500 transition-colors">
              D
            </div>
            <span className="font-semibold text-xl tracking-tight text-foreground group-hover:text-blue-400 transition-colors">Delight Pack</span>
          </a>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="../index.html" className="hover:text-blue-600 transition-colors">Products</a>
          <a href="../index.html" className="hover:text-blue-600 transition-colors">About Us</a>
          <a href="#/careers" className="text-blue-600">Careers</a>
          <a href="#/contact" className="hover:text-blue-600 transition-colors">Contact</a>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-6 pt-24 pb-32 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-500 text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          We're actively hiring
        </div>

        <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-foreground mb-8 leading-[1.1]">
          Shape the Future of <br/>
          <span className="text-blue-600">Manufacturing</span>
        </h1>

        <p className="text-xl text-muted-foreground mb-12 max-w-2xl leading-relaxed font-light">
          Join a team of driven builders, engineers, and operators determined to 
          revolutionize global supply chains. Find your life's work at Delight Pack.
        </p>

        <button className="flex items-center gap-2 px-8 py-4 bg-[#2563EB] text-white rounded-full font-medium hover:bg-[#3B82F6] transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-600/20">
          View Open Positions
          <ArrowRight className="w-5 h-5" />
        </button>
        
      </main>
    </div>
  );
}
