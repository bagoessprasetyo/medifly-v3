
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';
import { Attachment, Source } from '../types';

// Safely access API Key respecting the environment
const getApiKey = () => {
  // Check for process.env.API_KEY if defined (injected by environment)
  if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
    return process.env.API_KEY;
  }
  // Fallback for Vite environments
  if ((import.meta as any).env?.VITE_GEMINI_API_KEY) {
    return (import.meta as any).env.VITE_GEMINI_API_KEY;
  }
  return '';
};

const apiKey = getApiKey();

// Helper to create the client instance securely
const createClient = () => {
  if (!apiKey) {
    console.warn("API_KEY is missing. AI features will not work.");
  }
  return new GoogleGenAI({ apiKey });
};

const ai = createClient();

export const streamMessageToAria = async function* (
  history: { role: 'user' | 'model'; parts: { text?: string; inlineData?: { mimeType: string; data: string } }[] }[],
  userMessage: string,
  attachment: Attachment | undefined,
  language: string = 'English',
  isDeepFocus: boolean = false
) {
  try {
    // gemini-2.0-flash is the stable V2 endpoint.
    const model = 'gemini-2.0-flash'; 
    
    // Construct the current message contents
    const currentMessageParts: { text?: string; inlineData?: { mimeType: string; data: string } }[] = [];
    
    // Add text prompt
    if (userMessage.trim()) {
        currentMessageParts.push({ text: userMessage });
    }

    // Add attachment if present
    if (attachment) {
        currentMessageParts.push({
            inlineData: {
                mimeType: attachment.type,
                data: attachment.data // Base64 string from UI
            }
        });
    }

    // Ensure there is at least one part (fallback for edge cases)
    if (currentMessageParts.length === 0) {
        currentMessageParts.push({ text: " " });
    }
    
    let systemPrompt = SYSTEM_INSTRUCTION + `\n\n[IMPORTANT INSTRUCTION]: The user has selected the preferred language: "${language}". You MUST provide your ENTIRE response (including reasoning steps) in ${language}.`;

    if (isDeepFocus) {
        systemPrompt += `\n\n[DEEP FOCUS MODE ACTIVE]:
        1. You are now in "Deep Focus / Research Mode".
        2. Your goal is NO LONGER just to find a hospital, but to provide a comprehensive "Second Opinion" or "Deep Medical Analysis".
        3. Use the 'googleSearch' tool to find the latest medical research, clinical trials, or news relevant to the user's query.
        4. Provide CITATIONS. When you state a fact found via search, ensure it is grounded.
        5. Your thinking process should be rigorous, challenging assumptions, and considering differential diagnoses (while maintaining the disclaimer that you are an AI).
        6. Output format: Still use <thinking> tags, but make the reasoning deeper.
        `;
    }

    const config: any = {
        systemInstruction: systemPrompt,
        temperature: 0.7, 
    };

    // Enable Google Search Tool for Deep Focus
    if (isDeepFocus) {
        config.tools = [{ googleSearch: {} }];
    }

    const chat = ai.chats.create({
        model: model,
        config: config,
        history: history
    });

    // FIXED: Use 'message' parameter
    const result = await chat.sendMessageStream({ 
        message: currentMessageParts 
    });
    
    for await (const chunk of result) {
        const text = chunk.text;
        // Check for grounding metadata (citations)
        const groundingMetadata = (chunk as any).groundingMetadata || {};
        let sources: Source[] = [];

        if (groundingMetadata && groundingMetadata.groundingChunks) {
            sources = groundingMetadata.groundingChunks
                .filter((c: any) => c.web?.uri && c.web?.title)
                .map((c: any) => ({
                    title: c.web.title,
                    uri: c.web.uri
                }));
        }

        if (text || sources.length > 0) {
            yield { text, sources };
        }
    }

  } catch (error) {
    console.error("Error communicating with Aria:", error);
    yield { text: "I apologize, but I'm having trouble connecting to my medical knowledge base right now. Please try again in a moment." };
  }
};
