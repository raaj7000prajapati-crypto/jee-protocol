
import { GoogleGenAI, Type } from "@google/genai";
import { Question, Subject } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const questionSchema = {
  type: Type.OBJECT,
  properties: {
    text: { type: Type.STRING, description: "Direct JEE question. MANDATORY: Wrap ALL math in $...$ (inline) or $$...$$ (block)." },
    options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Options. MANDATORY: Wrap ALL math in $ delimiters." },
    correctAnswerIndex: { type: Type.INTEGER },
    explanation: { type: Type.STRING, description: "Detailed explanation. MANDATORY: Wrap ALL math/symbols in $ or $$ delimiters." },
    topic: { type: Type.STRING }
  },
  required: ["text", "options", "correctAnswerIndex", "explanation", "topic"],
};

export const generatePracticeQuestion = async (subject: Subject, topic?: string, previousQuestions: string[] = []): Promise<Question | null> => {
  try {
    const prompt = `Generate a high-yield JEE level ${subject} MCQ. ${topic ? `Topic: ${topic}.` : ''} 
    
    STRICT FORMATTING RULE: 
    1. Every single mathematical symbol, variable ($x$, $T_1$, $\Delta$), fraction ($\frac{a}{b}$), or equation MUST be wrapped in dollar signs.
    2. Use $...$ for inline math and $$...$$ for large standalone equations.
    3. NEVER output raw LaTeX commands like \frac without the $ wrapper.
    4. Provide the response for Cheenu, a top-tier IIT aspirant.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { responseMimeType: "application/json", responseSchema: questionSchema, temperature: 0.7 },
    });
    const text = response.text;
    if (!text) return null;
    return { id: crypto.randomUUID(), subject, ...JSON.parse(text) };
  } catch (error) { return null; }
};

export const getChatResponse = async (history: {role: string, parts: {text: string}[]}[], message: string) => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: "You are ALOO, Cheenu's elite JEE mentor. LOGIC FIRST. RULE: You MUST wrap EVERY mathematical symbol, variable, or equation in LaTeX delimiters ($...$ or $$...$$). If you write T2, write it as $T_2$. If you write a fraction, write it as $\\frac{x}{y}$. Never forget the dollar signs. Be encouraging and focus on engineering excellence.",
      }
    });
    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) { return "Cortex sync issue. I'm ALOO, still here though, just retry."; }
};

export const generateMotivationalQuote = async (): Promise<string> => {
  try {
    const prompt = `Generate a short (max 15 words) motivational quote for Cheenu about his IIT-JEE 2026 goal.`;
    const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
    return response.text?.trim() || "The gates of IIT are waiting for your logic, Cheenu.";
  } catch (error) { return "Your seat at the IIT is being reserved. Keep pushing, Cheenu!"; }
};
