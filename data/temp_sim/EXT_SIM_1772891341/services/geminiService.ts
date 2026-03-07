
import { GoogleGenAI } from "@google/genai";
import { SimulationMode } from "../types";

const SYSTEM_INSTRUCTION = `
You are a senior physicist and expert in "Relational Quantum Network Theory" (R-QNT). 
Your task is to help the user, Edward Pérez López, and his colleagues understand the mechanics of the A-B-C Triada.
Focus on:
1. Cartan Torsion as the basis of gravity.
2. Borromean stability in topological knots.
3. Variable 'c' (light speed) as string tension in Via B.
4. Matter as the 'consumption' of network length.

Use a professional, visionary, yet rigorous tone. Use LaTeX for equations where possible.
Always reference the "Via B" mechanics when explaining anomalies in Einstein's "Via A".
`;

const RESEARCHER_INSTRUCTION = `
You are the R-QNT Autonomous Researcher Agent. 
You analyze simulation data from the A-B-C network.
When given metrics (Coherence, Torsion, Mode), you must provide a "Scientific Verdict" on the stability of the topological knots.
Identify if the configuration is a "Borromean Triple Link" and if it constitutes stable matter or mere laminar flow.
Format your response as a formal laboratory report conclusion.
`;

/**
 * Helper to handle retries with exponential backoff for 429 errors
 */
async function callWithRetry(fn: (isFallback?: boolean) => Promise<any>, maxRetries = 3): Promise<any> {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn(i > 0);
    } catch (error: any) {
      lastError = error;
      const errorMessage = error?.message || "";
      const isQuotaError = errorMessage.includes("429") || errorMessage.includes("RESOURCE_EXHAUSTED");
      
      if (isQuotaError && i < maxRetries - 1) {
        // Longer wait for quota errors: 3s, 7s...
        const delay = Math.pow(2, i + 2) * 1000 + Math.random() * 1000;
        console.warn(`Quota exceeded (429). Attempt ${i + 1} failed. Retrying in ${Math.round(delay)}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      if (errorMessage.includes("Requested entity was not found")) {
         console.error("Invalid API project detected.");
      }
      
      throw error;
    }
  }
  throw lastError;
}

/**
 * General Q&A Assistant - Using Flash model to conserve Pro quota
 */
export async function askGemini(prompt: string) {
  return callWithRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    // Using gemini-3-flash-preview for general Q&A as it has higher rate limits
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        // No thinking budget needed for basic Q&A to save tokens
      },
    });
    return response.text;
  }).catch(error => {
    console.error("Gemini API Error:", error);
    if (error.message?.includes("429") || error.message?.includes("RESOURCE_EXHAUSTED")) {
      return "CRITICAL: Quota exhausted (429). The A-B-C network is saturated. Click the 'API Connection' button at the top to select your own billing project for higher limits.";
    }
    return "The R-QNT network is currently experiencing high torsion. Error communicating with the system.";
  });
}

/**
 * Complex Validation - Tries Pro first, falls back to Flash if 429 encountered
 */
export async function validateSimulation(metrics: { coherence: number, mode: SimulationMode }) {
  const prompt = `Simulation Mode: ${metrics.mode}. Measured Coherence Index: ${metrics.coherence}%. 
  Analyze this data and provide a verdict on the stability of the Cartan Torsion field and the formation of Borromean knots.`;

  return callWithRetry(async (isFallback) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    // If we've already failed once, use Flash model which is less likely to hit limits
    const modelToUse = isFallback ? 'gemini-3-flash-preview' : 'gemini-3-pro-preview';
    
    const response = await ai.models.generateContent({
      model: modelToUse,
      contents: prompt,
      config: {
        systemInstruction: RESEARCHER_INSTRUCTION,
        // Reduced thinking budget to avoid hitting per-token limits
        thinkingConfig: { thinkingBudget: isFallback ? 0 : 4000 }
      },
    });
    return response.text;
  }).catch(error => {
    console.error("Validation Error:", error);
    if (error.message?.includes("429") || error.message?.includes("RESOURCE_EXHAUSTED")) {
        return "VERDICT SUSPENDED: Quota limit reached (429). Please wait a few moments or activate a Private API Key via the header button.";
    }
    return "Unable to provide an automated verdict. Please check manual torsion readings.";
  });
}
