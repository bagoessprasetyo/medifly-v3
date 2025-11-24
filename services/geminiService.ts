
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';
import { Attachment } from '../types';

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
  language: string = 'English'
) {
  try {
    // gemini-2.5-flash is currently causing routing errors (404). 
    // switching to gemini-2.0-flash which is the stable V2 endpoint.
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
    
    const localizedSystemInstruction = SYSTEM_INSTRUCTION + `\n\n[IMPORTANT INSTRUCTION]: The user has selected the preferred language: "${language}". You MUST provide your ENTIRE response (including reasoning steps) in ${language}, unless the user explicitly asks otherwise. If the selected language is not English, translate all concierge persona responses naturally to that language.`;

    const chat = ai.chats.create({
        model: model,
        config: {
            systemInstruction: localizedSystemInstruction,
            temperature: 0.7, // slightly creative but focused
        },
        history: history
    });

    // FIXED: Use 'message' parameter, 'content' is not valid for sendMessageStream in this SDK version
    const result = await chat.sendMessageStream({ 
        message: currentMessageParts 
    });
    
    for await (const chunk of result) {
        const text = chunk.text;
        if (text) {
            yield text;
        }
    }

  } catch (error) {
    console.error("Error communicating with Aria:", error);
    yield "I apologize, but I'm having trouble connecting to my medical knowledge base right now. Please try again in a moment.";
  }
};
