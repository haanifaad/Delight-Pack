import { Post } from '../types';
import { ArticleCard } from './ArticleCard';

interface BlogIndexProps {
  posts: Post[];
  onSelectPost: (id: string) => void;
}

export function BlogIndex({ posts, onSelectPost }: BlogIndexProps) {
  // Highlight the first post as a featured article (optional UI enhancement)
  const [featuredPost, ...standardPosts] = posts;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <header className="mb-12 md:mb-20 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-stone-900">
          Insights & News
        </h1>
        <p className="text-lg md:text-xl text-stone-600">
          Discover the latest trends in eco-friendly packaging, sustainable 
          materials, and innovative retail delivery solutions.
        </p>
      </header>

      <main>
        {/* Featured Post - Semantic list context maintained implicitly or via sectioning */}
        {featuredPost && (
          <section className="mb-12 md:mb-16" aria-label="Featured Article">
            <div 
              className="group cursor-pointer grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center bg-card glass-card backdrop-blur-2xl rounded-2xl p-6 md:p-8 lg:p-10 border border-stone-200 shadow-sm transition-shadow hover:shadow-xl"
              onClick={() => onSelectPost(featuredPost.id)}
              role="link"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') onSelectPost(featuredPost.id); }}
            >
              <div className="order-2 md:order-1 flex flex-col items-start h-full justify-center">
                <span className="inline-block bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 md:mb-6">
                  {featuredPost.category}
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 lg:mb-6 leading-tight group-hover:text-emerald-700 transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-stone-600 text-lg mb-6 lg:mb-8 line-clamp-4">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-4 mt-auto">
                  <img 
                    src={featuredPost.author.avatar} 
                    alt={featuredPost.author.name} 
                    className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border border-stone-200"
                  />
                  <div>
                    <span className="block font-semibold text-stone-900">{featuredPost.author.name}</span>
                    <div className="flex items-center text-sm text-stone-500 gap-2">
                       <time dateTime={featuredPost.date}>
                         {new Date(featuredPost.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                       </time>
                       <span>&middot;</span>
                       <span>{featuredPost.readingTime}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2 aspect-[4/3] md:aspect-square lg:aspect-[4/3] overflow-hidden rounded-xl bg-stone-100 shadow-inner">
                <img 
                  src={featuredPost.imageUrl} 
                  alt={featuredPost.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>
          </section>
        )}

        {/* Standard Grid */}
        <section aria-label="Recent Articles">
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {standardPosts.map((post) => (
              <li key={post.id}>
                <ArticleCard post={post} onClick={onSelectPost} />
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
