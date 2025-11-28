
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';
import { Attachment, Source, GroundingMetadata, StreamChunk } from '../types';

// Safely access API Key respecting the environment
const getApiKey = () => {
  // Check for process.env.API_KEY if defined (injected by environment)
  if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
    return process.env.API_KEY;
  }
  // Fallback for using Vite environment
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

// Helper to extract grounding metadata from response
const extractGroundingData = (groundingMetadata: GroundingMetadata | undefined): { sources: Source[]; searchQueries: string[] } => {
  const sources: Source[] = [];
  const searchQueries: string[] = [];

  if (!groundingMetadata) {
    return { sources, searchQueries };
  }

  // Extract search queries
  if (groundingMetadata.webSearchQueries && groundingMetadata.webSearchQueries.length > 0) {
    searchQueries.push(...groundingMetadata.webSearchQueries);
  }

  // Extract sources from grounding chunks
  if (groundingMetadata.groundingChunks) {
    for (const chunk of groundingMetadata.groundingChunks) {
      if (chunk.web?.uri && chunk.web?.title) {
        // Avoid duplicates
        if (!sources.some(s => s.uri === chunk.web!.uri)) {
          sources.push({
            title: chunk.web.title,
            uri: chunk.web.uri
          });
        }
      }
    }
  }

  return { sources, searchQueries };
};

export const streamMessageToAria = async function* (
  history: { role: 'user' | 'model'; parts: { text?: string; inlineData?: { mimeType: string; data: string } }[] }[],
  userMessage: string,
  attachment: Attachment | undefined,
  language: string = 'English',
  isDeepFocus: boolean = false
): AsyncGenerator<StreamChunk> {
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
        systemPrompt += `

[DEEP FOCUS MODE ACTIVE - Enhanced Research Protocol]:

You are now operating in Deep Focus / Research Mode. Your behavior changes significantly:

## Primary Objective
Provide comprehensive, research-backed medical analysis with proper citations.

## Research Requirements
1. USE the googleSearch tool to find the latest medical research, clinical guidelines, treatment protocols, and peer-reviewed information.
2. Search for multiple perspectives when topics are complex or controversial.
3. Look for recent studies, meta-analyses, and authoritative medical sources (Mayo Clinic, NIH, WHO, medical journals).

## Citation Format (MANDATORY)
- When stating facts from your search, use inline citation markers: [1], [2], [3], etc.
- Place the citation marker immediately after the relevant statement.
- Example: "Recent studies show that minimally invasive surgery reduces recovery time by 40% [1]."
- The sources will be automatically displayed to the user - you don't need to list them manually.

## Response Structure
1. <thinking> - Deep clinical reasoning, differential considerations, what you're searching for and why
2. Main response with inline citations [1], [2], etc.
3. Clearly distinguish between established medical consensus vs. emerging research vs. your analytical synthesis
4. Include limitations and when the user should consult specialists

## Marketplace Integration
- If the user explicitly asks to find, list, or recommend hospitals/doctors, you MUST output the <filters> JSON block at the end (same format as standard mode).
- However, your text response should still focus on clinical/research analysis of *why* those options might be suitable (e.g. "Hospital X has published research on Y").

## Quality Standards
- Prioritize recency: prefer sources from the last 2-3 years when available
- Prioritize authority: medical institutions, peer-reviewed journals, official guidelines
- Be transparent about uncertainty or conflicting evidence
- Never present searched information as your own knowledge - always cite

## What NOT to do
- Do NOT rush to conclusions - thorough analysis is expected
- Do NOT omit citations - every factual claim from search must be cited
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

    // Signal that we're starting (and potentially searching in Deep Focus mode)
    if (isDeepFocus) {
        yield { text: '', isSearching: true };
    }

    // FIXED: Use 'message' parameter
    const result = await chat.sendMessageStream({
        message: currentMessageParts
    });

    let hasYieldedSearchingFalse = false;
    let accumulatedSources: Source[] = [];
    let accumulatedSearchQueries: string[] = [];

    for await (const chunk of result) {
        const text = chunk.text;

        // Check for grounding metadata (may appear in any chunk, but typically later/final)
        const groundingMetadata = (chunk as any).candidates?.[0]?.groundingMetadata as GroundingMetadata | undefined;

        if (groundingMetadata) {
            const { sources, searchQueries } = extractGroundingData(groundingMetadata);

            // Accumulate unique sources
            for (const source of sources) {
                if (!accumulatedSources.some(s => s.uri === source.uri)) {
                    accumulatedSources.push(source);
                }
            }

            // Accumulate unique search queries
            for (const query of searchQueries) {
                if (!accumulatedSearchQueries.includes(query)) {
                    accumulatedSearchQueries.push(query);
                }
            }
        }

        // Once we start getting text, we're no longer in "searching" state
        if (text && isDeepFocus && !hasYieldedSearchingFalse) {
            hasYieldedSearchingFalse = true;
            yield { text: '', isSearching: false };
        }

        if (text) {
            yield {
                text,
                sources: accumulatedSources.length > 0 ? accumulatedSources : undefined,
                searchQueries: accumulatedSearchQueries.length > 0 ? accumulatedSearchQueries : undefined
            };
        }
    }

    // Final yield with all accumulated metadata (ensures sources are captured even if they come at the end)
    if (accumulatedSources.length > 0 || accumulatedSearchQueries.length > 0) {
        yield {
            text: '',
            sources: accumulatedSources,
            searchQueries: accumulatedSearchQueries
        };
    }

  } catch (error) {
    console.error("Error communicating with Aria:", error);
    yield { text: "I apologize, but I'm having trouble connecting to my medical knowledge base right now. Please try again in a moment." };
  }
};
