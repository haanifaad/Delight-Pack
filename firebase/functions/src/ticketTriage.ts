import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";
import { GoogleGenAI, Type, Schema } from "@google/genai";

const ai = new GoogleGenAI({});

const triageSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    category: {
      type: Type.STRING,
      description: "Strictly one of: 'Delivery Delay', 'Quality Defect', 'Billing Error', or 'General Inquiry' if it absolutely doesn't fit the main three."
    },
    severity_score: {
      type: Type.INTEGER,
      description: "An integer ranging from 1 (mild comments) to 5 (critical account churn risks)."
    },
    one_sentence_summary: {
      type: Type.STRING,
      description: "A brief, objective one-sentence summary of the ticket."
    }
  },
  required: ["category", "severity_score", "one_sentence_summary"]
};

export const processTicketTriage = onDocumentCreated("support_tickets/{ticketId}", async (event) => {
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
  } catch (error) {
    console.error(`Error triaging ticket ${ticketId}:`, error);
  }
});
