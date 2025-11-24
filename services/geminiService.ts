
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';
import { Attachment } from '../types';

// Safely access process.env for browser environments
const getApiKey = () => {
  try {
    if (typeof process !== 'undefined' && process.env) {
      return process.env.API_KEY || '';
    }
  } catch (e) {
    // Ignore error if process is not defined
  }
  return '';
};

const apiKey = getApiKey();

// Helper to create the client instance securely
const createClient = () => {
  if (!apiKey) {
    console.warn("API_KEY is missing or process.env is unavailable.");
  }
  return new GoogleGenAI({ apiKey });
};

const ai = createClient();

export const streamMessageToAria = async function* (
  history: { role: 'user' | 'model'; parts: { text?: string; inlineData?: { mimeType: string; data: string } }[] }[],
  userMessage: string,
  attachment?: Attachment
) {
  try {
    const model = 'gemini-2.5-flash'; 
    
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
    
    const chat = ai.chats.create({
        model: model,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
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
