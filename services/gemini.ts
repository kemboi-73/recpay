
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getServiceRecommendation = async (mood: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User says they feel: "${mood}". Based on this, recommend one of these recreational activities: Basketball, Swimming, Yoga, Gym, Squash, Sauna. Provide a catchy, motivational 1-sentence reason why it's perfect for their mood. Return as JSON: { "activity": "Name", "reason": "Text" }`,
      config: {
        responseMimeType: "application/json"
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};
