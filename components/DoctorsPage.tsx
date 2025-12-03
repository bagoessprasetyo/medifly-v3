import React, { useState, useMemo, useEffect, useRef } from 'react';
import { DOCTORS, SPECIALIZATIONS, SEMANTIC_SPECIALTY_MAP } from '../constants';
import { Doctor, CountryOption } from '../types';
import { DoctorCard } from './DoctorCard';
import { Search, BriefcaseMedical, Check, MessageSquare, ChevronDown, X, MapPin } from 'lucide-react';
import { LocationFilter } from './LocationFilter';

const COUNTRIES: CountryOption[] = [
  { id: '1', name: 'Thailand', description: 'World-class hospitals, affordable prices' },
  { id: '2', name: 'Malaysia', description: 'High-quality care, cardiology & oncology' },
  { id: '3', name: 'Singapore', description: 'Premium healthcare hub, advanced tech' },
  { id: '4', name: 'South Korea', description: 'Cosmetic surgery & dermatology leaders' },
  { id: '5', name: 'Indonesia', description: 'Growing medical tourism sector' },
  { id: '6', name: 'Turkey', description: 'Hair transplant & dental experts' },
  { id: '7', name: 'India', description: 'Highly skilled doctors, complex surgeries' },
];

interface DoctorsPageProps {
  onBack: () => void;
  onNavigateToHospitals: () => void;
  onNavigateToDoctors: () => void;
  onViewDoctor?: (doctor: Doctor) => void;
}

