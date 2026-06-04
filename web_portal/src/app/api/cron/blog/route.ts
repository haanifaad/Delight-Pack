import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';
import * as path from 'path';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "dummy-key" });

export async function GET(req: Request) {
  // Simple auth for cron endpoints
  const authHeader = req.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const prompt = `
      Write a 500-word SEO-optimized blog post about 'Industrial Packaging Solutions'.
      Focus on durability, eco-friendly materials, and supply chain efficiency.
      Include a catchy title and format the entire output strictly as markdown.
      Do not include the YAML frontmatter in your markdown output; I will add it programmatically.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
    });

    const content = response.text || '';
    
    // Extract a title from the first heading if available
    const titleMatch = content.match(/^#\s+(.*)/m);
    const title = titleMatch ? titleMatch[1].trim() : 'Industrial Packaging Solutions';
    
    const dateStr = new Date().toISOString().split('T')[0];
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const yamlFrontmatter = `---
title: "${title}"
date: "${dateStr}"
author: "Delight Pack AI"
category: "Industry Insights"
---

`;

    const finalMarkdown = yamlFrontmatter + content.replace(/^#\s+.*$/m, ''); // Remove the H1 since it's in frontmatter

    const fileName = `${dateStr}-${slug}.md`;
    const contentDir = path.join(process.cwd(), 'public', 'content', 'blog');
    
    if (!fs.existsSync(contentDir)) {
      fs.mkdirSync(contentDir, { recursive: true });
    }

    const filePath = path.join(contentDir, fileName);
    fs.writeFileSync(filePath, finalMarkdown, 'utf-8');

    return NextResponse.json({ success: true, message: 'Blog post published', filePath });
  } catch (error) {
    console.error('SEO Blog Error:', error);
    return NextResponse.json({ error: 'Failed to generate blog post' }, { status: 500 });
  }
}
