import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, Feedback } from "../types";

export const analyzeFeedback = async (feedbacks: Feedback[]): Promise<AnalysisResult> => {
  if (!feedbacks || feedbacks.length === 0) {
    throw new Error("No feedback to analyze.");
  }

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const feedbackText = feedbacks
    .map((f) => `- (Mood: ${f.mood}/5): "${f.text}"`)
    .join("\n");

  const prompt = `
    You are an expert HR consultant and data analyst. 
    Analyze the following anonymous employee feedback comments from a company culture survey.
    
    Identified trends, sentiment, and specific pain points or wins.
    
    Based on this analysis, provide:
    1. A one-sentence executive summary of the overall team sentiment.
    2. A concrete, actionable 3-point plan for management to improve or maintain the culture.
    
    Feedback Data:
    ${feedbackText}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "A one-sentence summary of the overall sentiment.",
            },
            actionPoints: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
              description: "Exactly 3 actionable steps for management.",
            },
          },
          required: ["summary", "actionPoints"],
        },
      },
    });

    const text = response.text;
    if (!text) {
        throw new Error("Empty response from AI");
    }
    
    return JSON.parse(text) as AnalysisResult;

  } catch (error) {
    console.error("Error analyzing feedback:", error);
    throw error;
  }
};
