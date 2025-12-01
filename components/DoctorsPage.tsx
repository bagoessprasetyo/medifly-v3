
import React, { useState, useMemo } from 'react';
import { DOCTORS } from '../constants';
import { Doctor } from '../types';
import { DoctorCard } from './DoctorCard';
import { Search, BriefcaseMedical, MapPin, X, Check, MessageSquare, ChevronDown } from 'lucide-react';

interface DoctorsPageProps {
  onBack: () => void;
  onNavigateToHospitals: () => void;
  onNavigateToDoctors: () => void;
  onViewDoctor?: (doctor: Doctor) => void;
}

export const DoctorsPage: React.FC<DoctorsPageProps> = ({ onBack, onNavigateToHospitals, onNavigateToDoctors, onViewDoctor }) => {
  const [specialtyInput, setSpecialtyInput] = useState('');
  const [locationInput, setLocationInput] = useState('');
  
  // Filters
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [minExperience, setMinExperience] = useState<number | null>(null);

  // Pagination
  const [visibleCount, setVisibleCount] = useState(6);

  const toggleGender = (gender: string) => {
      setSelectedGenders(prev => prev.includes(gender) ? prev.filter(g => g !== gender) : [...prev, gender]);
  };

  const toggleLanguage = (lang: string) => {
      setSelectedLanguages(prev => prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]);
  };

  const filteredDoctors = useMemo(() => {
    return DOCTORS.filter(doc => {
        const matchesSearch = !specialtyInput || 
            doc.specialty.toLowerCase().includes(specialtyInput.toLowerCase()) || 
            doc.name.toLowerCase().includes(specialtyInput.toLowerCase());
        
        const matchesLocation = !locationInput || 
            doc.hospitalCountry.toLowerCase().includes(locationInput.toLowerCase()) ||
            doc.hospitalName.toLowerCase().includes(locationInput.toLowerCase());

        const matchesGender = selectedGenders.length === 0 || selectedGenders.includes(doc.gender);
        const matchesLanguage = selectedLanguages.length === 0 || selectedLanguages.some(l => doc.languages.includes(l));
        const matchesExperience = !minExperience || doc.experienceYears >= minExperience;

        return matchesSearch && matchesLocation && matchesGender && matchesLanguage && matchesExperience;
    });
  }, [specialtyInput, locationInput, selectedGenders, selectedLanguages, minExperience]);

  const displayedDoctors = filteredDoctors.slice(0, visibleCount);

  const clearFilters = () => {
      setSelectedGenders([]);
      setSelectedLanguages([]);
      setMinExperience(null);
  };

  const loadMore = () => {
      setVisibleCount(prev => prev + 6);
  };

  return (
    <div className="bg-white text-gray-900 font-sans min-h-screen flex flex-col">
        {/* Main Content Layout */}
        <div className="flex-1 max-w-[1400px] mx-auto w-full px-6 py-8 flex gap-12 relative">
            
            {/* Sidebar Filters - Sticky with Fixed Chat Widget */}
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
                    <div className="mb-8 border-b border-gray-100 pb-8">
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
                    </div>
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
                        {/* Input 1 */}
                        <div className="flex-1 border border-gray-200 rounded-lg p-3 flex items-start gap-3 shadow-sm hover:border-gray-300 transition-colors cursor-text group bg-white">
                            <div className="mt-1 text-gray-400 group-focus-within:text-[#3395FF]">
                                <BriefcaseMedical className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <label className="block text-xs text-gray-500 mb-0.5">What are you looking for?</label>
                                <input 
                                    type="text" 
                                    value={specialtyInput}
                                    onChange={(e) => setSpecialtyInput(e.target.value)}
                                    placeholder="e.g. Cardiology"
                                    className="w-full outline-none text-base text-gray-900 font-medium bg-transparent placeholder-gray-400" 
                                />
                            </div>
                        </div>
                        {/* Input 2 */}
                        <div className="flex-1 border border-gray-200 rounded-lg p-3 flex items-start gap-3 shadow-sm hover:border-gray-300 transition-colors cursor-text group bg-white">
                            <div className="mt-1 text-gray-400 group-focus-within:text-[#3395FF]">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <label className="block text-xs text-gray-500 mb-0.5">Where to?</label>
                                <input 
                                    type="text" 
                                    value={locationInput}
                                    onChange={(e) => setLocationInput(e.target.value)}
                                    placeholder="e.g. Singapore"
                                    className="w-full outline-none text-base text-gray-900 font-medium bg-transparent placeholder-gray-400" 
                                />
                            </div>
                        </div>
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
                        {(minExperience || selectedLanguages.length > 0 || selectedGenders.length > 0) && (
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
