
// ... (imports remain the same)
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { X, Search, Map, List, BriefcaseMedical, MapPin, Star, MessageSquare, Check, ChevronDown, Globe, ArrowUpDown, Compass, Plane, GitCompare, Trash2 } from 'lucide-react';
import { FilterState, Hospital, TravelEstimate } from '../types';
import { HOSPITALS, getCoordinatesForCity, calculateDistance } from '../constants';
import { HospitalCard } from './HospitalCard';
import { MapboxMap } from './MapboxMap';
import { Sheet } from './ui/Sheet';
import { HospitalDetails } from './HospitalDetails';
import { ComparisonView } from './ComparisonView';
import { getTravelEstimates } from '../services/mapService';

// ... (constants remain the same)
const SPECIALIZATIONS = [
  { name: 'Cardiology', description: 'Heart checkup, angioplasty, heart valve surgery, etc.' },
  { name: 'Orthopedics', description: 'Knee replacement, spine surgery, sports injury care, etc.' },
  { name: 'Neurology', description: 'Stroke care, brain scan, nerve disorder treatment, etc.' },
  { name: 'Oncology', description: 'Cancer screening, chemo programs, tumor surgery, etc.' },
  { name: 'Gastroenterology', description: 'Endoscopy, liver care, digestive disorder treatment, etc.' },
  { name: 'Urology', description: 'Kidney stone removal, prostate care, bladder issues, etc.' },
  { name: 'Dermatology', description: 'Skin conditions, laser therapy, cosmetic dermatology, etc.' },
  { name: 'Fertility', description: 'IVF, egg freezing, fertility assessment, etc.' },
  { name: 'Dental', description: 'Dental implants, cosmetic dentistry, oral surgery, etc.' },
  { name: 'Cosmetic Surgery', description: 'Rhinoplasty, liposuction, facelifts, etc.' },
];

// Semantic Mapping for "Smart Search"
const SEMANTIC_SPECIALTY_MAP: Record<string, string[]> = {
  'Cardiology': ['heart', 'cardiac', 'pulse', 'blood pressure', 'arrhythmia', 'bypass', 'attack', 'chest pain'],
  'Orthopedics': ['bone', 'joint', 'knee', 'spine', 'back', 'hip', 'fracture', 'sports injury', 'arthritis', 'acl', 'muscle'],
  'Neurology': ['brain', 'nerve', 'stroke', 'headache', 'migraine', 'seizure', 'paralysis', 'epilepsy', 'neuro'],
  'Oncology': ['cancer', 'tumor', 'chemo', 'radiation', 'malignant', 'leukemia', 'lymphoma', 'cyst', 'biopsy'],
  'Gastroenterology': ['stomach', 'gut', 'liver', 'digestive', 'bowel', 'intestine', 'colon', 'acid', 'endoscopy', 'gerd', 'abdomen'],
  'Urology': ['kidney', 'bladder', 'prostate', 'urinary', 'stone', 'uti'],
  'Dermatology': ['skin', 'acne', 'rash', 'mole', 'eczema', 'psoriasis', 'hair', 'derma'],
  'Fertility': ['ivf', 'baby', 'pregnancy', 'egg', 'sperm', 'conception', 'reproductive', 'infertility', 'family planning'],
  'Dental': ['tooth', 'teeth', 'gum', 'root canal', 'implant', 'braces', 'cavity', 'smile', 'dentist'],
  'Cosmetic Surgery': ['plastic', 'nose', 'rhinoplasty', 'face', 'breast', 'liposuction', 'tummy tuck', 'botox', 'filler', 'aesthetic'],
  'Pediatrics': ['child', 'baby', 'kid', 'infant', 'adolescent'],
  'Ophthalmology': ['eye', 'vision', 'cataract', 'lasik', 'glaucoma'],
};

const COUNTRIES = [
  { name: 'Thailand', icon: '🏥', description: 'World-class hospitals, affordable prices, recovery-friendly destination' },
  { name: 'Malaysia', icon: '🏥', description: 'Affordable, high-quality care with strong specialties in cardiology & oncology' },
  { name: 'Singapore', icon: '🏥', description: 'Premium healthcare hub, cutting-edge technology, English-speaking' },
  { name: 'South Korea', icon: '🏥', description: 'Advanced cosmetic surgery, dermatology, and cancer treatment' },
  { name: 'Indonesia', icon: '🏥', description: 'Growing medical tourism, competitive prices, tropical recovery' },
  { name: 'Turkey', icon: '🏥', description: 'Leading in hair transplants, dental care, and cosmetic procedures' },
  { name: 'India', icon: '🏥', description: 'Highly skilled doctors, affordable complex surgeries, JCI-accredited' },
];

