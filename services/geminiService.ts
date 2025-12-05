
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
    const model = 'gemini-2.5-pro';

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

[DEEP FOCUS MODE ACTIVE - Enhanced Research & Visualization Protocol]:

You are operating in Deep Focus / Research Mode. Your behavior changes significantly:

## Primary Objective
Provide comprehensive, research-backed medical analysis with proper citations and RICH VISUALIZATIONS.

## Research Requirements
1. USE the googleSearch tool to find the latest medical research, clinical guidelines, and treatment protocols.
2. Look for recent studies, meta-analyses, and authoritative medical sources.

## Visual Artifacts (MANDATORY for Complex Data)
If you are comparing treatments, showing survival rates, pricing, or timelines, you MUST output an <artifact> block at the end of your response to create a rich visual Canvas.

Supported Artifact Types:

1. **Comparison** (Comparing 2-3 items):
   <artifact>
   {
     "type": "comparison",
     "title": "Treatment Options Comparison",
     "data": {
       "items": ["ACL Reconstruction", "Conservative Rehab"],
       "metrics": [
         { "label": "Recovery Time", "values": ["6-9 months", "3-6 months"] },
         { "label": "Success Rate", "values": ["90-95%", "40-60%"] },
         { "label": "Cost Estimate", "values": ["$12,000", "$2,000"] }
       ]
     }
   }
   </artifact>

2. **Chart** (Bar/Line for stats):
   <artifact>
   {
     "type": "chart",
     "title": "5-Year Survival Rates by Stage",
     "data": {
       "chartType": "bar",
       "labels": ["Stage I", "Stage II", "Stage III", "Stage IV"],
       "datasets": [
         { "label": "Survival Rate", "data": [98, 85, 60, 25] }
       ]
     }
   }
   </artifact>

3. **Table** (Structured Data):
   <artifact>
   {
     "type": "table",
     "title": "Recommended Screening Schedule",
     "data": {
       "columns": ["Age Group", "Frequency", "Test Type"],
       "rows": [
         ["20-29", "Every 3 years", "Pap Smear"],
         ["30-65", "Every 5 years", "HPV + Pap Co-test"]
       ]
     }
   }
   </artifact>

## Citation Format
- Use inline citation markers: [1], [2], etc.
- These will be auto-linked to sources.

## Response Structure
1. <thinking> - Clinical reasoning & search strategy
2. Main text response with citations.
3. [Optional] <filters> JSON for marketplace.
4. [Optional] <artifact> JSON for visual canvas (One artifact per message).

## What NOT to do
- Do NOT output the artifact JSON inside a markdown code block (\`\`\`json). Output it strictly between <artifact> tags.
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

    // Signal that we're starting
    if (isDeepFocus) {
        yield { text: '', isSearching: true };
    }

    const result = await chat.sendMessageStream({
        message: currentMessageParts
    });

    let hasYieldedSearchingFalse = false;
    let accumulatedSources: Source[] = [];
    let accumulatedSearchQueries: string[] = [];

    for await (const chunk of result) {
        const text = chunk.text;

        // Check for grounding metadata
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

    // Final yield with all accumulated metadata
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

export const translateBatch = async (
  texts: string[],
  targetLanguage: string
): Promise<Record<string, string>> => {
  // If target is English or empty list, return identity map
  if (texts.length === 0 || targetLanguage === 'English') {
      return texts.reduce((acc, text) => ({ ...acc, [text]: text }), {});
  }

  try {
    const model = 'gemini-2.5-flash';
    const prompt = `You are a professional localization AI for a medical application called "Medifly".
    Translate the following UI text strings into ${targetLanguage}. 
    
    Rules:
    1. Return strictly a JSON object where keys are the original English text and values are the translations.
    2. Maintain tone: Professional, Trustworthy, Modern, Clinical yet Empathetic.
    3. Do not translate proper nouns like "Medifly", "Aria", "JCI" unless standard in that language.
    4. Keep variable placeholders intact if they appear (e.g. {0}).
    
    Strings to translate:
    ${JSON.stringify(texts)}
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const jsonStr = response.text;
    if (!jsonStr) return {};
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Translation error:", error);
    // Fallback to original texts on error
    return texts.reduce((acc, text) => ({ ...acc, [text]: text }), {});
  }
};

