
import { Hospital } from './types';

export const createSlug = (name: string) => {
  return name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

export const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  // Asia
  'london': { lat: 51.5074, lng: -0.1278 },
  'singapore': { lat: 1.3521, lng: 103.8198 },
  'bangkok': { lat: 13.7563, lng: 100.5018 },
  'jakarta': { lat: -6.2088, lng: 106.8456 },
  'kuala lumpur': { lat: 3.1390, lng: 101.6869 },
  'seoul': { lat: 37.5665, lng: 126.9780 },
  'tokyo': { lat: 35.6762, lng: 139.6503 },
  'hong kong': { lat: 22.3193, lng: 114.1694 },
  'mumbai': { lat: 19.0760, lng: 72.8777 },
  'delhi': { lat: 28.6139, lng: 77.2090 },
  'beijing': { lat: 39.9042, lng: 116.4074 },
  'shanghai': { lat: 31.2304, lng: 121.4737 },
  'manila': { lat: 14.5995, lng: 120.9842 },
  'ho chi minh': { lat: 10.8231, lng: 106.6297 },
  'taipei': { lat: 25.0330, lng: 121.5654 },
  'dubai': { lat: 25.2048, lng: 55.2708 },
  'istanbul': { lat: 41.0082, lng: 28.9784 },
  'doha': { lat: 25.2854, lng: 51.5310 },
  
  // USA
  'new york': { lat: 40.7128, lng: -74.0060 },
  'nyc': { lat: 40.7128, lng: -74.0060 },
  'los angeles': { lat: 34.0522, lng: -118.2437 },
  'la': { lat: 34.0522, lng: -118.2437 },
  'san francisco': { lat: 37.7749, lng: -122.4194 },
  'sf': { lat: 37.7749, lng: -122.4194 },
  'chicago': { lat: 41.8781, lng: -87.6298 },
  'houston': { lat: 29.7604, lng: -95.3698 },
  'mía': { lat: 25.7617, lng: -80.1918 },
  'miami': { lat: 25.7617, lng: -80.1918 },
  'seattle': { lat: 47.6062, lng: -122.3321 },
  
  // Europe
  'paris': { lat: 48.8566, lng: 2.3522 },
  'berlin': { lat: 52.5200, lng: 13.4050 },
  'amsterdam': { lat: 52.3676, lng: 4.9041 },
  'madrid': { lat: 40.4168, lng: -3.7038 },
  'rome': { lat: 41.9028, lng: 12.4964 },
  'zurich': { lat: 47.3769, lng: 8.5417 },
  
  // Australia/NZ
  'sydney': { lat: -33.8688, lng: 151.2093 },
  'melbourne': { lat: -37.8136, lng: 144.9631 },
  'perth': { lat: -31.9505, lng: 115.8605 },
  'auckland': { lat: -36.8485, lng: 174.7633 },
};

export const getCoordinatesForCity = (city: string) => {
    if (!city) return null;
    const key = city.toLowerCase().trim();
    if (CITY_COORDINATES[key]) return CITY_COORDINATES[key];
    // Partial match attempt
    const found = Object.keys(CITY_COORDINATES).find(k => key.includes(k) || k.includes(key));
    return found ? CITY_COORDINATES[found] : null;
};

export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; 
  return d; // Return precise float
};

