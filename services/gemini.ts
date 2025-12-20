
import { GoogleGenAI, Type } from "@google/genai";
import { Question, Subject } from "../types";

const questionSchema = {
  type: Type.OBJECT,
  properties: {
    text: { type: Type.STRING, description: "Direct JEE question. MANDATORY: Wrap ALL math in $...$ (inline) or $$...$$ (block)." },
    options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Options. MANDATORY: Wrap symbols in $ delimiters." },
    correctAnswerIndex: { type: Type.INTEGER },
    explanation: { type: Type.STRING, description: "Step-by-step logic. MANDATORY: Wrap math in $ delimiters." },
    topic: { type: Type.STRING }
  },
  required: ["text", "options", "correctAnswerIndex", "explanation", "topic"],
};

export const generatePracticeQuestion = async (subject: Subject, topic?: string, previousQuestions: string[] = []): Promise<Question | null> => {
  try {
    const key = process.env.API_KEY;
    if (!key || key === "undefined") return null;

    const ai = new GoogleGenAI({ apiKey: key });
    const prompt = `Generate a high-yield JEE level ${subject} MCQ. ${topic ? `Topic: ${topic}.` : ''} 
    Format rules: Wrap ALL math in $ (inline) or $$ (block). Targeting top-tier IIT aspirants.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { responseMimeType: "application/json", responseSchema: questionSchema, temperature: 0.7 },
    });
    
    const text = response.text;
    if (!text) return null;
    return { id: crypto.randomUUID(), subject, ...JSON.parse(text) };
  } catch (error) { 
    console.error("Question Generation Error:", error);
    return null; 
  }
};

export const getChatResponse = async (history: {role: string, parts: {text: string}[]}[], message: string): Promise<string> => {
  try {
    const key = process.env.API_KEY;
    if (!key || key === "undefined") return "API Key Configuration Error.";

    const ai = new GoogleGenAI({ apiKey: key });
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: "You are ALOO, Cheenu's elite JEE mentor. Focus on engineering excellence. Wrap math in LaTeX ($...$).",
      }
    });
    const result = await chat.sendMessage({ message });
    return result.text || "I'm processing, Cheenu. Try asking again.";
  } catch (error) { 
    return "Cortex sync issue. I'm still here, just retry."; 
  }
};

export const generateMotivationalQuote = async (): Promise<string> => {
  try {
    const key = process.env.API_KEY;
    if (!key || key === "undefined") return "The IIT gates are waiting, Cheenu.";

    const ai = new GoogleGenAI({ apiKey: key });
    const prompt = `Short (max 15 words) quote for Cheenu about his JEE 2026 goal.`;
    const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
    return response.text?.trim() || "Persistence is the path to IIT.";
  } catch (error) { 
    return "Your seat in medical college is being reserved. Keep pushing!"; 
  }
};
