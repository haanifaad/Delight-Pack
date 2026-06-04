import { NextResponse } from 'next/server';
import { GoogleGenAI, Type, Schema } from '@google/genai';
import { calculateQuotation, QuotationRequest } from '@/lib/quotationCalculator';

// Initialize the Gemini client
// Note: Requires GEMINI_API_KEY environment variable to be set
const ai = new GoogleGenAI({});

const systemInstruction = `
You are the official B2B representative for Delight Pack, a premium packaging company based in Dubai.
Your goal is to assist clients with their orders and strictly extract order details into a structured format.

Product Schemas available:
- Food Packaging
- Custom Box Printing
- Industrial Corrugated Rolls

Dubai Delivery Protocols:
- Standard delivery is within 3-5 business days.
- Rush delivery is available for urgent requests.
- All pricing is subject to 5% Dubai VAT.

When a user requests a quote, extract the following parameters:
- quantity (integer, minimum 1)
- category (must be one of: 'food_packaging', 'custom_box', 'industrial_rolls')
- custom_printing (boolean)
- urgency (must be one of: 'standard', 'high')

If the user does not provide enough information to determine these parameters, DO NOT output the JSON.
Instead, ask the user a clarifying question to gather the missing details.
`;

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    extractedQuote: {
      type: Type.OBJECT,
      properties: {
        quantity: { type: Type.INTEGER },
        category: { type: Type.STRING },
        custom_printing: { type: Type.BOOLEAN },
        urgency: { type: Type.STRING },
      },
      required: ['quantity', 'category', 'custom_printing', 'urgency'],
    },
    clarificationMessage: {
      type: Type.STRING,
      description: "A friendly message asking the user for missing details if the quote cannot be extracted. If the quote is extracted perfectly, this can be null."
    }
  },
};

export async function POST(req: Request) {
  try {
    const { message, clientId } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Call Gemini API
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.1, // Low temperature for deterministic extraction
      }
    });

    const outputText = response.text;
    
    if (!outputText) {
      throw new Error("Gemini returned empty response.");
    }

    const result = JSON.parse(outputText);

    // Fallback/Error Boundary: Check if AI successfully extracted the quote
    if (result.extractedQuote && Object.keys(result.extractedQuote).length > 0) {
      const quoteParams = result.extractedQuote as QuotationRequest;
      
      // Calculate costs and save to Firestore
      const quotationResult = await calculateQuotation(quoteParams, clientId || 'guest');

      return NextResponse.json({
        success: true,
        type: 'quotation',
        data: quotationResult,
        message: "Your quotation has been generated and saved."
      });
    } else if (result.clarificationMessage) {
      // Return the elegant clarification prompt
      return NextResponse.json({
        success: true,
        type: 'clarification',
        message: result.clarificationMessage
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "I couldn't quite understand your request. Could you specify the product category, quantity, and if you need custom printing?"
      });
    }

  } catch (error) {
    console.error("AI Assistant Error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "An internal error occurred while processing your request. Please try again later." 
    }, { status: 500 });
  }
}
