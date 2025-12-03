import React, { useState, useEffect } from 'react';
import { PACKAGES } from '../constants';
import { MedicalPackage, CountryOption } from '../types'; 
import { Search, ChevronDown, Check, Activity, Heart, Sparkles, Calendar, Building2 as BuildingIcon, X, MapPin } from 'lucide-react';
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

interface PackagesPageProps {
  onBack: () => void;
  onViewPackage?: (pkg: MedicalPackage) => void; 
}

export const PackagesPage: React.FC<PackagesPageProps> = ({ onBack, onViewPackage }) => {
  const [packageNameInput, setPackageNameInput] = useState('');
  
  // Location State
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [isNearbyActive, setIsNearbyActive] = useState(false);
  const [flightOrigin, setFlightOrigin] = useState('Jakarta');
  const [isLoadingNearby, setIsLoadingNearby] = useState(false);

  // Simple active category state for sidebar
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = [
    "Check-up & Screening",
    "General Health Check-Up",
    "Basic Screening Package",
    "Executive Full Body Check",
    "Men’s Wellness Screening",
    "Heart/Cardiac Screening",
    "Liver Function Screening",
    "Kidney Function Screening",
    "Lung Screening",
    "Gastrointestinal/Abdomen Screening",
    "Diabetes & Metabolic Risk Panel",
    "Cancer Screening",
    "MRI Scan Packages",
    "CT Scan Packages",
    "Ultrasound Packages",
    "X-Ray Packages",
    "DEXA Bone Density Scan",
    "Blood Test Panels",
    "Allergy Panels",
    "Pre-Employment Medical Exam",
    "Pre-Travel/ Visa Medical Check",
    "Student/College Entry Medical Check",
    "Recovery & Physiotherapy",
    "Beauty & Wellness"
  ];

  const handleGeolocation = () => {
      setIsLoadingNearby(true);
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
              (position) => {
                  setIsLoadingNearby(false);
                  setIsNearbyActive(true);
                  setSelectedLocations([]);
              },
              () => {
                  setIsLoadingNearby(false);
              }
          );
      } else {
          setIsLoadingNearby(false);
      }
  };

  const filteredPackages = PACKAGES.filter(pkg => {
      const matchesSearch = !packageNameInput || pkg.title.toLowerCase().includes(packageNameInput.toLowerCase());
      
      // Location Match
      let matchesLocation = true;
      if (isNearbyActive) {
          matchesLocation = true; 
      } else if (selectedLocations.length > 0) {
          matchesLocation = selectedLocations.some(loc => 
              pkg.location.toLowerCase().includes(loc.toLowerCase())
          );
      }

      const matchesCategory = !activeCategory || pkg.category === activeCategory || (activeCategory === "Check-up & Screening" && pkg.category.includes("Check-Up"));
      
      return matchesSearch && matchesLocation && matchesCategory;
  });

  return (
    <div className="bg-white text-gray-900 font-sans min-h-screen flex flex-col">
        {/* Main Content Layout */}
        <div className="flex-1 max-w-[1600px] mx-auto w-full px-4 md:px-6 pt-6 md:pt-8 pb-20 flex flex-col lg:flex-row gap-8 lg:gap-12 relative">
            
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-64 flex-shrink-0 hidden lg:block sticky top-24 h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar pr-2">
                <h2 className="text-lg font-semibold mb-6 text-gray-900 tracking-tight">Filter</h2>
                {/* Categories List */}
                <div className="space-y-1">
                    {categories.map((cat, idx) => {
                        const isHeader = ["Check-up & Screening", "Recovery & Physiotherapy", "Beauty & Wellness"].includes(cat);
                        return (
                            <button
                                key={idx}
                                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                                className={`w-full text-left py-2 px-3 rounded-lg text-sm transition-colors flex justify-between items-center group
                                    ${activeCategory === cat ? 'bg-slate-100 text-slate-900 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                                    ${isHeader ? 'font-semibold text-slate-900 mt-4 first:mt-0' : ''}
                                `}
                            >
                                <span>{cat}</span>
                                {isHeader && <ChevronDown className="w-4 h-4 text-slate-400" />}
                            </button>
                        );
                    })}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
                
                {/* Search Bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-10">
                    <div className="flex-1 flex border border-gray-200 rounded-lg overflow-hidden h-14 shadow-sm bg-white">
                        {/* Package Input */}
                        <div className="flex-1 flex flex-col justify-center px-4 border-r border-gray-100 hover:bg-gray-50 cursor-text group relative transition-colors">
                            <label className="text-[10px] text-gray-500 font-medium absolute top-2.5">Which specific packages are you looking for?</label>
                            <input 
                                type="text" 
                                value={packageNameInput}
                                onChange={(e) => setPackageNameInput(e.target.value)}
                                className="w-full text-sm font-medium text-gray-900 outline-none bg-transparent placeholder-gray-400 mt-3"
                                placeholder="Select package"
                            />
                        </div>
                        {/* Location Input with Dropdown */}
                        <div className="w-full md:w-[35%] flex flex-col justify-center relative cursor-pointer group transition-colors">
                             <div className="h-full">
                                <LocationFilter 
                                    className="h-full w-full"
                                    selectedCountries={selectedLocations}
                                    isNearbyActive={isNearbyActive}
                                    userOrigin={flightOrigin}
                                    countries={COUNTRIES}
                                    isLoadingNearby={isLoadingNearby}
                                    onCountriesChange={setSelectedLocations}
                                    onNearbyChange={setIsNearbyActive}
                                    onOriginChange={setFlightOrigin}
                                    onGeolocationRequest={handleGeolocation}
                                    placeholder="Select countries"
                                />
                             </div>
                        </div>
                    </div>
                    <button className="w-14 h-14 bg-[#111] rounded-lg flex items-center justify-center text-white shrink-0 hover:bg-black/90 transition-transform active:scale-95 shadow-md">
                        <Search className="w-5 h-5" />
                    </button>
                </div>

                {/* Highlights Section */}
                {selectedLocations.length === 0 && !isNearbyActive && !activeCategory && (
                <div className="mb-12 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900 mb-6">Find the Right Care for You</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Card 1 */}
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer">
                            <div className="w-12 h-12 bg-[#F1FCA7] rounded-full flex items-center justify-center mb-4">
                                <Activity className="w-6 h-6 text-slate-900" />
                            </div>
                            <h3 className="font-semibold text-slate-900 mb-2">Check-up & Diagnostic</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">Comprehensive health screenings and essential diagnostic tests.</p>
                        </div>
                        {/* Card 2 */}
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer">
                            <div className="w-12 h-12 bg-[#F1FCA7] rounded-full flex items-center justify-center mb-4">
                                <Heart className="w-6 h-6 text-slate-900" />
                            </div>
                            <h3 className="font-semibold text-slate-900 mb-2">Recovery & Physiotherapy</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">Comprehensive recovery support from physio to post-surgery care.</p>
                        </div>
                        {/* Card 3 */}
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer">
                            <div className="w-12 h-12 bg-[#F1FCA7] rounded-full flex items-center justify-center mb-4">
                                <Sparkles className="w-6 h-6 text-slate-900" />
                            </div>
                            <h3 className="font-semibold text-slate-900 mb-2">Beauty & Wellness</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">Aesthetic care for skin, face, and body to elevate your beauty.</p>
                        </div>
                    </div>
                </div>
                )}

                {/* Selected Filters Chips */}
                {(selectedLocations.length > 0 || isNearbyActive) && (
                    <div className="flex flex-wrap items-center gap-2 mb-6">
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
                    </div>
                )}

                {/* Packages Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredPackages.map(pkg => (
                        <div key={pkg.id} className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 flex flex-col group h-full">
                            {/* ... Package Card Content (Keep existing) ... */}
                            <div className="h-48 bg-gray-100 relative overflow-hidden">
                                <img src={pkg.imageUrl} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                {pkg.discount && (
                                    <div className="absolute top-3 left-3 bg-[#FF6B6B] text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                                        {pkg.discount}
                                    </div>
                                )}
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="font-bold text-slate-900 text-base mb-1 line-clamp-2">{pkg.title}</h3>
                                <p className="text-xs text-slate-500 mb-4">{pkg.category}</p>
                                <div className="flex items-center gap-2 mb-2 text-xs text-slate-700 font-medium">
                                    <div className="w-5 h-5 bg-[#F1FCA7] rounded-full flex items-center justify-center shrink-0">
                                        <BuildingIcon className="w-3 h-3 text-slate-900" />
                                    </div>
                                    <span className="truncate">{pkg.hospitalName}</span>
                                </div>
                                {pkg.validUntil && (
                                    <div className="flex items-center gap-2 mb-6 text-[10px] text-slate-400">
                                        <Calendar className="w-3 h-3" />
                                        <span>{pkg.validUntil}</span>
                                    </div>
                                )}
                                <div className="mt-auto pt-4 border-t border-slate-100">
                                    <div className="flex items-baseline gap-2 mb-3">
                                        <span className="text-lg font-bold text-[#FF4545]">{pkg.price}</span>
                                        {pkg.originalPrice && (
                                            <span className="text-xs text-slate-400 line-through decoration-slate-400">{pkg.originalPrice}</span>
                                        )}
                                    </div>
                                    <button 
                                        onClick={() => onViewPackage?.(pkg)}
                                        className="w-full py-2.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                                    >
                                        Overview
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    </div>
  );
};