export const HOSPITALS: Hospital[] = [
  {
    id: '1',
    name: 'Bumrungrad International Hospital',
    location: 'Bangkok',
    country: 'Thailand',
    coordinates: { lat: 13.7463, lng: 100.5525 },
    specialties: ['Cardiology', 'Orthopedics', 'Oncology', 'Check-up'],
    rating: 4.9,
    reviewCount: 1250,
    imageUrl: 'https://picsum.photos/800/600?random=1',
    images: [
        'https://picsum.photos/800/600?random=1',
        'https://picsum.photos/800/600?random=101',
        'https://picsum.photos/800/600?random=102',
        'https://picsum.photos/800/600?random=103',
        'https://picsum.photos/800/600?random=104',
    ],
    priceRange: '$$$',
    description: 'World-class multi-specialty hospital known for medical tourism and advanced technology.',
    accreditation: ['JCI', 'GHA'],
  },
  {
    id: '2',
    name: 'Mount Elizabeth Hospital',
    location: 'Orchard',
    country: 'Singapore',
    coordinates: { lat: 1.3048, lng: 103.8353 },
    specialties: ['Neurology', 'Cardiology', 'Oncology'],
    rating: 4.8,
    reviewCount: 980,
    imageUrl: 'https://picsum.photos/800/600?random=2',
    images: [
        'https://picsum.photos/800/600?random=2',
        'https://picsum.photos/800/600?random=201',
        'https://picsum.photos/800/600?random=202',
        'https://picsum.photos/800/600?random=203',
        'https://picsum.photos/800/600?random=204',
    ],
    priceRange: '$$$$',
    description: 'Premier private hospital in Asia, renowned for its depth of expertise in complex surgeries.',
    accreditation: ['JCI'],
  },
  {
    id: '3',
    name: 'Sunway Medical Centre',
    location: 'Kuala Lumpur',
    country: 'Malaysia',
    coordinates: { lat: 3.0684, lng: 101.6044 },
    specialties: ['Fertility', 'Orthopedics', 'Pediatrics'],
    rating: 4.7,
    reviewCount: 850,
    imageUrl: 'https://picsum.photos/800/600?random=3',
    images: [
        'https://picsum.photos/800/600?random=3',
        'https://picsum.photos/800/600?random=301',
        'https://picsum.photos/800/600?random=302',
        'https://picsum.photos/800/600?random=303',
        'https://picsum.photos/800/600?random=304',
    ],
    priceRange: '$$',
    description: 'Leading private quaternary hospital in Malaysia offering comprehensive medical services.',
    accreditation: ['ACHS', 'MSQH'],
  },
  {
    id: '4',
    name: 'Siloam Hospitals Lippo Village',
    location: 'Tangerang',
    country: 'Indonesia',
    coordinates: { lat: -6.2267, lng: 106.6079 },
    specialties: ['Cardiology', 'Neurology', 'Orthopedics'],
    rating: 4.6,
    reviewCount: 2100,
    imageUrl: 'https://picsum.photos/800/600?random=4',
    images: [
        'https://picsum.photos/800/600?random=4',
        'https://picsum.photos/800/600?random=401',
        'https://picsum.photos/800/600?random=402',
        'https://picsum.photos/800/600?random=403',
        'https://picsum.photos/800/600?random=404',
    ],
    priceRange: '$$',
    description: 'First JCI accredited hospital in Indonesia, specializing in neuroscience and cardiology.',
    accreditation: ['JCI', 'KARS'],
  },
  {
    id: '5',
    name: 'Asan Medical Center',
    location: 'Seoul',
    country: 'South Korea',
    coordinates: { lat: 37.5266, lng: 127.1093 },
    specialties: ['Oncology', 'Transplant', 'Cardiology'],
    rating: 4.9,
    reviewCount: 3400,
    imageUrl: 'https://picsum.photos/800/600?random=5',
    images: [
        'https://picsum.photos/800/600?random=5',
        'https://picsum.photos/800/600?random=501',
        'https://picsum.photos/800/600?random=502',
        'https://picsum.photos/800/600?random=503',
        'https://picsum.photos/800/600?random=504',
    ],
    priceRange: '$$$',
    description: 'Korea’s largest hospital, leading in organ transplantation and cancer treatment.',
    accreditation: ['JCI'],
  },
  {
    id: '6',
    name: 'RSU Bunda Jakarta',
    location: 'Jakarta',
    country: 'Indonesia',
    coordinates: { lat: -6.1908, lng: 106.8396 },
    specialties: ['Fertility', 'Maternity', 'Pediatrics'],
    rating: 4.7,
    reviewCount: 1500,
    imageUrl: 'https://picsum.photos/800/600?random=6',
    images: [
        'https://picsum.photos/800/600?random=6',
        'https://picsum.photos/800/600?random=601',
        'https://picsum.photos/800/600?random=602',
        'https://picsum.photos/800/600?random=603',
        'https://picsum.photos/800/600?random=604',
    ],
    priceRange: '$$',
    description: 'A leading hospital in Jakarta focusing on mother and child care and fertility technologies.',
    accreditation: ['KARS'],
  },
  {
    id: '7',
    name: 'Penang Adventist Hospital',
    location: 'Penang',
    country: 'Malaysia',
    coordinates: { lat: 5.4307, lng: 100.3025 },
    specialties: ['Cardiology', 'Oncology', 'Wellness'],
    rating: 4.6,
    reviewCount: 700,
    imageUrl: 'https://picsum.photos/800/600?random=7',
    images: [
        'https://picsum.photos/800/600?random=7',
        'https://picsum.photos/800/600?random=701',
        'https://picsum.photos/800/600?random=702',
        'https://picsum.photos/800/600?random=703',
        'https://picsum.photos/800/600?random=704',
    ],
    priceRange: '$$',
    description: 'Not-for-profit hospital known for heart health and wellness programs.',
    accreditation: ['JCI', 'MSQH'],
  },
  {
    id: '8',
    name: 'Prince Court Medical Centre',
    location: 'Kuala Lumpur',
    country: 'Malaysia',
    coordinates: { lat: 3.1495, lng: 101.7208 },
    specialties: ['Cardiology', 'Oncology', 'Orthopedics'],
    rating: 4.8,
    reviewCount: 1100,
    imageUrl: 'https://picsum.photos/800/600?random=8',
    images: [
        'https://picsum.photos/800/600?random=8',
        'https://picsum.photos/800/600?random=801',
    ],
    priceRange: '$$$',
    description: 'A luxurious private hospital offering premium care and personalized medical services.',
    accreditation: ['MTQVA', 'MSQH'],
  },
  {
    id: '9',
    name: 'Severance Hospital',
    location: 'Seoul',
    country: 'South Korea',
    coordinates: { lat: 37.5619, lng: 126.9416 },
    specialties: ['Cardiology', 'Neurology', 'Oncology'],
    rating: 4.8,
    reviewCount: 2200,
    imageUrl: 'https://picsum.photos/800/600?random=9',
    images: [
        'https://picsum.photos/800/600?random=9',
        'https://picsum.photos/800/600?random=901',
    ],
    priceRange: '$$$',
    description: 'One of the oldest and most prestigious university hospitals in Korea.',
    accreditation: ['JCI'],
  },
  {
    id: '10',
    name: 'Gleneagles Hospital',
    location: 'Napier',
    country: 'Singapore',
    coordinates: { lat: 1.3069, lng: 103.8198 },
    specialties: ['Cardiology', 'Transplant', 'Orthopedics'],
    rating: 4.7,
    reviewCount: 950,
    imageUrl: 'https://picsum.photos/800/600?random=10',
    images: [
        'https://picsum.photos/800/600?random=10',
        'https://picsum.photos/800/600?random=1001',
    ],
    priceRange: '$$$$',
    description: 'Private hospital providing a wide range of medical and surgical services.',
    accreditation: ['JCI'],
  },
  {
    id: '11',
    name: 'Memorial Sisli Hospital',
    location: 'Istanbul',
    country: 'Turkey',
    coordinates: { lat: 41.0602, lng: 28.9877 },
    specialties: ['Cardiology', 'Oncology', 'Neurology', 'IVF'],
    rating: 4.8,
    reviewCount: 1600,
    imageUrl: 'https://picsum.photos/800/600?random=11',
    images: ['https://picsum.photos/800/600?random=11', 'https://picsum.photos/800/600?random=1101'],
    priceRange: '$$',
    description: 'JCI accredited hospital known for its excellent cardiac care and organ transplantation center.',
    accreditation: ['JCI'],
  },
  {
    id: '12',
    name: 'American Hospital',
    location: 'Istanbul',
    country: 'Turkey',
    coordinates: { lat: 41.0494, lng: 28.9928 },
    specialties: ['Cardiology', 'Orthopedics', 'Check-up'],
    rating: 4.7,
    reviewCount: 900,
    imageUrl: 'https://picsum.photos/800/600?random=12',
    images: ['https://picsum.photos/800/600?random=12', 'https://picsum.photos/800/600?random=1201'],
    priceRange: '$$$',
    description: 'One of the oldest and most respected private hospitals in Turkey offering comprehensive healthcare.',
    accreditation: ['JCI'],
  },
  {
    id: '13',
    name: 'Hospital Angeles Pedregal',
    location: 'Mexico City',
    country: 'Mexico',
    coordinates: { lat: 19.3142, lng: -99.2198 },
    specialties: ['Cardiology', 'Oncology', 'Orthopedics'],
    rating: 4.6,
    reviewCount: 550,
    imageUrl: 'https://picsum.photos/800/600?random=13',
    images: ['https://picsum.photos/800/600?random=13', 'https://picsum.photos/800/600?random=1301'],
    priceRange: '$$',
    description: 'A flagship hospital of the Angeles Health System, renowned for its specialized heart center.',
    accreditation: ['JCI', 'CSG'],
  },
  {
    id: '14',
    name: 'Samsung Medical Center',
    location: 'Seoul',
    country: 'South Korea',
    coordinates: { lat: 37.4882, lng: 127.0853 },
    specialties: ['Oncology', 'Cardiology', 'Neurology'],
    rating: 4.9,
    reviewCount: 2800,
    imageUrl: 'https://picsum.photos/800/600?random=14',
    images: ['https://picsum.photos/800/600?random=14', 'https://picsum.photos/800/600?random=1401'],
    priceRange: '$$$',
    description: 'A leading hospital in Korea known for its high-tech infrastructure and patient-centered care.',
    accreditation: ['JCI'],
  },
  {
    id: '15',
    name: 'Seoul National University Hospital',
    location: 'Seoul',
    country: 'South Korea',
    coordinates: { lat: 37.5796, lng: 126.9990 },
    specialties: ['Cardiology', 'Pediatrics', 'Oncology'],
    rating: 4.8,
    reviewCount: 3100,
    imageUrl: 'https://picsum.photos/800/600?random=15',
    images: ['https://picsum.photos/800/600?random=15', 'https://picsum.photos/800/600?random=1501'],
    priceRange: '$$$',
    description: 'A prestigious public hospital in Korea with a strong focus on research and complex surgeries.',
    accreditation: ['JCI', 'KAHF'],
  },
  {
    id: '16',
    name: 'Bangkok Hospital',
    location: 'Bangkok',
    country: 'Thailand',
    coordinates: { lat: 13.7490, lng: 100.5835 },
    specialties: ['Cardiology', 'Orthopedics', 'Neurology'],
    rating: 4.7,
    reviewCount: 1450,
    imageUrl: 'https://picsum.photos/800/600?random=16',
    images: ['https://picsum.photos/800/600?random=16', 'https://picsum.photos/800/600?random=1601'],
    priceRange: '$$$',
    description: 'Flagship of the Bangkok Dusit Medical Services, offering specialized heart and cancer centers.',
    accreditation: ['JCI'],
  },
  {
    id: '17',
    name: 'Samitivej Sukhumvit Hospital',
    location: 'Bangkok',
    country: 'Thailand',
    coordinates: { lat: 13.7371, lng: 100.5746 },
    specialties: ['Pediatrics', 'Cardiology', 'Wellness'],
    rating: 4.8,
    reviewCount: 1100,
    imageUrl: 'https://picsum.photos/800/600?random=17',
    images: ['https://picsum.photos/800/600?random=17', 'https://picsum.photos/800/600?random=1701'],
    priceRange: '$$$',
    description: 'Award-winning hospital known for its pediatric care and comprehensive wellness programs.',
    accreditation: ['JCI'],
  },
  {
    id: '18',
    name: 'Pantai Hospital Kuala Lumpur',
    location: 'Kuala Lumpur',
    country: 'Malaysia',
    coordinates: { lat: 3.1077, lng: 101.6669 },
    specialties: ['Cardiology', 'Oncology', 'Neurosurgery'],
    rating: 4.6,
    reviewCount: 800,
    imageUrl: 'https://picsum.photos/800/600?random=18',
    images: ['https://picsum.photos/800/600?random=18', 'https://picsum.photos/800/600?random=1801'],
    priceRange: '$$',
    description: 'A premier private hospital in KL with a dedicated Heart Centre and Cancer Centre.',
    accreditation: ['JCI', 'MSQH'],
  },
  {
    id: '19',
    name: 'Farrer Park Hospital',
    location: 'Farrer Park',
    country: 'Singapore',
    coordinates: { lat: 1.3122, lng: 103.8546 },
    specialties: ['Cardiology', 'Orthopedics', 'Gastroenterology'],
    rating: 4.7,
    reviewCount: 650,
    imageUrl: 'https://picsum.photos/800/600?random=19',
    images: ['https://picsum.photos/800/600?random=19', 'https://picsum.photos/800/600?random=1901'],
    priceRange: '$$$$',
    description: 'A private tertiary healthcare institute designed for patients seeking comfort and premium care.',
    accreditation: ['JCI'],
  },
  {
    id: '20',
    name: 'Raffles Hospital',
    location: 'Bugis',
    country: 'Singapore',
    coordinates: { lat: 1.3009, lng: 103.8584 },
    specialties: ['Cardiology', 'Oncology', 'Traditional Chinese Medicine'],
    rating: 4.6,
    reviewCount: 920,
    imageUrl: 'https://picsum.photos/800/600?random=20',
    images: ['https://picsum.photos/800/600?random=20', 'https://picsum.photos/800/600?random=2001'],
    priceRange: '$$$',
    description: 'Flagship hospital of the Raffles Medical Group, located in the heart of Singapore.',
    accreditation: ['JCI'],
  },
];

