import { GoogleGenAI, Type } from "@google/genai";
import { NameAnalysis } from "../types";
import { calculateDeterministicScore, getRarityLevel } from "./logic";

export const analyzeNameWithGemini = async (name: string): Promise<NameAnalysis> => {
  // 1. Get the math score first
  const mathScore = calculateDeterministicScore(name);
  const rarity = getRarityLevel(mathScore);

  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("No API Key");
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // We want structured output for the witty text
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
        Analyze the name "${name}". 
        The algorithmic score is ${mathScore}/100.
        The rarity tier is "${rarity}".
        
        Rules used for score:
        - High consonants = crisp/strong (Good)
        - Rare letters (X, Z, K, V) = cool bonus (Good)
        - Too many vowels = mushy/soft (Bad)
        
        Task:
        Provide a funny, meme-like, quirky "Vibe Check" for this name.
        Be a bit judgmental but playful. If the score is low, roast them gently. If high, hype them up.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verdict: {
              type: Type.STRING,
              description: "A short, punchy 3-5 word title for the result. E.g. 'Certified Main Character' or 'Soup Sandwich Vibes'",
            },
            description: {
              type: Type.STRING,
              description: "A one sentence witty explanation of why they got this score. Use Gen Z slang or internet humor.",
            },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 short adjectives describing the name's aura.",
            }
          },
          required: ["verdict", "description", "tags"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response");
    
    const data = JSON.parse(text);

    return {
      score: mathScore,
      verdict: data.verdict || "Unclassifiable Aura",
      description: data.description || "The stars are silent regarding this name.",
      tags: data.tags || ["Mystery", "Void", "Unknown"],
      rarityLevel: rarity
    };

  } catch (error) {
    console.error("Gemini API Error (falling back to local):", error);
    
    // Fallback if API fails
    return {
      score: mathScore,
      verdict: mathScore > 80 ? "Absolute Banger" : mathScore > 50 ? "Solid Choice" : "Needs More Consonants",
      description: mathScore > 80 
        ? "This name screams 'I have arrived'. The vowels fear you." 
        : "It's a name. It does the job. Just don't expect fireworks.",
      tags: ["Offline", "Mode", "Activated"],
      rarityLevel: rarity
    };
  }
};