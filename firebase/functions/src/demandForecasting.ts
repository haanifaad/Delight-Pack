import { onSchedule } from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";
import { GoogleGenAI, Type, Schema } from "@google/genai";

// Ensure Gemini API key is available via Firebase Secrets or process.env
const ai = new GoogleGenAI({}); 

const db = admin.firestore();

// Structured output schema requested
const predictionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    predicted_busy_months: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          month: { type: Type.STRING },
          confidence_float: { type: Type.NUMBER },
          reasoning: { type: Type.STRING }
        },
        required: ["month", "confidence_float", "reasoning"]
      }
    },
    potential_stock_shortages: {
      description: "Mapping material IDs to estimated depletion weeks",
      // Since property keys are unknown, we'll use a dynamic object approach in instructions, 
      // but Gemini SDK might not fully support free-form map keys yet without defining them, 
      // so we use an array of objects to map it safely.
      // We will parse it back to an object if needed, or just return the array.
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          material_id: { type: Type.STRING },
          depletion_weeks: { type: Type.NUMBER },
        },
        required: ["material_id", "depletion_weeks"]
      }
    },
    recommended_raw_material_orders: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          material_id: { type: Type.STRING },
          recommended_quantity: { type: Type.NUMBER },
          urgency: { type: Type.STRING }
        },
        required: ["material_id", "recommended_quantity", "urgency"]
      }
    }
  },
  required: ["predicted_busy_months", "potential_stock_shortages", "recommended_raw_material_orders"]
};

/**
 * Runs monthly (or weekly) to analyze historical data and forecast demand.
 */
export const runDemandForecasting = onSchedule("0 0 1 * *", async (event) => {
  try {
    // 1. Gather historical data from Firestore (last 12-24 months)
    const incomeSnap = await db.collection('finance').doc('income').collection('logs').orderBy('timestamp', 'desc').limit(100).get();
    const expensesSnap = await db.collection('finance').doc('expenses').collection('logs').orderBy('timestamp', 'desc').limit(100).get();
    const inventoryLogsSnap = await db.collection('inventory').doc('logs').collection('entries').orderBy('timestamp', 'desc').limit(200).get();

    // Map to simple JSON representations for Gemini
    const incomeData = incomeSnap.docs.map(d => d.data());
    const expensesData = expensesSnap.docs.map(d => d.data());
    const inventoryData = inventoryLogsSnap.docs.map(d => d.data());

    const aggregatedData = JSON.stringify({
      income: incomeData,
      expenses: expensesData,
      inventoryUsage: inventoryData
    });

    const systemInstruction = `
      You are a Senior Data Scientist for Delight Pack.
      Analyze the provided raw financial and stock metrics.
      Identify trends, seasonality, and consumption rates.
      Output a strict JSON payload predicting busy months, mapping potential stock shortages, and recommending raw material orders.
    `;

    // 2. Call Gemini
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Here is the historical data: ${aggregatedData}`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: predictionSchema,
        temperature: 0.1,
      }
    });

    const outputText = response.text;
    if (!outputText) throw new Error("Empty response from Gemini");

    const predictionResult = JSON.parse(outputText);

    // 3. Save predictions to Firestore
    await db.collection('predictions').doc('latest').set({
      ...predictionResult,
      generatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log("Demand forecasting completed successfully.");
  } catch (error) {
    console.error("Demand forecasting failed:", error);
  }
});