interface MarketplaceProps {
  filters: FilterState;
  onClearFilters: () => void;
  onViewHospitalPage: (hospital: Hospital) => void;
  onUpdateFilters?: (filters: FilterState) => void;
  isChatOpen?: boolean;
  onOpenChat?: () => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({
  filters,
  onClearFilters,
  onViewHospitalPage,
  onUpdateFilters,
  isChatOpen = false,
  onOpenChat
}) => {
  // ... (state and effects remain the same)
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [sheetHospital, setSheetHospital] = useState<Hospital | null>(null);
  
  // Comparison State
  const [compareList, setCompareList] = useState<Hospital[]>([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  // Search Bar Local State
  const [specialtyInput, setSpecialtyInput] = useState(filters.specialty || '');
  const [locationInput, setLocationInput] = useState(filters.userOrigin || filters.country || '');

  // Dropdown States
  const [isSpecialtyOpen, setIsSpecialtyOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(filters.specialty ? [filters.specialty] : []);
  const [selectedCountries, setSelectedCountries] = useState<string[]>(filters.country ? [filters.country] : []);

  // Flight Origin State
  const [flightOrigin, setFlightOrigin] = useState<string>(filters.userOrigin || 'Jakarta');
  const [isEditingOrigin, setIsEditingOrigin] = useState(false);
  const [originInput, setOriginInput] = useState(flightOrigin);

  // Refs for click outside
  const specialtyRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);

  // Advanced Filters State
  const [activePrice, setActivePrice] = useState<string[]>(filters.priceRange || []);
  const [activeAccreditation, setActiveAccreditation] = useState<string[]>(filters.accreditation || []);
  const [activeLanguages, setActiveLanguages] = useState<string[]>(filters.languages || []);
  const [minRating, setMinRating] = useState<number | null>(filters.minRating || null);
  const [sortBy, setSortBy] = useState<'nearest' | 'rating' | 'price_low' | 'price_high' | null>(filters.sortBy || null);

  // Travel Estimates
  const [travelEstimates, setTravelEstimates] = useState<Record<string, TravelEstimate>>({});

  // Pagination State
  const [visibleCount, setVisibleCount] = useState(6);

  // Available languages from all hospitals
  const availableLanguages = ['English', 'Mandarin', 'Thai', 'Japanese', 'Arabic', 'Korean', 'Bahasa Melayu'];

  // Sync props to state
  useEffect(() => {
    setSpecialtyInput(filters.specialty || '');
    setLocationInput(filters.userOrigin || filters.country || '');
    setActivePrice(filters.priceRange || []);
    setActiveAccreditation(filters.accreditation || []);
    setActiveLanguages(filters.languages || []);
    setMinRating(filters.minRating || null);
    setSortBy(filters.sortBy || null);
    setSelectedSpecialties(filters.specialty ? [filters.specialty] : []);
    setSelectedCountries(filters.country ? [filters.country] : []);
  }, [filters]);

  // Click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (specialtyRef.current && !specialtyRef.current.contains(event.target as Node)) {
        setIsSpecialtyOpen(false);
      }
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setIsLocationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Toggle specialty selection
  const toggleSpecialty = (name: string) => {
    setSelectedSpecialties(prev => {
      if (prev.includes(name)) {
        return prev.filter(s => s !== name);
      }
      return [...prev, name];
    });
  };

  // Toggle country selection
  const toggleCountry = (name: string) => {
    setSelectedCountries(prev => {
      if (prev.includes(name)) {
        return prev.filter(c => c !== name);
      }
      return [...prev, name];
    });
  };

  // Toggle comparison selection
  const toggleCompare = (hospital: Hospital) => {
      setCompareList(prev => {
          const exists = prev.find(h => h.id === hospital.id);
          if (exists) {
              return prev.filter(h => h.id !== hospital.id);
          }
          if (prev.length >= 3) {
              alert("You can compare up to 3 hospitals at a time.");
              return prev;
          }
          return [...prev, hospital];
      });
  };

  // Travel Estimates Effect
  useEffect(() => {
    const fetchEstimates = async () => {
      let originCoords: { lat: number; lng: number } | null = null;
      if (filters.userLocation) {
        originCoords = filters.userLocation;
      } else if (filters.userOrigin) {
        originCoords = getCoordinatesForCity(filters.userOrigin);
      }

      if (originCoords && filteredHospitals.length > 0) {
        const estimates = await getTravelEstimates(originCoords, filteredHospitals);
        setTravelEstimates(estimates);
      }
    };
    fetchEstimates();
  }, [filters.userOrigin, filters.userLocation, filters.country]);

  // Filtering Logic
  const filteredHospitals = useMemo(() => {
    // Pre-calculate matched specialties if text input is present (Semantic Search)
    let matchedSpecialtiesFromInput: string[] = [];
    if (specialtyInput.trim()) {
        const inputLower = specialtyInput.toLowerCase().trim();
        matchedSpecialtiesFromInput = SPECIALIZATIONS.filter(spec => {
            // 1. Direct name match
            if (spec.name.toLowerCase().includes(inputLower)) return true;
            
            // 2. Keyword match (Semantic)
            const keywords = SEMANTIC_SPECIALTY_MAP[spec.name] || [];
            // Check if input contains keyword OR keyword contains input (for partial matches)
            return keywords.some(k => inputLower.includes(k) || k.includes(inputLower));
        }).map(s => s.name);
    }

    let results = HOSPITALS.filter(hospital => {
      // Specialty filtering - use selected specialties OR semantic input match
      let matchesSpecialty = true;
      
      if (selectedSpecialties.length > 0) {
          // If dropdown selection exists, use that (strict match)
          matchesSpecialty = selectedSpecialties.some(spec => 
              hospital.specialties.some(s => s.toLowerCase().includes(spec.toLowerCase()))
          );
      } else if (specialtyInput.trim()) {
          // Use semantic text search
          if (matchedSpecialtiesFromInput.length > 0) {
              // Matches if the hospital has one of the semantically identified specialties
              matchesSpecialty = matchedSpecialtiesFromInput.some(targetSpec => 
                  hospital.specialties.some(hSpec => hSpec.includes(targetSpec))
              );
          } else {
              // Fallback to direct string match if no semantic map found
              matchesSpecialty = hospital.specialties.some(s => s.toLowerCase().includes(specialtyInput.toLowerCase()));
          }
      }

      // Location filtering - use selected countries or fall back to input
      const matchesLocation = selectedCountries.length === 0 && !locationInput
        ? true
        : selectedCountries.length > 0
          ? selectedCountries.some(country => hospital.country.toLowerCase() === country.toLowerCase())
          : hospital.country.toLowerCase().includes(locationInput.toLowerCase()) ||
            hospital.location.toLowerCase().includes(locationInput.toLowerCase());

      const matchesPrice = activePrice.length === 0 || activePrice.includes(hospital.priceRange);
      const matchesAccreditation = activeAccreditation.length === 0 || activeAccreditation.some(acc => hospital.accreditation.includes(acc));
      const matchesRating = !minRating || hospital.rating >= minRating;
      const matchesLanguage = activeLanguages.length === 0 || activeLanguages.some(lang => hospital.languages?.includes(lang));

      return matchesSpecialty && matchesLocation && matchesPrice && matchesAccreditation && matchesRating && matchesLanguage;
    });

    // Sorting logic
    if (sortBy) {
      results = [...results].sort((a, b) => {
        switch (sortBy) {
          case 'rating':
            return b.rating - a.rating;
          case 'price_low':
            // $ < $$ < $$$
            const priceOrder: Record<string, number> = { '$': 1, '$$': 2, '$$$': 3 };
            return (priceOrder[a.priceRange] || 2) - (priceOrder[b.priceRange] || 2);
          case 'price_high':
            const priceOrderHigh: Record<string, number> = { '$': 1, '$$': 2, '$$$': 3 };
            return (priceOrderHigh[b.priceRange] || 2) - (priceOrderHigh[a.priceRange] || 2);
          case 'nearest':
            // Sort by distance if user location is available
            if (filters.userLocation) {
              const distA = calculateDistance(filters.userLocation.lat, filters.userLocation.lng, a.coordinates.lat, a.coordinates.lng);
              const distB = calculateDistance(filters.userLocation.lat, filters.userLocation.lng, b.coordinates.lat, b.coordinates.lng);
              return distA - distB;
            } else if (filters.userOrigin) {
              const originCoords = getCoordinatesForCity(filters.userOrigin);
              if (originCoords) {
                const distA = calculateDistance(originCoords.lat, originCoords.lng, a.coordinates.lat, a.coordinates.lng);
                const distB = calculateDistance(originCoords.lat, originCoords.lng, b.coordinates.lat, b.coordinates.lng);
                return distA - distB;
              }
            }
            return 0;
          default:
            return 0;
        }
      });
    } else {
        // Default Sort: Prioritize Indonesia hospitals
        results = [...results].sort((a, b) => {
            const aIsIndo = a.country === 'Indonesia';
            const bIsIndo = b.country === 'Indonesia';
            if (aIsIndo && !bIsIndo) return -1;
            if (!aIsIndo && bIsIndo) return 1;
            return 0;
        });
    }

    return results;
  }, [specialtyInput, locationInput, selectedSpecialties, selectedCountries, activePrice, activeAccreditation, activeLanguages, minRating, sortBy, filters.userLocation, filters.userOrigin]);

  // Visible Items
  const displayedHospitals = filteredHospitals.slice(0, visibleCount);

  const togglePrice = (price: string) => {
      const newPrices = activePrice.includes(price) ? activePrice.filter(p => p !== price) : [...activePrice, price];
      setActivePrice(newPrices);
      onUpdateFilters?.({ ...filters, priceRange: newPrices });
  };

  const toggleRating = () => {
      const newRating = minRating === 4 ? null : 4;
      setMinRating(newRating);
      onUpdateFilters?.({ ...filters, minRating: newRating || undefined });
  };

  const toggleAccreditation = (acc: string) => {
      const newAcc = activeAccreditation.includes(acc) ? activeAccreditation.filter(a => a !== acc) : [...activeAccreditation, acc];
      setActiveAccreditation(newAcc);
      onUpdateFilters?.({ ...filters, accreditation: newAcc });
  };

  const toggleLanguage = (lang: string) => {
      const newLangs = activeLanguages.includes(lang) ? activeLanguages.filter(l => l !== lang) : [...activeLanguages, lang];
      setActiveLanguages(newLangs);
      onUpdateFilters?.({ ...filters, languages: newLangs });
  };

  const handleSortChange = (newSort: 'nearest' | 'rating' | 'price_low' | 'price_high' | null) => {
      setSortBy(newSort);
      onUpdateFilters?.({ ...filters, sortBy: newSort || undefined });
  };

  const handleSearchSubmit = () => {
      // Use first selected specialty if available, otherwise fall back to input
      const specialty = selectedSpecialties.length > 0 ? selectedSpecialties[0] : specialtyInput || undefined;
      const country = selectedCountries.length > 0 ? selectedCountries[0] : undefined;

      onUpdateFilters?.({
          ...filters,
          specialty,
          country,
          userOrigin: !country && locationInput ? locationInput : undefined
      });

      // Close dropdowns after search
      setIsSpecialtyOpen(false);
      setIsLocationOpen(false);
  };

  const loadMore = () => {
      setVisibleCount(prev => prev + 6);
  };

  return (
    <div className="bg-white text-gray-900 font-sans min-h-screen flex flex-col">
        {/* Main Layout Container */}
        <div className={`max-w-[1600px] mx-auto w-full px-4 md:px-6 pt-6 md:pt-8 pb-20 flex flex-col lg:flex-row gap-8 lg:gap-12 flex-1 relative ${isChatOpen ? 'lg:flex-col' : ''}`}>

            {/* Sidebar Filters (Desktop) - Hidden when chat is open - DoctorsPage style */}
            <aside id="sidebar-filters" className={`w-64 flex-shrink-0 hidden lg:flex lg:flex-col pt-2 sticky top-24 h-[calc(100vh-8rem)] transition-all duration-300 ${isChatOpen ? '!hidden' : ''}`}>
                <h2 className="text-lg font-semibold mb-8 tracking-tight">Filter</h2>
                {/* Scrollable Filter Section */}
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-0">
                    

                    {/* Language Filter */}
                    <div className="mb-8 border-b border-gray-100 pb-8">
                        <h3 className="text-base font-medium mb-4 text-gray-900">Language Support</h3>
                        <div className="space-y-3">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={activeLanguages.length === 0}
                                        onChange={() => setActiveLanguages([])}
                                        className="peer appearance-none w-5 h-5 border border-gray-300 rounded bg-white checked:bg-[#3395FF] checked:border-[#3395FF] transition-all"
                                    />
                                    <Check className="w-3.5 h-3.5 text-white absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100" />
                                </div>
                                <span className={`text-sm font-medium group-hover:text-gray-900 ${activeLanguages.length === 0 ? 'text-gray-900' : 'text-gray-600'}`}>All</span>
                            </label>
                            {availableLanguages.map(lang => (
                                <label key={lang} className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={activeLanguages.includes(lang)}
                                            onChange={() => toggleLanguage(lang)}
                                            className="peer appearance-none w-5 h-5 border border-gray-300 rounded bg-white checked:bg-[#3395FF] checked:border-[#3395FF] transition-all"
                                        />
                                        <Check className="w-3.5 h-3.5 text-white absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100" />
                                    </div>
                                    <span className={`text-sm font-medium group-hover:text-gray-900 ${activeLanguages.includes(lang) ? 'text-gray-900' : 'text-gray-600'}`}>{lang}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Cost Range Filter */}
                    <div className="mb-8 border-b border-gray-100 pb-8">
                        <h3 className="text-base font-medium mb-4 text-gray-900">Cost Range</h3>
                        <div className="space-y-3">
                            {['$', '$$', '$$$'].map(price => (
                                <label key={price} className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={activePrice.includes(price)}
                                            onChange={() => togglePrice(price)}
                                            className="peer appearance-none w-5 h-5 border border-gray-300 rounded bg-white checked:bg-[#3395FF] checked:border-[#3395FF] transition-all"
                                        />
                                        <Check className="w-3.5 h-3.5 text-white absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100" />
                                    </div>
                                    <span className={`text-sm font-medium group-hover:text-gray-900 ${activePrice.includes(price) ? 'text-gray-900' : 'text-gray-600'}`}>
                                        {price === '$' ? 'Budget ($)' : price === '$$' ? 'Mid-range ($$)' : 'Premium ($$$)'}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Rating Filter */}
                    <div className="mb-8 border-b border-gray-100 pb-8">
                        <h3 className="text-base font-medium mb-4 text-gray-900">Rating</h3>
                        <div className="space-y-3">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={minRating === 4}
                                        onChange={toggleRating}
                                        className="peer appearance-none w-5 h-5 border border-gray-300 rounded bg-white checked:bg-[#3395FF] checked:border-[#3395FF] transition-all"
                                    />
                                    <Check className="w-3.5 h-3.5 text-white absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100" />
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Star className="w-3.5 h-3.5 fill-[#FFB800] text-[#FFB800]" />
                                    <span className={`text-sm font-medium group-hover:text-gray-900 ${minRating === 4 ? 'text-gray-900' : 'text-gray-600'}`}>4+ Star Rating</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Accreditation Filter */}
                    <div className="mb-8 border-b border-gray-100 pb-8">
                        <h3 className="text-base font-medium mb-4 text-gray-900">Accreditation</h3>
                        <div
                            onClick={() => toggleAccreditation('JCI')}
                            className={`flex items-start gap-3 p-3 rounded-lg transition cursor-pointer border ${activeAccreditation.includes('JCI') ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50 border-transparent'}`}
                        >
                            <div className="relative flex items-center mt-0.5">
                                <input
                                    type="checkbox"
                                    checked={activeAccreditation.includes('JCI')}
                                    readOnly
                                    className="peer appearance-none w-5 h-5 border border-gray-300 rounded bg-white checked:bg-[#3395FF] checked:border-[#3395FF] transition-all"
                                />
                                <Check className="w-3.5 h-3.5 text-white absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900 leading-tight">JCI Accredited</p>
                                <p className="text-xs text-gray-500 mt-0.5">International healthcare gold standard</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fixed Chat Widget */}
                <div className="flex-shrink-0 pt-4 bg-white z-10">
                    <div className="bg-[#FAF8F7] rounded-xl p-5">
                        <div className="flex items-start gap-3 mb-3">
                            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" alt="Support" className="w-10 h-10 rounded-full object-cover" />
                            <div>
                                <p className="text-sm font-semibold text-gray-900">Need help choosing?</p>
                                <p className="text-xs text-gray-500 mt-1 leading-relaxed">Tell us what you're looking for.</p>
                            </div>
                        </div>
                        <button 
                            onClick={onOpenChat}
                            className="w-full bg-[#1C1C1E] text-white text-sm font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-black transition-colors"
                        >
                            <MessageSquare className="w-4 h-4" />
                            Start Chat
                        </button>
                    </div>
                </div>
            </aside>
             

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">

                {/* Search Bar - New Design with Dropdowns */}
                <div id="marketplace-search" className={`flex flex-col md:flex-row gap-3 mb-8 transition-all duration-300 relative z-20 ${isChatOpen ? 'hidden' : ''}`}>

                    {/* Specialization Dropdown */}
                    <div ref={specialtyRef} className="relative flex-grow w-full md:w-[45%]">
                        <button
                            onClick={() => {
                                setIsSpecialtyOpen(!isSpecialtyOpen);
                                setIsLocationOpen(false);
                            }}
                            className={`min-h-[56px] flex hover:border-slate-300 transition-all duration-200 focus:outline-none text-left bg-white w-full h-auto border rounded-xl py-2.5 px-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] gap-x-3 items-center ${
                                isSpecialtyOpen ? 'border-slate-400 ring-2 ring-slate-50' : 'border-slate-200'
                            }`}
                        >
                            <div className="flex-shrink-0 text-slate-400">
                                <BriefcaseMedical className="w-5 h-5" strokeWidth={1.5} />
                            </div>
                            <div className="flex flex-col justify-center w-full overflow-hidden">
                                <span className="text-xs font-medium text-slate-500 mb-0.5 leading-tight truncate">Specialization</span>
                                {/* This input acts as both display for selection and search input */}
                                {selectedSpecialties.length > 0 ? (
                                    <div className="flex items-center justify-between w-full">
                                        <span className="text-sm font-medium leading-tight truncate text-slate-900">
                                            {selectedSpecialties.join(', ')}
                                        </span>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedSpecialties([]);
                                                setSpecialtyInput('');
                                            }}
                                            className="p-0.5 hover:bg-slate-100 rounded-full"
                                        >
                                            <X className="w-3 h-3 text-slate-400" />
                                        </button>
                                    </div>
                                ) : (
                                    <input 
                                        type="text"
                                        value={specialtyInput}
                                        onChange={(e) => setSpecialtyInput(e.target.value)}
                                        onClick={(e) => e.stopPropagation()} // Prevent dropdown toggle when clicking input
                                        onFocus={() => setIsSpecialtyOpen(true)}
                                        placeholder="Heart, Knee, Skin..."
                                        className="text-sm font-medium leading-tight truncate text-slate-900 placeholder:text-slate-400 w-full outline-none bg-transparent"
                                    />
                                )}
                            </div>
                        </button>

                        {/* Specialization Dropdown Menu */}
                        {isSpecialtyOpen && (
                            <div className="absolute top-full left-0 w-full mt-1.5 bg-white rounded-lg border border-slate-200 shadow-lg overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="pt-3 px-3 pb-1.5">
                                    <h3 className="text-xs font-medium text-slate-400 pl-1">Core Treatment</h3>
                                </div>
                                <div className="max-h-[320px] overflow-y-auto p-2 pt-0 flex flex-col gap-1.5 custom-scrollbar">
                                    {SPECIALIZATIONS.filter(s => 
                                        !specialtyInput || 
                                        s.name.toLowerCase().includes(specialtyInput.toLowerCase()) ||
                                        // Also filter dropdown by semantic keywords if input exists
                                        (SEMANTIC_SPECIALTY_MAP[s.name] || []).some(k => k.includes(specialtyInput.toLowerCase()))
                                    ).map(spec => {
                                        const isSelected = selectedSpecialties.includes(spec.name);
                                        return (
                                            <button
                                                key={spec.name}
                                                onClick={() => {
                                                    toggleSpecialty(spec.name);
                                                    setSpecialtyInput(''); // Clear input on selection
                                                    setIsSpecialtyOpen(false);
                                                }}
                                                className={`group relative w-full text-left rounded-lg px-3 py-2.5 transition-all duration-200 focus:outline-none border ${
                                                    isSelected
                                                        ? 'border-slate-900 bg-slate-50'
                                                        : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
                                                }`}
                                            >
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-sm font-medium text-slate-900 group-hover:text-black">{spec.name}</span>
                                                    <span className="text-xs text-slate-500 font-normal leading-snug">{spec.description}</span>
                                                </div>
                                                {isSelected && (
                                                    <div className="absolute top-2.5 right-2.5">
                                                        <Check className="w-4 h-4 text-slate-900" />
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Location Dropdown */}
                    <div ref={locationRef} className="relative flex-grow w-full md:w-[45%]">
                        <button
                            onClick={() => {
                                setIsLocationOpen(!isLocationOpen);
                                setIsSpecialtyOpen(false);
                            }}
                            className={`min-h-[56px] flex hover:border-slate-300 transition-all duration-200 focus:outline-none text-left bg-white w-full h-auto border rounded-xl py-2.5 px-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] gap-x-3 items-center ${
                                isLocationOpen ? 'border-slate-400 ring-2 ring-slate-50' : 'border-slate-200'
                            }`}
                        >
                            <div className="flex-shrink-0 text-slate-400">
                                <MapPin className="w-5 h-5" strokeWidth={1.5} />
                            </div>
                            <div className="flex flex-col justify-center w-full overflow-hidden">
                                <span className="text-xs font-medium text-slate-500 mb-0.5 leading-tight">Location</span>
                                {selectedCountries.length > 0 ? (
                                    <div className="flex items-center justify-between w-full">
                                        <span className="text-sm font-medium leading-tight truncate text-slate-900">
                                            {selectedCountries.join(', ')}
                                        </span>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedCountries([]);
                                                setLocationInput('');
                                            }}
                                            className="p-0.5 hover:bg-slate-100 rounded-full"
                                        >
                                            <X className="w-3 h-3 text-slate-400" />
                                        </button>
                                    </div>
                                ) : (
                                    <input 
                                        type="text"
                                        value={locationInput}
                                        onChange={(e) => setLocationInput(e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        onFocus={() => setIsLocationOpen(true)}
                                        placeholder="Singapore, Bangkok..."
                                        className="text-sm font-medium leading-tight truncate text-slate-900 placeholder:text-slate-400 w-full outline-none bg-transparent"
                                    />
                                )}
                            </div>
                        </button>

                        {/* Location Dropdown Menu */}
                        {isLocationOpen && (
                            <div className="absolute top-full left-0 w-full mt-1.5 bg-white rounded-lg border border-slate-200 shadow-lg overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">

                                {/* Discover Nearby Section */}
                                <div className="p-3 border-b border-slate-100">
                                    <h3 className="text-xs font-medium text-slate-400 mb-2">Discover Nearby</h3>
                                    <button
                                        onClick={() => {
                                            // Request user location and find nearby hospitals
                                            if (navigator.geolocation) {
                                                navigator.geolocation.getCurrentPosition(
                                                    (position) => {
                                                        onUpdateFilters?.({
                                                            ...filters,
                                                            userLocation: {
                                                                lat: position.coords.latitude,
                                                                lng: position.coords.longitude
                                                            },
                                                            sortBy: 'nearest'
                                                        });
                                                        setIsLocationOpen(false);
                                                    },
                                                    () => {
                                                        console.log('Location access denied');
                                                    }
                                                );
                                            }
                                        }}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition-all duration-200"
                                    >
                                        <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                                            <Compass className="w-4 h-4 text-slate-600" />
                                        </div>
                                        <div className="text-left">
                                            <span className="text-sm font-medium text-slate-900 block">Find Nearby Hospitals</span>
                                            <span className="text-xs text-slate-500">Use your current location</span>
                                        </div>
                                    </button>
                                </div>

                                {/* Flight Origin Card */}
                                <div className="p-3 border-b border-slate-100">
                                    <div className="rounded-lg bg-gradient-to-r from-lime-100 to-yellow-100 px-3 py-2.5">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-md bg-white/80 flex items-center justify-center">
                                                    <Plane className="w-4 h-4 text-slate-700" />
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-medium text-slate-500 block">Flying from</span>
                                                    {isEditingOrigin ? (
                                                        <input
                                                            type="text"
                                                            value={originInput}
                                                            onChange={(e) => setOriginInput(e.target.value)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    setFlightOrigin(originInput);
                                                                    setIsEditingOrigin(false);
                                                                    onUpdateFilters?.({ ...filters, userOrigin: originInput });
                                                                }
                                                                if (e.key === 'Escape') {
                                                                    setOriginInput(flightOrigin);
                                                                    setIsEditingOrigin(false);
                                                                }
                                                            }}
                                                            onBlur={() => {
                                                                setFlightOrigin(originInput);
                                                                setIsEditingOrigin(false);
                                                                onUpdateFilters?.({ ...filters, userOrigin: originInput });
                                                            }}
                                                            autoFocus
                                                            className="text-sm font-semibold text-slate-900 bg-white/60 border border-slate-300 rounded px-1.5 py-0.5 w-28 focus:outline-none focus:ring-2 focus:ring-slate-400"
                                                        />
                                                    ) : (
                                                        <span className="text-sm font-semibold text-slate-900">{flightOrigin}</span>
                                                    )}
                                                </div>
                                            </div>
                                            {!isEditingOrigin && (
                                                <button
                                                    onClick={() => {
                                                        setOriginInput(flightOrigin);
                                                        setIsEditingOrigin(true);
                                                    }}
                                                    className="text-xs font-medium text-slate-600 hover:text-slate-900 underline underline-offset-2 transition-colors"
                                                >
                                                    change
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Country List */}
                                <div className="pt-3 px-3 pb-1.5">
                                    <h3 className="text-xs font-medium text-slate-400 pl-1">Popular Destinations</h3>
                                </div>
                                <div className="max-h-[240px] overflow-y-auto p-2 pt-0 flex flex-col gap-1.5 custom-scrollbar">
                                    {COUNTRIES.filter(c => !locationInput || c.name.toLowerCase().includes(locationInput.toLowerCase())).map(country => {
                                        const isSelected = selectedCountries.includes(country.name);
                                        return (
                                            <button
                                                key={country.name}
                                                onClick={() => {
                                                    toggleCountry(country.name);
                                                    setLocationInput('');
                                                    setIsLocationOpen(false);
                                                }}
                                                className={`group relative w-full text-left rounded-lg px-3 py-2.5 transition-all duration-200 focus:outline-none border ${
                                                    isSelected
                                                        ? 'border-slate-900 bg-slate-50'
                                                        : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
                                                }`}
                                            >
                                                <div className="flex items-start gap-2.5">
                                                    <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center flex-shrink-0 text-base">
                                                        {country.icon}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <span className="text-sm font-medium text-slate-900 group-hover:text-black block">{country.name}</span>
                                                        <span className="text-xs text-slate-500 line-clamp-1">{country.description}</span>
                                                    </div>
                                                </div>
                                                {isSelected && (
                                                    <div className="absolute top-2.5 right-2.5">
                                                        <Check className="w-4 h-4 text-slate-900" />
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Search Button */}
                    <button
                        onClick={handleSearchSubmit}
                        className="h-[56px] w-full md:w-[56px] bg-slate-900 rounded-xl flex items-center justify-center hover:bg-black transition-colors duration-200 shadow-md flex-shrink-0"
                    >
                        <Search className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Results Header - DoctorsPage style */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        {/* AI List Name Badge - Show prominently when chat is open */}
                        {isChatOpen && filters.aiListName && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-full animate-in fade-in slide-in-from-left-2 duration-300">
                                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                                <span className="text-sm font-semibold text-indigo-700">{filters.aiListName}</span>
                            </div>
                        )}
                        <h3 className="text-base font-medium text-gray-900">{filteredHospitals.length} hospitals found</h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                            {/* Sorting Pill */}
                            {sortBy && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-indigo-200 bg-indigo-50 text-xs font-medium text-indigo-700 animate-in fade-in zoom-in-95">
                                    <ArrowUpDown className="w-3 h-3" />
                                    {sortBy === 'nearest' ? 'Nearest' : sortBy === 'rating' ? 'Top Rated' : sortBy === 'price_low' ? 'Price: Low to High' : 'Price: High to Low'}
                                    <button onClick={() => handleSortChange(null)} className="text-indigo-400 hover:text-indigo-600"><X className="w-3 h-3" /></button>
                                </span>
                            )}
                            {/* AI-applied filters as pills when chat is open */}
                            {isChatOpen && filters.country && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-xs font-medium text-blue-700 animate-in fade-in zoom-in-95">
                                    <MapPin className="w-3 h-3" />
                                    {filters.country}
                                    <button onClick={() => onUpdateFilters?.({ ...filters, country: undefined })} className="text-blue-400 hover:text-blue-600"><X className="w-3 h-3" /></button>
                                </span>
                            )}
                            {isChatOpen && filters.specialty && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-200 bg-emerald-50 text-xs font-medium text-emerald-700 animate-in fade-in zoom-in-95">
                                    <BriefcaseMedical className="w-3 h-3" />
                                    {filters.specialty}
                                    <button onClick={() => onUpdateFilters?.({ ...filters, specialty: undefined })} className="text-emerald-400 hover:text-emerald-600"><X className="w-3 h-3" /></button>
                                </span>
                            )}
                            {/* Language pills */}
                            {activeLanguages.map(lang => (
                                <span key={lang} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-purple-200 bg-purple-50 text-xs font-medium text-purple-700 animate-in fade-in zoom-in-95">
                                    <Globe className="w-3 h-3" />
                                    {lang}
                                    <button onClick={() => toggleLanguage(lang)} className="text-purple-400 hover:text-purple-600"><X className="w-3 h-3" /></button>
                                </span>
                            ))}
                            {activeAccreditation.map(acc => (
                                <span key={acc} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-white text-xs font-medium text-gray-700 animate-in fade-in zoom-in-95">
                                    {acc} Accredited
                                    <button onClick={() => toggleAccreditation(acc)} className="text-gray-400 hover:text-gray-600"><X className="w-3 h-3" /></button>
                                </span>
                            ))}
                            {minRating && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-amber-200 bg-amber-50 text-xs font-medium text-amber-700 animate-in fade-in zoom-in-95">
                                    <Star className="w-3 h-3 fill-current" />
                                    {minRating}+ Rating
                                    <button onClick={() => setMinRating(null)} className="text-amber-400 hover:text-amber-600"><X className="w-3 h-3" /></button>
                                </span>
                            )}
                            {activePrice.map(price => (
                                <span key={price} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-white text-xs font-medium text-gray-700 animate-in fade-in zoom-in-95">
                                    {price}
                                    <button onClick={() => togglePrice(price)} className="text-gray-400 hover:text-gray-600"><X className="w-3 h-3" /></button>
                                </span>
                            ))}
                        </div>
                        {(activePrice.length > 0 || activeAccreditation.length > 0 || activeLanguages.length > 0 || minRating || sortBy || (isChatOpen && (filters.country || filters.specialty))) && (
                            <>
                                <div className="hidden sm:block w-px h-6 bg-gray-200 mx-2"></div>
                                <button onClick={onClearFilters} className="text-xs font-medium text-gray-600 hover:text-gray-900 underline decoration-gray-300 underline-offset-4">Reset Filter</button>
                            </>
                        )}
                    </div>
                </div>

                {/* Content View */}
                <div className="flex-1 relative">
                    {viewMode === 'grid' ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-28">
                                {displayedHospitals.map((hospital, index) => (
                                    <HospitalCard 
                                        key={hospital.id} 
                                        hospital={hospital} 
                                        onViewDetails={(h) => setSheetHospital(h)}
                                        travelEstimate={travelEstimates[hospital.id]}
                                        isComparing={compareList.some(h => h.id === hospital.id)}
                                        onToggleCompare={toggleCompare}
                                        compareBtnId={index === 0 ? "tour-compare-button" : undefined}
                                    />
                                ))}
                                {filteredHospitals.length === 0 && (
                                    <div className="col-span-full py-20 text-center text-gray-400">
                                        <p>No hospitals found matching your criteria.</p>
                                        <button onClick={onClearFilters} className="mt-4 text-blue-600 hover:underline">Clear all filters</button>
                                    </div>
                                )}
                            </div>
                            {/* Load More Button */}
                            {visibleCount < filteredHospitals.length && (
                                <div className="flex justify-center pb-20">
                                    <button 
                                        onClick={loadMore}
                                        className="flex items-center gap-2 px-6 py-3 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all active:scale-95 bg-white shadow-sm"
                                    >
                                        Load More Results <ChevronDown className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="h-[600px] w-full rounded-xl overflow-hidden border border-gray-200">
                             <MapboxMap 
                                hospitals={filteredHospitals} 
                                onSelectHospital={(h) => setSheetHospital(h)}
                             />
                        </div>
                    )}

                    {/* Floating Comparison Bar */}
                    {compareList.length > 0 && (
                        <div className="fixed bottom-24 md:bottom-8 left-1/2 transform -translate-x-1/2 z-40 animate-in slide-in-from-bottom-10 fade-in duration-300">
                            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 pl-4 flex items-center gap-4">
                                <div className="flex -space-x-3">
                                    {compareList.map(h => (
                                        <div key={h.id} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-slate-100 relative group">
                                            <img src={h.imageUrl} alt={h.name} className="w-full h-full object-cover" />
                                            <button 
                                                onClick={() => toggleCompare(h)}
                                                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-4 h-4 text-white" />
                                            </button>
                                        </div>
                                    ))}
                                    {compareList.length < 3 && (
                                        <div className="w-10 h-10 rounded-full border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center">
                                            <span className="text-xs text-slate-400 font-medium">Add</span>
                                        </div>
                                    )}
                                </div>
                                <div className="h-8 w-px bg-slate-100 mx-2"></div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => setCompareList([])}
                                        className="px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
                                    >
                                        Clear
                                    </button>
                                    <button 
                                        onClick={() => setIsComparisonOpen(true)}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition-all active:scale-95"
                                    >
                                        <GitCompare className="w-4 h-4" />
                                        Compare ({compareList.length})
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Floating Map/List Toggle (Hide when comparison bar is active on small screens to avoid clutter) */}
                    <div className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-30 transition-all duration-300 ${compareList.length > 0 ? 'translate-y-20 opacity-0 pointer-events-none' : ''}`}>
                        <button 
                            onClick={() => setViewMode(prev => prev === 'grid' ? 'map' : 'grid')}
                            className="bg-[#111] hover:scale-105 hover:bg-black text-white px-5 py-3.5 rounded-full font-medium text-sm shadow-xl flex items-center gap-2 transition-all active:scale-95"
                        >
                            {viewMode === 'grid' ? (
                                <>
                                    <span className="font-semibold">Show map</span>
                                    <Map className="w-4 h-4" />
                                </>
                            ) : (
                                <>
                                    <span className="font-semibold">Show list</span>
                                    <List className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>
                </div>

            </main>
        </div>

        {/* Details Sheet */}
        <Sheet isOpen={!!sheetHospital} onClose={() => setSheetHospital(null)}>
            {sheetHospital && (
                <HospitalDetails 
                hospital={sheetHospital} 
                onViewFullProfile={(h) => onViewHospitalPage(h)} 
                />
            )}
        </Sheet>

        {/* Comparison Sheet */}
        <Sheet 
            isOpen={isComparisonOpen} 
            onClose={() => setIsComparisonOpen(false)}
            className="sm:w-[900px] w-full"
        >
            <ComparisonView 
                hospitals={compareList}
                onRemove={(id) => setCompareList(prev => prev.filter(h => h.id !== id))}
                onClose={() => setIsComparisonOpen(false)}
                onViewDetails={(h) => {
                    setIsComparisonOpen(false);
                    onViewHospitalPage(h);
                }}
            />
        </Sheet>
    </div>
  );
};
