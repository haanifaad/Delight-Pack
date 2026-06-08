/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { POSTS } from './data';
import { BlogIndex } from './components/BlogIndex';
import { BlogPost } from './components/BlogPost';
import { Package } from 'lucide-react';

export default function App() {
  const [currentPostId, setCurrentPostId] = useState<string | null>(null);

  const selectedPost = currentPostId 
    ? POSTS.find(p => p.id === currentPostId) 
    : null;

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Semantic Site Header */}
      <header className="sticky top-0 z-50 bg-card glass-card backdrop-blur-2xl/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={() => setCurrentPostId(null)}
            role="banner"
          >
            <div className="bg-stone-900 text-white p-1.5 rounded-lg group-hover:scale-105 transition-transform">
              <Package size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight text-stone-900">EcoPack</span>
          </div>
          
          <nav aria-label="Main navigation" className="hidden md:block">
            <ul className="flex items-center gap-8 text-sm font-medium text-stone-600">
              <li><a href="#" className="hover:text-stone-900 transition-colors">Home</a></li>
              <li><a href="#" className="text-stone-900 transition-colors border-b-2 border-stone-900 pb-1">Blog</a></li>
              <li><a href="#" className="hover:text-stone-900 transition-colors">Solutions</a></li>
              <li><a href="#" className="hover:text-stone-900 transition-colors">About Us</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Dynamic Content Area */}
      <div className="flex-1">
        {selectedPost ? (
          <BlogPost 
            post={selectedPost} 
            onBack={() => setCurrentPostId(null)} 
          />
        ) : (
          <BlogIndex 
            posts={POSTS} 
            onSelectPost={(id) => setCurrentPostId(id)} 
          />
        )}
      </div>
      
      {/* Semantic Site Footer */}
      <footer className="bg-stone-900 text-stone-400 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Package size={24} className="text-stone-100" />
            <span className="font-bold text-xl tracking-tight text-stone-100">EcoPack</span>
          </div>
          <p className="text-sm">
            &copy; {new Date().getFullYear()} EcoPack Solutions. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