export const DoctorsPage: React.FC<DoctorsPageProps> = ({ onBack, onNavigateToHospitals, onNavigateToDoctors, onViewDoctor }) => {
  // Search State
  const [specialtyInput, setSpecialtyInput] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [isSpecialtyOpen, setIsSpecialtyOpen] = useState(false);
  
  // Location State
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [isNearbyActive, setIsNearbyActive] = useState(false);
  const [flightOrigin, setFlightOrigin] = useState('Jakarta');
  const [isLoadingNearby, setIsLoadingNearby] = useState(false);
  
  // Filters
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [minExperience, setMinExperience] = useState<number | null>(null);

  // Refs
  const specialtyRef = useRef<HTMLDivElement>(null);

  // Pagination
  const [visibleCount, setVisibleCount] = useState(6);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (specialtyRef.current && !specialtyRef.current.contains(event.target as Node)) {
        setIsSpecialtyOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSpecialty = (name: string) => {
    setSelectedSpecialties(prev => {
      if (prev.includes(name)) {
        return prev.filter(s => s !== name);
      }
      return [...prev, name];
    });
  };

  const toggleGender = (gender: string) => {
      setSelectedGenders(prev => prev.includes(gender) ? prev.filter(g => g !== gender) : [...prev, gender]);
  };

  const toggleLanguage = (lang: string) => {
      setSelectedLanguages(prev => prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]);
  };

  const filteredDoctors = useMemo(() => {
    // Pre-calculate matched specialties for semantic search
    let matchedSpecialtiesFromInput: string[] = [];
    if (specialtyInput.trim()) {
        const inputLower = specialtyInput.toLowerCase().trim();
        matchedSpecialtiesFromInput = SPECIALIZATIONS.filter(spec => {
            if (spec.name.toLowerCase().includes(inputLower)) return true;
            const keywords = SEMANTIC_SPECIALTY_MAP[spec.name] || [];
            return keywords.some(k => inputLower.includes(k) || k.includes(inputLower));
        }).map(s => s.name);
    }

    return DOCTORS.filter(doc => {
        // Specialty Match
        let matchesSearch = true;
        if (selectedSpecialties.length > 0) {
            matchesSearch = selectedSpecialties.some(s => doc.specialty.toLowerCase() === s.toLowerCase());
        } else if (specialtyInput.trim()) {
             if (matchedSpecialtiesFromInput.length > 0) {
                matchesSearch = matchedSpecialtiesFromInput.some(s => doc.specialty.toLowerCase().includes(s.toLowerCase()));
             } else {
                // Fallback match on name or direct specialty text
                matchesSearch = doc.specialty.toLowerCase().includes(specialtyInput.toLowerCase()) || 
                                doc.name.toLowerCase().includes(specialtyInput.toLowerCase());
             }
        }
        
        // Location Match
        let matchesLocation = true;
        if (isNearbyActive) {
            matchesLocation = true; // Simulating nearby
        } else if (selectedLocations.length > 0) {
            matchesLocation = selectedLocations.some(loc => 
                doc.hospitalCountry.toLowerCase() === loc.toLowerCase() ||
                doc.hospitalName.toLowerCase().includes(loc.toLowerCase())
            );
        }

        const matchesGender = selectedGenders.length === 0 || selectedGenders.includes(doc.gender);
        const matchesLanguage = selectedLanguages.length === 0 || selectedLanguages.some(l => doc.languages.includes(l));
        const matchesExperience = !minExperience || doc.experienceYears >= minExperience;

        return matchesSearch && matchesLocation && matchesGender && matchesLanguage && matchesExperience;
    });
  }, [specialtyInput, selectedSpecialties, selectedLocations, isNearbyActive, selectedGenders, selectedLanguages, minExperience]);

  const displayedDoctors = filteredDoctors.slice(0, visibleCount);

  const clearFilters = () => {
      setSelectedGenders([]);
      setSelectedLanguages([]);
      setMinExperience(null);
      setSelectedLocations([]);
      setIsNearbyActive(false);
      setSelectedSpecialties([]);
      setSpecialtyInput('');
  };

  const loadMore = () => {
      setVisibleCount(prev => prev + 6);
  };

  const handleGeolocation = () => {
      setIsLoadingNearby(true);
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
              (position) => {
                  setIsLoadingNearby(false);
                  setIsNearbyActive(true);
                  setSelectedLocations([]); // Exclusive
              },
              () => {
                  console.log('Location access denied');
                  setIsLoadingNearby(false);
              }
          );
      } else {
          setIsLoadingNearby(false);
      }
  };

  const handleCountriesChange = (countries: string[]) => {
      setSelectedLocations(countries);
      if (countries.length > 0) setIsNearbyActive(false);
  };

  return (
    <div className="bg-white text-gray-900 font-sans min-h-screen flex flex-col">
        {/* Main Content Layout */}
        <div className="flex-1 max-w-[1400px] mx-auto w-full px-6 py-8 flex gap-12 relative">
            
            {/* Sidebar Filters */}
            <aside className="w-64 flex-shrink-0 hidden lg:flex lg:flex-col pt-2 sticky top-24 h-[calc(100vh-8rem)]">
                
                {/* Scrollable Filters */}
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-0">
                    <h2 className="text-lg font-semibold mb-8 tracking-tight">Filter</h2>

                    {/* Gender Filter */}
                    <div className="mb-8 border-b border-gray-100 pb-8">
                        <h3 className="text-base font-medium mb-4 text-gray-900">Gender</h3>
                        <div className="space-y-3">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedGenders.length === 0}
                                        onChange={() => setSelectedGenders([])}
                                        className="peer appearance-none w-5 h-5 border border-gray-300 rounded bg-white checked:bg-[#3395FF] checked:border-[#3395FF] transition-all"
                                    />
                                    <Check className="w-3.5 h-3.5 text-white absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100" />
                                </div>
                                <span className={`text-sm font-medium group-hover:text-gray-900 ${selectedGenders.length === 0 ? 'text-gray-900' : 'text-gray-600'}`}>All</span>
                            </label>
                            {['Male', 'Female'].map(gender => (
                                <label key={gender} className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedGenders.includes(gender)}
                                            onChange={() => toggleGender(gender)}
                                            className="peer appearance-none w-5 h-5 border border-gray-300 rounded bg-white checked:bg-[#3395FF] checked:border-[#3395FF] transition-all"
                                        />
                                        <Check className="w-3.5 h-3.5 text-white absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100" />
                                    </div>
                                    <span className={`text-sm font-medium group-hover:text-gray-900 ${selectedGenders.includes(gender) ? 'text-gray-900' : 'text-gray-600'}`}>{gender}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Language Filter */}
                    <div className="mb-8 border-b border-gray-100 pb-8">
                        <h3 className="text-base font-medium mb-4 text-gray-900">Language Proficiency</h3>
                        <div className="space-y-3">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedLanguages.length === 0}
                                        onChange={() => setSelectedLanguages([])}
                                        className="peer appearance-none w-5 h-5 border border-gray-300 rounded bg-white checked:bg-[#3395FF] checked:border-[#3395FF] transition-all"
                                    />
                                    <Check className="w-3.5 h-3.5 text-white absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100" />
                                </div>
                                <span className={`text-sm font-medium group-hover:text-gray-900 ${selectedLanguages.length === 0 ? 'text-gray-900' : 'text-gray-600'}`}>All</span>
                            </label>
                            {['English', 'Mandarin', 'Bahasa Melayu', 'Thai', 'Korean'].map(lang => (
                                <label key={lang} className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedLanguages.includes(lang)}
                                            onChange={() => toggleLanguage(lang)}
                                            className="peer appearance-none w-5 h-5 border border-gray-300 rounded bg-white checked:bg-[#3395FF] checked:border-[#3395FF] transition-all"
                                        />
                                        <Check className="w-3.5 h-3.5 text-white absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100" />
                                    </div>
                                    <span className={`text-sm font-medium group-hover:text-gray-900 ${selectedLanguages.includes(lang) ? 'text-gray-900' : 'text-gray-600'}`}>{lang}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Experience Filter */}
                    {/* <div className="mb-8 border-b border-gray-100 pb-8">
                        <h3 className="text-base font-medium mb-4 text-gray-900">Experience</h3>
                        <div className="space-y-3">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input 
                                        type="checkbox" 
                                        checked={minExperience === 10}
                                        onChange={() => setMinExperience(prev => prev === 10 ? null : 10)}
                                        className="peer appearance-none w-5 h-5 border border-gray-300 rounded bg-white checked:bg-[#3395FF] checked:border-[#3395FF] transition-all"
                                    />
                                    <Check className="w-3.5 h-3.5 text-white absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100" />
                                </div>
                                <span className={`text-sm font-medium group-hover:text-gray-900 ${minExperience === 10 ? 'text-gray-900' : 'text-gray-600'}`}>10+ years experience</span>
                            </label>
                        </div>
                    </div> */}
                </div>

                {/* Fixed Chat Widget */}
                <div className="flex-shrink-0 pt-4 bg-white z-10">
                    <div className="bg-[#FAF8F7] rounded-xl p-5">
                        <div className="flex items-start gap-3 mb-3">
                            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" alt="Support" className="w-10 h-10 rounded-full object-cover" />
                            <div>
                                <p className="text-sm font-semibold text-gray-900">Hi! Need a bit of guidance?</p>
                                <p className="text-xs text-gray-500 mt-1 leading-relaxed">Tell us what you're looking for we'll help you get there.</p>
                            </div>
                        </div>
                        <button className="w-full bg-[#1C1C1E] text-white text-sm font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-black transition-colors">
                            <MessageSquare className="w-4 h-4" />
                            Start Chat
                        </button>
                    </div>
                </div>

            </aside>

            {/* Main Results */}
            <main className="flex-1 min-w-0">
                
                {/* Search Bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="flex-1 flex flex-col md:flex-row gap-4">
                        
                        {/* Specialization Dropdown */}
                        <div ref={specialtyRef} className="relative flex-grow w-full md:w-[45%]">
                            <button
                                onClick={() => setIsSpecialtyOpen(!isSpecialtyOpen)}
                                className={`min-h-[56px] flex hover:border-slate-300 transition-all duration-200 focus:outline-none text-left bg-white w-full h-auto border rounded-xl py-2.5 px-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] gap-x-3 items-center ${
                                    isSpecialtyOpen ? 'border-slate-400 ring-2 ring-slate-50' : 'border-slate-200'
                                }`}
                            >
                                <div className="flex-shrink-0 text-slate-400">
                                    <BriefcaseMedical className="w-5 h-5" strokeWidth={1.5} />
                                </div>
                                <div className="flex flex-col justify-center w-full overflow-hidden">
                                    <span className="text-xs font-medium text-slate-500 mb-0.5 leading-tight truncate">What are you searching for?</span>
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
                                            onClick={(e) => e.stopPropagation()}
                                            onFocus={() => setIsSpecialtyOpen(true)}
                                            placeholder="Select specialization or treatment"
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
                                            (SEMANTIC_SPECIALTY_MAP[s.name] || []).some(k => k.includes(specialtyInput.toLowerCase()))
                                        ).map(spec => {
                                            const isSelected = selectedSpecialties.includes(spec.name);
                                            return (
                                                <button
                                                    key={spec.name}
                                                    onClick={() => {
                                                        toggleSpecialty(spec.name);
                                                        setSpecialtyInput('');
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
                        
                        {/* Reusable Location Filter */}
                        <LocationFilter 
                            className="relative flex-grow w-full md:w-[45%]"
                            selectedCountries={selectedLocations}
                            isNearbyActive={isNearbyActive}
                            userOrigin={flightOrigin}
                            countries={COUNTRIES}
                            isLoadingNearby={isLoadingNearby}
                            onCountriesChange={handleCountriesChange}
                            onNearbyChange={setIsNearbyActive}
                            onOriginChange={setFlightOrigin}
                            onGeolocationRequest={handleGeolocation}
                            placeholder="Select countries"
                        />
                    </div>
                    {/* Search Button */}
                    <button className="w-full md:w-14 h-14 bg-[#1C1C1E] rounded-lg flex items-center justify-center text-white hover:bg-black transition-colors shrink-0 shadow-md">
                        <Search className="w-6 h-6" />
                    </button>
                </div>

                {/* Results Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h3 className="text-base font-medium text-gray-900">{filteredDoctors.length} doctors found</h3>
                    
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                             {/* Active Filters Pills */}
                            {isNearbyActive && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-xs font-medium text-blue-700 animate-in fade-in zoom-in-95">
                                    <MapPin className="w-3 h-3" />
                                    Nearby
                                    <button onClick={() => setIsNearbyActive(false)} className="text-blue-400 hover:text-blue-600"><X className="w-3 h-3" /></button>
                                </span>
                            )}
                            {selectedLocations.map(loc => (
                                <span key={loc} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-xs font-medium text-blue-700 animate-in fade-in zoom-in-95">
                                    <MapPin className="w-3 h-3" />
                                    {loc}
                                    <button onClick={() => setSelectedLocations(prev => prev.filter(l => l !== loc))} className="text-blue-400 hover:text-blue-600"><X className="w-3 h-3" /></button>
                                </span>
                            ))}
                            {selectedSpecialties.map(spec => (
                                <span key={spec} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-200 bg-emerald-50 text-xs font-medium text-emerald-700 animate-in fade-in zoom-in-95">
                                    <BriefcaseMedical className="w-3 h-3" />
                                    {spec}
                                    <button onClick={() => toggleSpecialty(spec)} className="text-emerald-400 hover:text-emerald-600"><X className="w-3 h-3" /></button>
                                </span>
                            ))}
                            {minExperience && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-white text-xs font-medium text-gray-700 animate-in fade-in zoom-in-95">
                                    10+ years experience
                                    <button onClick={() => setMinExperience(null)} className="text-gray-400 hover:text-gray-600"><X className="w-3 h-3" /></button>
                                </span>
                            )}
                            {selectedLanguages.map(lang => (
                                <span key={lang} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-white text-xs font-medium text-gray-700 animate-in fade-in zoom-in-95">
                                    {lang}
                                    <button onClick={() => toggleLanguage(lang)} className="text-gray-400 hover:text-gray-600"><X className="w-3 h-3" /></button>
                                </span>
                            ))}
                            {selectedGenders.map(gender => (
                                <span key={gender} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-white text-xs font-medium text-gray-700 animate-in fade-in zoom-in-95">
                                    {gender}
                                    <button onClick={() => toggleGender(gender)} className="text-gray-400 hover:text-gray-600"><X className="w-3 h-3" /></button>
                                </span>
                            ))}
                        </div>
                        {(minExperience || selectedLanguages.length > 0 || selectedGenders.length > 0 || selectedLocations.length > 0 || isNearbyActive || selectedSpecialties.length > 0) && (
                            <>
                                <div className="hidden sm:block w-px h-6 bg-gray-200 mx-2"></div>
                                <button onClick={clearFilters} className="text-xs font-medium text-gray-600 hover:text-gray-900 underline decoration-gray-300 underline-offset-4">Reset Filter</button>
                            </>
                        )}
                    </div>
                </div>

                {/* Doctor Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-8">
                    {displayedDoctors.map(doctor => (
                        <DoctorCard 
                            key={doctor.id} 
                            doctor={doctor} 
                            onViewDetails={onViewDoctor}
                        />
                    ))}
                    {filteredDoctors.length === 0 && (
                        <div className="col-span-full py-20 text-center text-gray-400">
                            <p>No doctors found matching your criteria.</p>
                            <button onClick={clearFilters} className="mt-4 text-[#3395FF] hover:underline">Clear all filters</button>
                        </div>
                    )}
                </div>

                {/* Load More Button */}
                {visibleCount < filteredDoctors.length && (
                    <div className="flex justify-center pb-20">
                        <button 
                            onClick={loadMore}
                            className="group flex items-center gap-2 px-8 py-3 rounded-full border border-gray-200 bg-white text-gray-900 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95 shadow-sm hover:shadow-md"
                        >
                            Load More Results 
                            <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                        </button>
                    </div>
                )}
            </main>
        </div>
    </div>
  );
};