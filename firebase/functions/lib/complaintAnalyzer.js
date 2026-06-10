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
exports.analyzeComplaint = void 0;
const firestore_1 = require("firebase-functions/v2/firestore");
const admin = __importStar(require("firebase-admin"));
const genai_1 = require("@google/genai");
const ai = new genai_1.GoogleGenAI({});
const analyzerSchema = {
    type: genai_1.Type.OBJECT,
    properties: {
        category: {
            type: genai_1.Type.STRING,
            description: "Strictly one of: 'Delivery', 'Quality', or 'General'."
        },
        sentiment: {
            type: genai_1.Type.STRING,
            description: "Detected sentiment: 'Positive', 'Neutral', or 'Negative'."
        },
        is_critical: {
            type: genai_1.Type.BOOLEAN,
            description: "True if the issue is severe and requires urgent attention."
        }
    },
    required: ["category", "sentiment", "is_critical"]
};
exports.analyzeComplaint = (0, firestore_1.onDocumentCreated)("feedbacks/{feedbackId}", async (event) => {
    const snapshot = event.data;
    if (!snapshot)
        return;
    const data = snapshot.data();
    const feedbackId = event.params.feedbackId;
    const feedbackText = data.text || data.message;
    if (!feedbackText)
        return;
    try {
        const systemInstruction = `
      You are an AI Complaint Analyzer for Delight Pack.
      Analyze the customer feedback text.
      Strictly categorize the issue into 'Delivery', 'Quality', or 'General'.
      Determine the sentiment and if the issue is critical.
    `;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Feedback Text: "${feedbackText}"`,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: 'application/json',
                responseSchema: analyzerSchema,
                temperature: 0.1,
            }
        });
        if (!response.text)
            throw new Error("Empty response from Gemini");
        const analysis = JSON.parse(response.text);
        await snapshot.ref.update({
            analysis,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        // If critical Quality issue, send FCM
        if (analysis.category === 'Quality' && analysis.is_critical) {
            const message = {
                notification: {
                    title: "Urgent Quality Issue Detected",
                    body: `A critical quality complaint was submitted. Feedback ID: ${feedbackId}`
                },
                topic: "l4_admin_alerts"
            };
            await admin.messaging().send(message);
            console.log(`Sent urgent FCM for feedback ${feedbackId}`);
        }
    }
    catch (error) {
        console.error(`Error analyzing feedback ${feedbackId}:`, error);
    }
});
//# sourceMappingURL=complaintAnalyzer.js.map