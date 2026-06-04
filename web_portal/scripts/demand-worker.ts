import { PrismaClient } from '@prisma/client';
import { GoogleGenAI, Type } from '@google/genai';

const prisma = new PrismaClient();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "dummy-key" });

async function runDemandPrediction() {

  try {
    // 1. Extract the last 6 months of structured sales data from PostgreSQL
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const recentOrders = await prisma.order.findMany({
      where: {
        createdAt: { gte: sixMonthsAgo }
      },
      select: {
        id: true,
        totalAmount: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' }
    });

    const inventory = await prisma.inventoryItem.findMany();

    const payload = JSON.stringify({
      orders: recentOrders,
      current_inventory: inventory
    });

    // 2. Feed JSON data to Gemini API
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: `Here is the last 6 months of sales and current inventory data: ${payload}`,
      config: {
        systemInstruction: "You are a Demand Prediction AI for Delight Pack. Analyze seasonal trends and predict the required raw material stock for the upcoming month. Output strictly as JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            predicted_month: { type: Type.STRING, description: "The upcoming month (e.g. 'July 2026')" },
            confidence_score: { type: Type.NUMBER, description: "Confidence score between 0.0 and 1.0" },
            reasoning: { type: Type.STRING, description: "A brief reasoning for the prediction" },
            raw_material_reqs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  material: { type: Type.STRING },
                  required_quantity: { type: Type.INTEGER }
                }
              }
            }
          },
          required: ["predicted_month", "confidence_score", "reasoning", "raw_material_reqs"]
        }
      }
    });

    const prediction = JSON.parse(response.text || '{}');

    // @ts-expect-error - Prisma client may not be fully generated for this model
    const saved = await prisma.demandPrediction.create({
      data: {
        predicted_month: prediction.predicted_month,
        confidence_score: prediction.confidence_score,
        reasoning: prediction.reasoning,
        raw_material_reqs: prediction.raw_material_reqs,
      }
    });

  } catch (error) {
    console.error("Demand prediction failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if executed directly
if (require.main === module) {
  runDemandPrediction();
}
