'use client';

import React, { useState } from 'react';
import { Download, FileText, Loader2 } from 'lucide-react';

export default function CatalogGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/catalog', {
        method: 'GET',
      });
      
      if (!response.ok) throw new Error('Failed to generate catalog');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'DelightPack-Catalog.pdf';
      document.body.appendChild(a);
      a.click();
      
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading catalog:', error);
      alert("Failed to generate the PDF catalog. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-md max-w-sm flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-red-100 rounded-xl">
          <FileText className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h3 className="font-bold text-zinc-900 text-lg leading-tight">Digital Catalog</h3>
          <p className="text-sm text-zinc-500">Generate PDF of top 10 products</p>
        </div>
      </div>
      
      <button 
        onClick={handleGenerate}
        disabled={isGenerating}
        className="w-full mt-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-foreground font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_5px_15px_rgba(220,38,38,0.3)] active:scale-95"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            Download Catalog
          </>
        )}
      </button>
    </div>
  );
}
