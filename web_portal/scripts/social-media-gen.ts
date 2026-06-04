import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';
import * as path from 'path';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "dummy-key" });

async function generateSocialMedia() {

  try {
    const prompt = `
      You are an expert Social Media Marketer for Delight Pack, a premium industrial packaging company in Dubai.
      Topic: 'Eco-friendly packaging trends in Dubai'
      
      Generate two outputs:
      1. A professional, engaging 3-paragraph LinkedIn post discussing these trends and Delight Pack's solutions.
      2. A punchy, visual-heavy Instagram caption.
      
      Requirements:
      - Include highly relevant hashtags for both platforms.
      - End BOTH with a strong call-to-action pointing to the Delight Pack portal (https://delightpack.com).
      
      Format the output clearly separating LinkedIn and Instagram content.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const content = response.text;
    
    // Save to file
    const dateStr = new Date().toISOString().split('T')[0];
    const fileName = `social-post-${dateStr}.txt`;
    const outPath = path.join(__dirname, '..', 'public', 'content', 'social', fileName);
    
    // Ensure directory exists
    const dir = path.dirname(outPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outPath, content || '', 'utf-8');



  } catch (error) {
    console.error("Social media generation failed:", error);
  }
}

// Run if executed directly
if (require.main === module) {
  generateSocialMedia();
}
