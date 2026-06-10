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
exports.processTicketTriage = void 0;
const firestore_1 = require("firebase-functions/v2/firestore");
const admin = __importStar(require("firebase-admin"));
const genai_1 = require("@google/genai");
const ai = new genai_1.GoogleGenAI({});
const triageSchema = {
    type: genai_1.Type.OBJECT,
    properties: {
        category: {
            type: genai_1.Type.STRING,
            description: "Strictly one of: 'Delivery Delay', 'Quality Defect', 'Billing Error', or 'General Inquiry' if it absolutely doesn't fit the main three."
        },
        severity_score: {
            type: genai_1.Type.INTEGER,
            description: "An integer ranging from 1 (mild comments) to 5 (critical account churn risks)."
        },
        one_sentence_summary: {
            type: genai_1.Type.STRING,
            description: "A brief, objective one-sentence summary of the ticket."
        }
    },
    required: ["category", "severity_score", "one_sentence_summary"]
};
exports.processTicketTriage = (0, firestore_1.onDocumentCreated)("support_tickets/{ticketId}", async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
        console.log("No data associated with the event");
        return;
    }
    const data = snapshot.data();
    const ticketId = event.params.ticketId;
    const ticketContent = data.message || data.content || data.description;
    if (!ticketContent) {
        console.log(`Ticket ${ticketId} has no message/content to analyze.`);
        return;
    }
    try {
        const systemInstruction = `
      You are an automated structural text triage engine for Delight Pack customer feedback.
      Analyze the incoming support ticket text.
      Determine the category, assess the severity (1=mild, 5=critical churn risk), and summarize it in one sentence.
      Strictly map the category to: 'Delivery Delay', 'Quality Defect', 'Billing Error'. 
      If it doesn't fit any of those, map to 'General Inquiry'.
    `;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Support Ticket Text:\n\n"${ticketContent}"`,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: 'application/json',
                responseSchema: triageSchema,
                temperature: 0.1,
            }
        });
        const outputText = response.text;
        if (!outputText) {
            throw new Error("Empty response from Gemini");
        }
        const triageResult = JSON.parse(outputText);
        // Write the structured fields back into the document context
        await snapshot.ref.update({
            triage: triageResult,
            status: triageResult.severity_score >= 4 ? 'high_priority' : 'open',
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log(`Ticket ${ticketId} triaged successfully.`);
    }
    catch (error) {
        console.error(`Error triaging ticket ${ticketId}:`, error);
    }
});
//# sourceMappingURL=ticketTriage.js.map