// Type definitions for travel segments
export interface TravelSegment {
  type: 'flight' | 'bus' | 'train' | 'car' | 'taxi' | 'walk' | 'ferry';
  from: { name: string; code?: string };
  to: { name: string; code?: string };
  duration: string;
  details?: string; // e.g., "Direct Flight", "Express Bus", "Grab/Taxi"
}

export interface TravelRoute {
  mode: 'air' | 'bus' | 'train' | 'car';
  totalDuration: string;
  totalDurationMinutes: number; // For sorting/comparison
  segments: TravelSegment[];
  recommended?: boolean;
  estimatedCost?: string;
  available: boolean; // Whether this route is available for this origin-destination pair
  unavailableReason?: string; // Why the route is not available
}

// Type definitions for location info
export interface LocationInfo {
  address: string;
  countryFlag: string;
  travelInfo: {
    fromLocation: string;
    departureAirport: string; // Airport near user's location
    byAir: string;
  };
  nearbyAirport: { name: string; distance: string }; // Airport near hospital
  transportations: { name: string; distance: string }[];
  landmarks: { name: string; distance: string }[];
  mapUrl: string;
  // New advanced travel routes
  travelRoutes: TravelRoute[];
}

// Cache for location info to avoid repeated API calls
const locationInfoCache = new Map<string, LocationInfo>();

