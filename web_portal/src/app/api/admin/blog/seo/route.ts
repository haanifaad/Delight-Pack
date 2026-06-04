import { NextResponse } from 'next/server';
import { GoogleGenAI, Type, Schema } from '@google/genai';

// Initialize the Gemini client
const ai = new GoogleGenAI({});

const systemInstruction = `
You are an expert SEO architect and content translator for Delight Pack, a premium packaging company.
Your task is to analyze blog post content regarding sustainable or high-volume packaging trends, and generate optimal SEO metadata.
Additionally, you must provide culturally precise translations for the title and meta description in Malayalam and Arabic.
`;

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title_configurations: {
      type: Type.OBJECT,
      properties: {
        absolute_title: { type: Type.STRING, description: "Optimized title for search index crawlers (max 60 chars)" },
        social_title: { type: Type.STRING, description: "Engaging title for social media sharing" },
      },
      required: ["absolute_title", "social_title"],
    },
    meta_description: { 
      type: Type.STRING, 
      description: "Professional semantic meta description (max 160 chars)" 
    },
    high_density_keywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Array of high-density keywords extracted or inferred from the content"
    },
    translations: {
      type: Type.OBJECT,
      properties: {
        en: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            meta_description: { type: Type.STRING }
          },
          required: ["title", "meta_description"]
        },
        ml: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Malayalam translation" },
            meta_description: { type: Type.STRING, description: "Malayalam translation" }
          },
          required: ["title", "meta_description"]
        },
        ar: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Arabic translation" },
            meta_description: { type: Type.STRING, description: "Arabic translation" }
          },
          required: ["title", "meta_description"]
        }
      },
      required: ["en", "ml", "ar"]
    }
  },
  required: ["title_configurations", "meta_description", "high_density_keywords", "translations"]
};

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json({ error: "Content string is required" }, { status: 400 });
    }

    // Call Gemini API
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate SEO metadata and translations for the following blog post content:\n\n${content}`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.2, // Low temperature for consistent SEO outputs
      }
    });

    const outputText = response.text;
    
    if (!outputText) {
      throw new Error("Gemini returned empty response.");
    }

    const result = JSON.parse(outputText);

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error("SEO Generator Error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "An internal error occurred while generating SEO tags." 
    }, { status: 500 });
  }
}
