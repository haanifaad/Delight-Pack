import React from 'react';
import { Metadata } from 'next';
import { getPostData, getAllPostSlugs } from '@/lib/blog';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const postData = await getPostData(params.slug);
    return {
      title: `${postData.title} | DP Packaging`,
      description: postData.description,
      openGraph: {
        title: postData.title,
        description: postData.description,
        type: 'article',
        publishedTime: postData.date,
      },
    };
  } catch (e) {
    return {
      title: 'Post Not Found | DP Packaging',
    };
  }
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  let postData;
  try {
    postData = await getPostData(params.slug);
  } catch {
    notFound();
  }
  
  return (
    <article className="max-w-3xl mx-auto py-20 px-6">
      <header className="mb-10">
        <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4 uppercase tracking-tight">
          {postData.title}
        </h1>
        <time className="text-primary font-medium">{new Date(postData.date).toLocaleDateString()}</time>
      </header>
      <div 
        className="prose prose-invert prose-amber max-w-none prose-headings:font-bold prose-a:text-primary hover:prose-a:text-primary-light"
        dangerouslySetInnerHTML={{ __html: postData.contentHtml }} 
      />
    </article>
  );
}
