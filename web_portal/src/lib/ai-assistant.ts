import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "dummy-key" });

const SYSTEM_INSTRUCTION = "You are the Delight Pack AI Assistant. Answer queries strictly about our packaging, boxes, and printing services. Keep responses under 50 words. Do not invent pricing.";

/**
 * Handles the customer chat using the Gemini API.
 * Ensures the system instruction is strictly applied.
 */
export async function chatWithAssistant(messages: { role: string; content: string }[]) {
  // @google/genai allows setting systemInstruction via model config
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    })),
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    }
  });

  return response.text;
}
