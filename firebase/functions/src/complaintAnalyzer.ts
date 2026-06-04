import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";
import { GoogleGenAI, Type, Schema } from "@google/genai";

const ai = new GoogleGenAI({});

const analyzerSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    category: {
      type: Type.STRING,
      description: "Strictly one of: 'Delivery', 'Quality', or 'General'."
    },
    sentiment: {
      type: Type.STRING,
      description: "Detected sentiment: 'Positive', 'Neutral', or 'Negative'."
    },
    is_critical: {
      type: Type.BOOLEAN,
      description: "True if the issue is severe and requires urgent attention."
    }
  },
  required: ["category", "sentiment", "is_critical"]
};

export const analyzeComplaint = onDocumentCreated("feedbacks/{feedbackId}", async (event) => {
  const snapshot = event.data;
  if (!snapshot) return;

  const data = snapshot.data();
  const feedbackId = event.params.feedbackId;
  const feedbackText = data.text || data.message;

  if (!feedbackText) return;

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

    if (!response.text) throw new Error("Empty response from Gemini");

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

  } catch (error) {
    console.error(`Error analyzing feedback ${feedbackId}:`, error);
  }
});
