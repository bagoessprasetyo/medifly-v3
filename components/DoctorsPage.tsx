
import React, { useState, useMemo } from 'react';
import { DOCTORS } from '../constants';
import { Doctor } from '../types';
import { DoctorCard } from './DoctorCard';
import { Search, BriefcaseMedical, MapPin, X, Check, MessageSquare, Building2, Stethoscope, Package, Users } from 'lucide-react';

interface DoctorsPageProps {
  onBack: () => void;
  onNavigateToHospitals: () => void;
  onNavigateToDoctors: () => void;
}

export const DoctorsPage: React.FC<DoctorsPageProps> = ({ onBack, onNavigateToHospitals, onNavigateToDoctors }) => {
  const [specialtyInput, setSpecialtyInput] = useState('');
  const [locationInput, setLocationInput] = useState('');
  
  // Filters
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [minExperience, setMinExperience] = useState<number | null>(null);

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

  const clearFilters = () => {
      setSelectedGenders([]);
      setSelectedLanguages([]);
      setMinExperience(null);
  };

  return (
    <div className="bg-white text-gray-900 font-sans min-h-screen flex flex-col">
        {/* Header */}
        <header className="border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm z-50">
            <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2 cursor-pointer" onClick={onBack}>
                    <div className="bg-black text-white p-1.5 rounded-lg">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                            <path d="M2 17L12 22L22 17" />
                            <path d="M2 12L12 17L22 12" />
                        </svg>
                    </div>
                    <span className="text-xl font-semibold tracking-tight">Medifly</span>
                </div>

                {/* Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    <button onClick={onNavigateToHospitals} className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-colors">
                        <Building2 className="w-4 h-4" /> Hospitals
                    </button>
                    <button onClick={onNavigateToDoctors} className="flex items-center gap-2 text-sm font-medium text-black transition-colors">
                        <Stethoscope className="w-4 h-4" /> Doctors
                    </button>
                    <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-colors">
                        <Package className="w-4 h-4" /> Packages
                    </button>
                    <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-colors">
                        <Users className="w-4 h-4" /> About Us
                    </button>
                </nav>

                {/* CTA */}
                <div>
                    <button className="bg-black text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-gray-800 transition-colors">
                        Get Started
                    </button>
                </div>
            </div>
        </header>

        {/* Main Content Layout */}
        <div className="flex-1 max-w-[1400px] mx-auto w-full px-6 py-8 flex gap-12">
            
            {/* Sidebar Filters */}
            <aside className="w-64 flex-shrink-0 hidden lg:block pt-2">
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

                {/* Chat Widget */}
                <div className="bg-[#FAF8F7] rounded-xl p-5 mt-4">
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
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredDoctors.map(doctor => (
                        <DoctorCard key={doctor.id} doctor={doctor} />
                    ))}
                    {filteredDoctors.length === 0 && (
                        <div className="col-span-full py-20 text-center text-gray-400">
                            <p>No doctors found matching your criteria.</p>
                            <button onClick={clearFilters} className="mt-4 text-[#3395FF] hover:underline">Clear all filters</button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    </div>
  );
};