export const SYSTEM_INSTRUCTION = `
You are Dr. Aria, the Senior Medical Concierge and AI health consultant for medifly.ai.
Your purpose is to guide users through complex global healthcare decisions with clinical precision and deep empathy.

CORE PERSONA:
- **Role**: Senior Medical Concierge (MD equivalent knowledge).
- **Tone**: Professional, Calm, Evidence-Based, Empathetic.
- **Methodology**: You never guess. You reason like a clinician before you speak as a concierge. You consider **Logistics** (Travel distance & connectivity) as a key vital sign for medical travel.

DOCUMENT ANALYSIS PROTOCOL (Strict & Non-Negotiable):
1. **Tier 1 (Low-Risk/Public)**: Research papers, medication lists, typed notes, pamphlets. -> **PROCESS**: Analyze and explain.
2. **Tier 2 (Personal Health Records)**: Lab results (blood, urine), discharge summaries, referral letters, written radiology reports (text only). -> **PROCESS**: Analyze to personalize recommendations. Redact specific names in your internal thought process.
3. **Tier 3 (High-Risk/Banned)**: Raw Diagnostic Images (X-rays, CTs, MRIs, Ultrasounds, photos of skin conditions/wounds). -> **REJECT IMMEDIATELY**: Do not attempt to interpret. State: "I cannot interpret raw diagnostic images or photos of physical conditions for safety reasons. Please upload the radiologist's written report instead."
4. **Non-Medical**: Tax forms, menus, selfies, scenery, random documents. -> **REJECT WARMLY**: "I can only analyze medical documentation to help guide your healthcare journey. This document appears unrelated."

RESPONSE PROCESS (Must be followed strictly):

1. **Clinical Reasoning Phase** (Inside <thinking> tags):
   - You MUST start your response with <thinking> and end this section with </thinking>.
   - Do NOT output any text before the <thinking> tag.
   - Output 4-5 numbered steps.
   - **CRITICAL FORMATTING**: Start each step with the specific format: "1. **Step Title**: Content".
   
   REQUIRED STEPS:
   1. **Document Triage** (If file attached): Explicitly classify the document. Is it Tier 1, 2, or 3? Is it Medical? If Tier 3 or Non-Medical, set next steps to rejection.
   2. **Clinical Triage**: Assess intent and urgency.
   3. **Knowledge Retrieval**: Access knowledge about specialists/hospitals.
   4. **Logistics & Proximity**: (CRITICAL) If user provides a 'Fly From' location, estimate flight times to potential medical hubs.
   5. **Concierge Strategy**: Formulate the recommendation.

2. **Patient Response Phase** (After </thinking> tag):
   - If rejecting a document: Be warm, professional, and clear about *why* (safety/scope).
   - If accepting: Provide your response. Be warm but professional.
   - Use Markdown for clarity.
   - If a 'Fly From' location was provided, explicitly mention estimated flight times.

3. **CTA / Consultation Trigger (IMPORTANT)**:
   - If the user explicitly asks for **pricing/costs**, asks for a **booking/appointment**, requests a **second opinion**, expresses **anxiety/confusion** about their condition, or asks for complex **logistical help**, you MUST include a specific tag at the very end of your response.
   - **Output**: <cta>true</cta>
   - Place this tag AFTER your markdown text and BEFORE the filters tag.

4. **Marketplace Action Phase** (Optional):
   - If you can narrow down hospitals based on the user's request, you MUST output a <filters> JSON block at the very end of your response.
   - **CRITICAL**: The JSON must be RAW text wrapped in <filters> tags. 
   - **DO NOT USE MARKDOWN CODE BLOCKS** (e.g. do NOT use \`\`\`json). 
   - JUST <filters>{ ... }</filters>.
   - The JSON must be valid and strictly follow this structure:
     {
       "country": "Thailand" | "Malaysia" | "Singapore" | "South Korea" | "Indonesia" | "Turkey" | "Mexico" | null,
       "specialty": "Cardiology" | "Orthopedics" | "Oncology" | "Fertility" | "Neurology" | "Pediatrics" | "Wellness" | "Check-up" | null,
       "aiListName": "Short, Punchy Title (e.g., 'Bangkok Heart Centers')"
     }
   - **IMPORTANT**: If "country" is null, "aiListName" should be global (e.g., "Global Heart Centers").

SCENARIO RULES:
- REGIONS: Indonesia, Singapore, Malaysia, Thailand, South Korea, Japan, Turkey, Mexico.
- SPECIALTIES: Cardiology, Orthopedics, Oncology, Fertility, Neurology, Pediatrics, Wellness, Check-up, Plastic Surgery, Dental.
- NEVER provide a definitive medical diagnosis. Always suggest consulting a specialist.
`;
