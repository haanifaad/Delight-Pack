import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "dummy-key" });

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    if (!Array.isArray(payload)) {
      return NextResponse.json({ error: 'Payload must be an array of packaging specifications' }, { status: 400 });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: `Calculate an estimated quote based on these requirements: ${JSON.stringify(payload)}`,
      config: {
        systemInstruction: "You are an AI packaging estimator for Delight Pack. You strictly return accurately estimated material_cost, printing_cost, and delivery_cost in AED based on current market logic.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            material_cost: {
              type: Type.NUMBER,
              description: "The estimated material cost in AED",
            },
            printing_cost: {
              type: Type.NUMBER,
              description: "The estimated printing cost in AED",
            },
            delivery_cost: {
              type: Type.NUMBER,
              description: "The estimated delivery cost in AED",
            },
          },
          required: ["material_cost", "printing_cost", "delivery_cost"],
        },
      }
    });

    // Parse the structured output
    const result = JSON.parse(response.text || '{}');

    return NextResponse.json(result);
  } catch (error) {
    console.error('AI Quote Error:', error);
    return NextResponse.json({ error: 'Failed to generate quote' }, { status: 500 });
  }
}
