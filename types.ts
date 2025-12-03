export interface Hospital {
  id: string;
  name: string;
  location: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  specialties: string[];
  rating: number;
  reviewCount: number;
  imageUrl: string; // Keep for backward compat or thumbnail
  images: string[]; // New: Multiple images
  priceRange: string;
  description: string;
  accreditation: string[];
  languages?: string[]; // Supported languages at the hospital
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospitalId: string;
  hospitalName: string;
  hospitalCountry: string;
  imageUrl: string;
  languages: string[];
  experienceYears: number;
  procedures: string[];
  gender: 'Male' | 'Female';
  rating: number;
  reviewCount: number;
}

export interface MedicalPackage {
  id: string;
  title: string;
  category: string; // e.g. "Medical Check-Up"
  hospitalName: string;
  location: string; // e.g. "Penang, Malaysia"
  imageUrl: string;
  price: string; // Formatted price string "Rp 400.000"
  originalPrice?: string; // Optional original price for strikethrough
  discount?: string; // e.g. "30% off"
  validUntil?: string; // e.g. "20/11/2025 - 10/12/2025"
  tags?: string[];
}

export interface Attachment {
  name: string;
  type: string; // MIME type
  data: string; // Base64 string
}

export interface TravelEstimate {
  durationText: string; // e.g., "15 mins"
  distanceText: string; // e.g., "8.2 km"
  durationValue: number; // minutes
  distanceValue: number; // km
  mode: 'driving' | 'flying';
}

export interface Source {
  title: string;
  uri: string;
}

export interface GroundingMetadata {
  webSearchQueries?: string[];
  searchEntryPoint?: {
    renderedContent: string;
  };
  groundingChunks?: {
    web?: {
      uri: string;
      title: string;
    };
  }[];
  groundingSupports?: {
    segment: {
      startIndex?: number;
      endIndex?: number;
      text: string;
    };
    groundingChunkIndices: number[];
    confidenceScores: number[];
  }[];
}

export interface StreamChunk {
  text?: string;
  sources?: Source[];
  searchQueries?: string[];
  isSearching?: boolean;
}

export interface ArtifactData {
  type: 'chart' | 'comparison' | 'table' | 'report';
  title: string;
  data: any; // Flexible payload for different visualizations
}

export interface SuggestedAction {
  label: string;
  intent: string;
  description?: string;
}

export interface FollowUpQuestion {
  question: string;
  context?: string;  // Brief explanation of why this question matters
}

export interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  attachment?: Attachment; // New: For file uploads
  thinking?: string | string[]; // Supports both string and array format
  suggestedFilters?: FilterState;
  isSuggestionApplied?: boolean;
  inlineResults?: Hospital[]; // New: For showing cards inside chat
  inlineResultTotalCount?: number; // New: Total count of matches found, used to show "View X more"
  showConsultationCTA?: boolean; // New: Trigger for WhatsApp button
  suggestedActions?: SuggestedAction[]; // New: Guided action pills
  followUpQuestions?: FollowUpQuestion[]; // New: AI-suggested follow-up questions
  sources?: Source[]; // For Deep Research citations
  searchQueries?: string[]; // For Deep Focus: what queries were searched
  isSearching?: boolean; // For Deep Focus: indicates active web search
  artifact?: ArtifactData; // New: For Canvas/Artifact view
}

export interface FilterState {
  searchQuery: string;
  country?: string; // Deprecated: Single country selection
  countries?: string[]; // New: Multiple country selection
  specialty?: string;
  aiListName?: string;
  // Advanced Filters
  priceRange?: string[]; // e.g. ['$$', '$$$']
  minRating?: number;    // e.g. 4.5
  accreditation?: string[]; // e.g. ['JCI']
  languages?: string[]; // e.g. ['English', 'Mandarin']
  userOrigin?: string; // Text-based origin (e.g. "London")
  userLocation?: { lat: number; lng: number }; // Precise GPS coordinates
  // Sorting
  sortBy?: 'nearest' | 'rating' | 'price_low' | 'price_high'; // Sort option
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number; // timestamp
  lastActiveFilters?: FilterState; // New: Persist filters per session
}

export interface ThinkingResponse {
  thinking: string;
  message: string;
  suggestedFilters?: {
    country?: string;
    specialty?: string;
    aiListName: string;
  };
}

export interface MedicalEntity {
  text: string;
  category: 'Problem' | 'Treatment' | 'Test' | 'Anatomy' | 'Drug';
  confidenceScore?: number;
}

export interface CountryOption {
  id: string;
  name: string;
  description: string;
  icon?: string;
}