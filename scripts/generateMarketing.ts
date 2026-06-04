import { GoogleGenAI, Type, Schema } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars, as this might be run independently
dotenv.config({ path: path.join(process.cwd(), '.env') });

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

async function generateMarketingAssets() {
  console.log('Generating marketing assets for Delight Pack...');
  
  const prompt = `
    Generate social media marketing content about 'Eco-friendly packaging trends in Dubai'.
    It must include:
    1. A 3-paragraph LinkedIn post.
    2. A punchy Instagram caption.
    Ensure both include highly relevant hashtags and a strong call-to-action pointing to the 'Delight Pack portal'.
  `;

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      linkedinPost: {
        type: Type.STRING,
        description: 'A 3-paragraph LinkedIn post',
      },
      instagramCaption: {
        type: Type.STRING,
        description: 'A punchy Instagram caption',
      },
      hashtags: {
         type: Type.ARRAY,
         items: { type: Type.STRING },
         description: 'List of relevant hashtags'
      }
    },
    required: ['linkedinPost', 'instagramCaption', 'hashtags'],
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
      },
    });

    if (response.text) {
      const result = JSON.parse(response.text);
      console.log('--- Marketing Assets Generated successfully ---');
      console.log('\\n📝 LinkedIn Post:\\n', result.linkedinPost);
      console.log('\\n📸 Instagram Caption:\\n', result.instagramCaption);
      console.log('\\n🔖 Hashtags:\\n', result.hashtags.join(' '));
    } else {
      console.log('Failed to generate marketing assets.');
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
  }
}

generateMarketingAssets();
