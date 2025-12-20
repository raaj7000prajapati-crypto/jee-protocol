
import { GoogleGenAI, Type } from "@google/genai";
import { Question, Subject } from "../types";

const questionSchema = {
  type: Type.OBJECT,
  properties: {
    text: { type: Type.STRING, description: "Direct JEE Main/Advanced question. MANDATORY: Wrap ALL math symbols/equations in $...$ (inline) or $$...$$ (block)." },
    options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Options. MANDATORY: Wrap symbols in $ delimiters." },
    correctAnswerIndex: { type: Type.INTEGER },
    explanation: { type: Type.STRING, description: "Detailed step-by-step logic. MANDATORY: Wrap ALL math/symbols in $ or $$ delimiters." },
    topic: { type: Type.STRING }
  },
  required: ["text", "options", "correctAnswerIndex", "explanation", "topic"],
};

export const generatePracticeQuestion = async (subject: Subject, topic?: string, previousQuestions: string[] = []): Promise<Question | null> => {
  try {
    const key = process.env.API_KEY;
    if (!key || key === "undefined") {
      console.error("Gemini API Key is missing.");
      return null;
    }

    const ai = new GoogleGenAI({ apiKey: key });
    const prompt = `Generate a high-yield JEE level ${subject} MCQ. ${topic ? `Topic: ${topic}.` : ''} 
    Focus on JEE Main and Advanced patterns for top-tier engineering aspirants.
    
    STRICT FORMATTING RULE: 
    1. Every single mathematical symbol, variable ($x$, $f(x)$, $\pi$), fraction, or notation MUST be wrapped in dollar signs.
    2. Use $...$ for inline and $$...$$ for block.
    3. Provide the response for Cheenu, a top-tier IIT aspirant.`;
    
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
        systemInstruction: "You are ALOO, Cheenu's elite JEE mentor. Focus on Physics, Chemistry, and Mathematics for IIT entrance. RULE: Wrap math symbols/equations in LaTeX ($...$). Be encouraging and emphasize logical derivation and problem-solving shortcuts.",
      }
    });
    const result = await chat.sendMessage({ message });
    return result.text || "I processed that, but the signal was weak. Try again, Cheenu.";
  } catch (error) { 
    return "Cortex sync issue. I'm ALOO, still here, just retry."; 
  }
};

export const generateMotivationalQuote = async (): Promise<string> => {
  try {
    const key = process.env.API_KEY;
    if (!key || key === "undefined") return "Focus on the IIT gates, Cheenu.";

    const ai = new GoogleGenAI({ apiKey: key });
    const prompt = `Generate a short (max 15 words) motivational quote for Cheenu about his JEE 2026 goal of reaching an IIT.`;
    const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
    return response.text?.trim() || "The gates of IIT are waiting for your logic, Cheenu.";
  } catch (error) { 
    return "Your seat at the IIT is being reserved. Keep pushing, Cheenu!"; 
  }
};
