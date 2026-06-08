import { Post } from '../types';
import { Clock } from 'lucide-react';

interface ArticleCardProps {
  post: Post;
  onClick: (id: string) => void;
}

export function ArticleCard({ post, onClick }: ArticleCardProps) {
  // Format date for display and datetime attribute
  const publishDate = new Date(post.date);
  const formattedDate = publishDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <article 
      className="group cursor-pointer flex flex-col h-full bg-white border border-stone-200 rounded-xl overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1"
      onClick={() => onClick(post.id)}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick(post.id); }}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
        <img 
          src={post.imageUrl} 
          alt={`Thumbnail for ${post.title}`} 
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-4 left-4">
          <span className="inline-block bg-stone-900/90 backdrop-blur-sm text-stone-100 text-xs font-medium px-3 py-1 rounded-full uppercase tracking-wider">
            {post.category}
          </span>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-1">
        <header>
          <h2 className="text-xl md:text-2xl font-bold mb-3 text-stone-900 leading-snug group-hover:text-stone-600 transition-colors">
            {post.title}
          </h2>
        </header>
        
        <p className="text-stone-600 mb-6 flex-1 line-clamp-3">
          {post.excerpt}
        </p>
        
        <footer className="mt-auto flex items-center justify-between border-t border-stone-100 pt-5">
          <div className="flex items-center gap-3">
            <img 
              src={post.author.avatar} 
              alt={post.author.name} 
              className="w-8 h-8 rounded-full border border-stone-200"
              loading="lazy"
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-stone-900">{post.author.name}</span>
              <time dateTime={post.date} className="text-xs text-stone-500">{formattedDate}</time>
            </div>
          </div>
          
          <div className="flex items-center text-stone-400 gap-1.5" title="Reading time">
            <Clock size={16} />
            <span className="text-xs font-medium">{post.readingTime}</span>
          </div>
        </footer>
      </div>
    </article>
  );
}
