
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

export interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  attachment?: Attachment; // New: For file uploads
  thinking?: string[]; 
  suggestedFilters?: FilterState; 
  isSuggestionApplied?: boolean; 
  inlineResults?: Hospital[]; // New: For showing cards inside chat
  inlineResultTotalCount?: number; // New: Total count of matches found, used to show "View X more"
  showConsultationCTA?: boolean; // New: Trigger for WhatsApp button
  sources?: Source[]; // New: For Deep Research citations
}

export interface FilterState {
  searchQuery: string;
  country?: string;
  specialty?: string;
  aiListName?: string;
  // Advanced Filters
  priceRange?: string[]; // e.g. ['$$', '$$$']
  minRating?: number;    // e.g. 4.5
  accreditation?: string[]; // e.g. ['JCI']
  userOrigin?: string; // Text-based origin (e.g. "London")
  userLocation?: { lat: number; lng: number }; // Precise GPS coordinates
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number; // timestamp
  lastActiveFilters?: FilterState; // New: Persist filters per session
}

export interface ThinkingResponse {
  thinking: string[];
  message: string;
  suggestedFilters?: {
    country?: string;
    specialty?: string;
    aiListName: string;
  };
}
