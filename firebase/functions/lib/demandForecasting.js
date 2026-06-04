"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDemandForecasting = void 0;
const scheduler_1 = require("firebase-functions/v2/scheduler");
const admin = __importStar(require("firebase-admin"));
const genai_1 = require("@google/genai");
// Ensure Gemini API key is available via Firebase Secrets or process.env
const ai = new genai_1.GoogleGenAI({});
const db = admin.firestore();
// Structured output schema requested
const predictionSchema = {
    type: genai_1.Type.OBJECT,
    properties: {
        predicted_busy_months: {
            type: genai_1.Type.ARRAY,
            items: {
                type: genai_1.Type.OBJECT,
                properties: {
                    month: { type: genai_1.Type.STRING },
                    confidence_float: { type: genai_1.Type.NUMBER },
                    reasoning: { type: genai_1.Type.STRING }
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
            type: genai_1.Type.ARRAY,
            items: {
                type: genai_1.Type.OBJECT,
                properties: {
                    material_id: { type: genai_1.Type.STRING },
                    depletion_weeks: { type: genai_1.Type.NUMBER },
                },
                required: ["material_id", "depletion_weeks"]
            }
        },
        recommended_raw_material_orders: {
            type: genai_1.Type.ARRAY,
            items: {
                type: genai_1.Type.OBJECT,
                properties: {
                    material_id: { type: genai_1.Type.STRING },
                    recommended_quantity: { type: genai_1.Type.NUMBER },
                    urgency: { type: genai_1.Type.STRING }
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
exports.runDemandForecasting = (0, scheduler_1.onSchedule)("0 0 1 * *", async (event) => {
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
        if (!outputText)
            throw new Error("Empty response from Gemini");
        const predictionResult = JSON.parse(outputText);
        // 3. Save predictions to Firestore
        await db.collection('predictions').doc('latest').set({
            ...predictionResult,
            generatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log("Demand forecasting completed successfully.");
    }
    catch (error) {
        console.error("Demand forecasting failed:", error);
    }
});
//# sourceMappingURL=demandForecasting.js.map