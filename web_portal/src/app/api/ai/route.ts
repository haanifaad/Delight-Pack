import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// Initialize the Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { action, payload } = await req.json();

    if (action === 'quote') {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: `You are an AI packaging estimator for Delight Pack.
        Calculate an estimated quote based on these requirements: ${JSON.stringify(payload)}
        Provide a professional breakdown of:
        1. Material Cost
        2. Printing Cost
        3. Delivery Cost
        Format your response as a JSON object with 'total', 'breakdown' (array of strings), and 'message' (string).`
      });
      
      const text = response.text;
      // In a real scenario, we would parse this JSON. For safety, returning the raw text.
      return NextResponse.json({ result: text });
    }

    if (action === 'assistant') {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are a helpful customer support AI for Delight Pack. 
        Answer the customer's query: "${payload.query}"
        Be polite, professional, and highlight our eco-friendly premium products.`
      });
      return NextResponse.json({ reply: response.text });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });

  } catch (error) {
    console.error('AI Error:', error);
    return NextResponse.json({ error: 'Failed to process AI request' }, { status: 500 });
  }
}