export const generateLocationInfo = async (
  hospitalName: string,
  hospitalLocation: string,
  country: string,
  coordinates: { lat: number; lng: number },
  userOrigin: string = 'Jakarta, Indonesia'
): Promise<LocationInfo> => {
  // Check cache first (include userOrigin in cache key since it affects results)
  const cacheKey = `${hospitalName}-${coordinates.lat}-${coordinates.lng}-${userOrigin}`;
  if (locationInfoCache.has(cacheKey)) {
    return locationInfoCache.get(cacheKey)!;
  }

  try {
    const model = 'gemini-2.5-flash';

    const prompt = `You are a travel information assistant for a medical tourism platform.

Given a hospital location and user's origin, generate accurate travel and nearby location information with DETAILED MULTI-MODAL travel routes.

Hospital: ${hospitalName}
Hospital Location: ${hospitalLocation}, ${country}
Hospital Coordinates: Latitude ${coordinates.lat}, Longitude ${coordinates.lng}
User's Origin: ${userOrigin}

Generate a JSON response with the following structure:
{
  "address": "Full street address of the hospital (use the actual/realistic address based on the hospital name and location)",
  "countryFlag": "The emoji flag for the hospital's country (e.g., 🇹🇭 for Thailand, 🇲🇾 for Malaysia, 🇸🇬 for Singapore, 🇮🇩 for Indonesia)",
  "travelInfo": {
    "fromLocation": "The user's origin city name only (e.g., 'Jakarta')",
    "departureAirport": "The main international airport near the USER'S ORIGIN with code (e.g., 'Soekarno-Hatta International Airport (CGK)' for Jakarta)",
    "byAir": "Estimated direct flight duration from user's origin to hospital destination (e.g., 'Less than 2 hours', 'About 3 hours')"
  },
  "nearbyAirport": {
    "name": "The main international airport NEAR THE HOSPITAL with code (e.g., 'Suvarnabhumi Airport (BKK)' for Bangkok hospitals)",
    "distance": "Distance from hospital to this airport (e.g., '25 km away')"
  },
  "transportations": [
    { "name": "Nearest metro/MRT/BTS station or main bus terminal near the hospital", "distance": "X.X km away" },
    { "name": "Another transport option if available", "distance": "X.X km away" }
  ],
  "landmarks": [
    { "name": "Famous nearby landmark, temple, or tourist attraction", "distance": "X.X km away" },
    { "name": "Popular shopping mall or commercial area nearby", "distance": "X.X km away" },
    { "name": "Well-known restaurant, market, or cultural site nearby", "distance": "X.X km away" }
  ],
  "travelRoutes": [
    {
      "mode": "air",
      "totalDuration": "X hours Y minutes",
      "totalDurationMinutes": 600,
      "recommended": true,
      "available": true,
      "estimatedCost": "$XXX - $XXX",
      "segments": [
        {
          "type": "car",
          "from": { "name": "User's neighborhood/area" },
          "to": { "name": "Departure Airport Name", "code": "ABC" },
          "duration": "30 - 45 min",
          "details": "Taxi/Grab"
        },
        {
          "type": "flight",
          "from": { "name": "Departure Airport Name", "code": "ABC" },
          "to": { "name": "Arrival Airport Name", "code": "XYZ" },
          "duration": "X hours",
          "details": "Direct Flight"
        },
        {
          "type": "car",
          "from": { "name": "Arrival Airport Name", "code": "XYZ" },
          "to": { "name": "Hospital Name" },
          "duration": "30 - 45 min",
          "details": "Taxi/Grab"
        }
      ]
    },
    {
      "mode": "bus",
      "totalDuration": "X hours",
      "totalDurationMinutes": 720,
      "available": true or false,
      "unavailableReason": "Only include if available is false - e.g., 'No direct bus routes available between these countries'",
      "estimatedCost": "$XX - $XX",
      "segments": [
        {
          "type": "car",
          "from": { "name": "User's area" },
          "to": { "name": "Bus Terminal Name" },
          "duration": "20 - 30 min",
          "details": "Taxi/Grab"
        },
        {
          "type": "bus",
          "from": { "name": "Bus Terminal Name" },
          "to": { "name": "Destination Bus Terminal" },
          "duration": "X hours",
          "details": "Express Bus / Coach"
        },
        {
          "type": "car",
          "from": { "name": "Destination Bus Terminal" },
          "to": { "name": "Hospital Name" },
          "duration": "15 - 25 min",
          "details": "Taxi/Grab"
        }
      ]
    },
    {
      "mode": "train",
      "totalDuration": "X hours",
      "totalDurationMinutes": 480,
      "available": true or false,
      "unavailableReason": "Only include if available is false",
      "estimatedCost": "$XX - $XX",
      "segments": [...]
    },
    {
      "mode": "car",
      "totalDuration": "X hours",
      "totalDurationMinutes": 360,
      "available": true or false,
      "unavailableReason": "Only include if available is false - e.g., 'Driving between islands/countries not possible'",
      "estimatedCost": "$XX - $XX (fuel + tolls)",
      "segments": [
        {
          "type": "car",
          "from": { "name": "User's location" },
          "to": { "name": "Hospital Name" },
          "duration": "X hours",
          "details": "Self-drive / Private car"
        }
      ]
    }
  ]
}

CRITICAL Requirements:
1. ALWAYS include ALL 4 travel modes (air, bus, train, car) in travelRoutes array
2. For each mode, set "available": true if that transport method is realistically possible, false otherwise
3. If a mode is NOT available (e.g., can't drive between islands, no train connection between countries), set:
   - "available": false
   - "unavailableReason": "Clear explanation why this mode isn't available"
   - "segments": [] (empty array)
   - "totalDurationMinutes": 0
4. For AVAILABLE routes:
   - Include realistic segments from user's location TO THE HOSPITAL (not just to airport/station)
   - The final segment should ALWAYS end at the hospital
   - Calculate totalDurationMinutes as the sum of all segment durations
5. Mark the fastest/most practical route as "recommended": true
6. Use REAL airport codes, bus terminals, train stations
7. For international travel where land transport isn't practical, mark bus/train/car as unavailable
8. For domestic/nearby city travel, all modes might be available
9. Estimate costs in USD

Return ONLY valid JSON, no markdown or explanation.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2, // Lower temperature for more consistent factual output
      }
    });

    const jsonStr = response.text;
    if (!jsonStr) {
      throw new Error("Empty response from AI");
    }

    const locationInfo: LocationInfo = JSON.parse(jsonStr);

    // Generate dynamic map URL using the coordinates
    locationInfo.mapUrl = `https://api.mapbox.com/styles/v1/mapbox/light-v10/static/pin-s+1C1C1C(${coordinates.lng},${coordinates.lat})/${coordinates.lng},${coordinates.lat},14,0/400x200@2x?access_token=pk.eyJ1IjoibWVkaWZseSIsImEiOiJjbTdtbnh5aXYwMHFyMmtzY3Z3Z3l3c3d6In0.vCgD0jPLKH5xhYqJxJnLYA`;

    // Cache the result
    locationInfoCache.set(cacheKey, locationInfo);

    return locationInfo;
  } catch (error) {
    console.error("Error generating location info:", error);

    // Return fallback data
    const originCity = userOrigin.split(',')[0]?.trim() || 'Jakarta';
    const fallback: LocationInfo = {
      address: `${hospitalLocation}, ${country}`,
      countryFlag: country === 'Thailand' ? '🇹🇭' : country === 'Malaysia' ? '🇲🇾' : country === 'Singapore' ? '🇸🇬' : country === 'Indonesia' ? '🇮🇩' : '🏳️',
      travelInfo: {
        fromLocation: originCity,
        departureAirport: originCity === 'Jakarta' ? 'Soekarno-Hatta International Airport (CGK)' : `${originCity} International Airport`,
        byAir: 'About 2-3 hours'
      },
      nearbyAirport: { name: `${hospitalLocation} International Airport`, distance: '15 km away' },
      transportations: [{ name: 'Local public transport available', distance: '1 km away' }],
      landmarks: [
        { name: 'City Center', distance: '5 km away' },
        { name: 'Shopping Mall', distance: '3 km away' }
      ],
      mapUrl: `https://api.mapbox.com/styles/v1/mapbox/light-v10/static/pin-s+1C1C1C(${coordinates.lng},${coordinates.lat})/${coordinates.lng},${coordinates.lat},14,0/400x200@2x?access_token=pk.eyJ1IjoibWVkaWZseSIsImEiOiJjbTdtbnh5aXYwMHFyMmtzY3Z3Z3l3c3d6In0.vCgD0jPLKH5xhYqJxJnLYA`,
      travelRoutes: [
        {
          mode: 'air',
          totalDuration: 'About 4-5 hours',
          totalDurationMinutes: 270,
          recommended: true,
          available: true,
          estimatedCost: '$150 - $300',
          segments: [
            {
              type: 'car',
              from: { name: originCity },
              to: { name: originCity === 'Jakarta' ? 'Soekarno-Hatta International Airport' : `${originCity} Airport`, code: originCity === 'Jakarta' ? 'CGK' : 'XXX' },
              duration: '30 - 45 min',
              details: 'Taxi/Grab'
            },
            {
              type: 'flight',
              from: { name: originCity === 'Jakarta' ? 'Soekarno-Hatta International Airport' : `${originCity} Airport`, code: originCity === 'Jakarta' ? 'CGK' : 'XXX' },
              to: { name: `${hospitalLocation} Airport`, code: 'XXX' },
              duration: '2 - 3 hours',
              details: 'Direct Flight'
            },
            {
              type: 'car',
              from: { name: `${hospitalLocation} Airport`, code: 'XXX' },
              to: { name: hospitalName },
              duration: '30 - 45 min',
              details: 'Taxi/Grab'
            }
          ]
        },
        {
          mode: 'bus',
          totalDuration: 'Not available',
          totalDurationMinutes: 0,
          available: false,
          unavailableReason: 'No direct bus routes available for international travel',
          segments: []
        },
        {
          mode: 'train',
          totalDuration: 'Not available',
          totalDurationMinutes: 0,
          available: false,
          unavailableReason: 'No direct train routes available for this destination',
          segments: []
        },
        {
          mode: 'car',
          totalDuration: 'Not available',
          totalDurationMinutes: 0,
          available: false,
          unavailableReason: 'Driving not possible for international destinations',
          segments: []
        }
      ]
    };

    return fallback;
  }
};
