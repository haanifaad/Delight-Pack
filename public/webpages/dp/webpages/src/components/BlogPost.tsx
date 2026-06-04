import { Post } from '../types';
import { ArrowLeft, Clock, Share2, Twitter, Linkedin, Facebook } from 'lucide-react';
import { useEffect } from 'react';

interface BlogPostProps {
  post: Post;
  onBack: () => void;
}

export function BlogPost({ post, onBack }: BlogPostProps) {
  // Ensure we're at the top when navigating to a post
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [post.id]);

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
      {/* Utility Navigation for SEO and UX */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <button 
          onClick={onBack}
          className="group inline-flex items-center text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2 transition-transform group-hover:-translate-x-1" />
          Back to all articles
        </button>
      </nav>

      <div className="flex flex-col lg:flex-row gap-12 xl:gap-24">
        {/* Main Article Content */}
        <main className="flex-1 lg:max-w-[720px] xl:max-w-[800px]">
          <article>
            <header className="mb-10">
              <div className="flex items-center gap-4 mb-6">
                <span className="bg-stone-100 text-stone-800 text-sm font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                  {post.category}
                </span>
                <div className="flex items-center text-sm font-medium text-stone-500 gap-1.5 border-l border-stone-300 pl-4">
                  <Clock size={16} />
                  <span>{post.readingTime}</span>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-stone-900 leading-tight mb-8">
                {post.title}
              </h1>
              
              <div className="flex items-center gap-4 py-6 border-y border-stone-200">
                <img 
                  src={post.author.avatar} 
                  alt={post.author.name} 
                  className="w-12 h-12 rounded-full border border-stone-200"
                />
                <div>
                  <span className="block font-semibold text-stone-900 text-lg">{post.author.name}</span>
                  <time dateTime={post.date} className="text-stone-500">
                    Published on {formattedDate}
                  </time>
                </div>
              </div>
            </header>

            <figure className="mb-12">
              <img 
                src={post.imageUrl} 
                alt={post.title} 
                className="w-full aspect-[16/9] object-cover rounded-2xl shadow-sm"
              />
              <figcaption className="text-center text-sm text-stone-500 mt-3 italic">
                Representational imagery for {post.category.toLowerCase()} concepts.
              </figcaption>
            </figure>

            <div className="prose prose-lg prose-stone max-w-none font-serif">
              <p className="lead text-xl md:text-2xl text-stone-600 font-sans mb-8 leading-relaxed">
                {post.excerpt}
              </p>
              
              {post.content.map((paragraph, idx) => (
                <p key={idx} className="mb-6 text-stone-800 leading-relaxed text-[1.125rem]">
                  {paragraph}
                </p>
              ))}
            </div>
            
            <footer className="mt-12 pt-8 border-t border-stone-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="font-semibold text-stone-900 flex items-center gap-2">
                  <Share2 size={18} />
                  Share this article
                </div>
                <div className="flex items-center gap-3">
                  <button className="p-2 rounded-full border border-stone-200 text-stone-600 hover:text-[#1DA1F2] hover:border-[#1DA1F2] transition-colors" aria-label="Share on Twitter">
                    <Twitter size={18} />
                  </button>
                  <button className="p-2 rounded-full border border-stone-200 text-stone-600 hover:text-[#0A66C2] hover:border-[#0A66C2] transition-colors" aria-label="Share on LinkedIn">
                    <Linkedin size={18} />
                  </button>
                  <button className="p-2 rounded-full border border-stone-200 text-stone-600 hover:text-[#1877F2] hover:border-[#1877F2] transition-colors" aria-label="Share on Facebook">
                    <Facebook size={18} />
                  </button>
                </div>
              </div>
            </footer>
          </article>
        </main>

        {/* SEO Optimized Sticky Sidebar */}
        <aside className="lg:w-[320px] xl:w-[360px] hidden lg:block border-l border-stone-200 pl-12">
          <div className="sticky top-12">
            <div className="mb-12">
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-6">Explore Topics</h3>
              <nav aria-label="Categories">
                <ul className="flex flex-col gap-3">
                   <li>
                     <a href="#" className="flex items-center justify-between text-stone-600 hover:text-emerald-700 font-medium group transition-colors">
                       <span className="border-b border-transparent group-hover:border-emerald-700">Packaging Trends</span>
                       <span className="bg-stone-100 text-stone-500 text-xs py-1 px-2 rounded group-hover:bg-emerald-50 group-hover:text-emerald-700">12</span>
                     </a>
                   </li>
                   <li>
                     <a href="#" className="flex items-center justify-between text-stone-600 hover:text-emerald-700 font-medium group transition-colors">
                       <span className="border-b border-transparent group-hover:border-emerald-700">Eco-friendly Packaging</span>
                       <span className="bg-stone-100 text-stone-500 text-xs py-1 px-2 rounded group-hover:bg-emerald-50 group-hover:text-emerald-700">8</span>
                     </a>
                   </li>
                   <li>
                     <a href="#" className="flex items-center justify-between text-stone-600 hover:text-emerald-700 font-medium group transition-colors">
                       <span className="border-b border-transparent group-hover:border-emerald-700">Technology</span>
                       <span className="bg-stone-100 text-stone-500 text-xs py-1 px-2 rounded group-hover:bg-emerald-50 group-hover:text-emerald-700">5</span>
                     </a>
                   </li>
                   <li>
                     <a href="#" className="flex items-center justify-between text-stone-600 hover:text-emerald-700 font-medium group transition-colors">
                       <span className="border-b border-transparent group-hover:border-emerald-700">Logistics & Supply</span>
                       <span className="bg-stone-100 text-stone-500 text-xs py-1 px-2 rounded group-hover:bg-emerald-50 group-hover:text-emerald-700">14</span>
                     </a>
                   </li>
                </ul>
              </nav>
            </div>
            
            <div className="bg-stone-100 rounded-2xl p-6">
              <h3 className="font-bold text-stone-900 mb-2">Subscribe to our newsletter</h3>
              <p className="text-stone-600 text-sm mb-4">
                Get the latest news in sustainable packaging delivered to your inbox every week.
              </p>
              <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  aria-label="Email address"
                  autoComplete="email"
                  className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-stone-900"
                  required
                />
                <button type="submit" className="w-full px-4 py-2 bg-stone-900 text-white rounded-lg font-medium hover:bg-stone-800 transition-colors">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
