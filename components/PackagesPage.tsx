import React, { useState, useEffect, useRef } from 'react';
import { PACKAGES } from '../constants';
import { MedicalPackage, CountryOption } from '../types';
import { Search, ChevronDown, Check, Activity, Heart, Sparkles, Calendar, Building2 as BuildingIcon, X, MapPin, Stethoscope } from 'lucide-react';
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

    // Dropdown states
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const categoryRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
                setIsCategoryOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Scroll to top on mount
    useEffect(() => {
        const scrollContainer = document.getElementById('main-content-area');
        if (scrollContainer) {
            scrollContainer.scrollTo(0, 0);
        } else {
            window.scrollTo(0, 0);
        }
    }, []);

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
                    <h2 className="text-lg font-semimedium mb-6 text-gray-900 tracking-tight">Filter</h2>
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
                                    ${isHeader ? 'font-semimedium text-slate-900 mt-4 first:mt-0' : ''}
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

                    {/* Search Bar - Matching Marketplace Style */}
                    <div className="flex flex-col md:flex-row gap-3 mb-10">
                        {/* Package Category Dropdown */}
                        <div ref={categoryRef} className="relative flex-grow w-full md:w-[45%]">
                            <button
                                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                                className={`min-h-[56px] flex hover:border-slate-300 transition-all duration-200 focus:outline-none text-left bg-white w-full h-auto border rounded-xl py-2.5 px-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] gap-x-3 items-center ${isCategoryOpen ? 'border-slate-400 ring-2 ring-slate-50' : 'border-slate-200'}`}
                            >
                                <div className="flex-shrink-0 text-slate-400">
                                    <Stethoscope className="w-5 h-5" strokeWidth={1.5} />
                                </div>
                                <div className="flex flex-col justify-center w-full overflow-hidden">
                                    <span className="text-xs font-medium text-slate-500 mb-0.5 leading-tight truncate">What are you searching for?</span>
                                    {activeCategory ? (
                                        <div className="flex items-center justify-between w-full">
                                            <span className="text-sm font-medium leading-tight truncate text-slate-900">
                                                {activeCategory}
                                            </span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveCategory(null);
                                                    setPackageNameInput('');
                                                }}
                                                className="p-0.5 hover:bg-slate-100 rounded-full"
                                            >
                                                <X className="w-3 h-3 text-slate-400" />
                                            </button>
                                        </div>
                                    ) : (
                                        <input
                                            type="text"
                                            value={packageNameInput}
                                            onChange={(e) => setPackageNameInput(e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                            onFocus={() => setIsCategoryOpen(true)}
                                            placeholder="Select package or treatment"
                                            className="text-sm font-medium leading-tight truncate text-slate-900 placeholder:text-slate-400 w-full outline-none bg-transparent"
                                        />
                                    )}
                                </div>
                            </button>

                            {/* Category Dropdown Menu */}
                            {isCategoryOpen && (
                                <div className="absolute top-full left-0 w-full mt-1.5 bg-white rounded-lg border border-slate-200 shadow-lg overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="pt-3 px-3 pb-1.5">
                                        <h3 className="text-xs font-medium text-slate-400 pl-1">Package Categories</h3>
                                    </div>
                                    <div className="max-h-[320px] overflow-y-auto p-2 pt-0 flex flex-col gap-1.5 custom-scrollbar">
                                        {categories.filter(cat =>
                                            !packageNameInput || cat.toLowerCase().includes(packageNameInput.toLowerCase())
                                        ).map(cat => {
                                            const isSelected = activeCategory === cat;
                                            return (
                                                <button
                                                    key={cat}
                                                    onClick={() => {
                                                        setActiveCategory(cat);
                                                        setPackageNameInput('');
                                                        setIsCategoryOpen(false);
                                                    }}
                                                    className={`group relative w-full text-left rounded-lg px-3 py-2.5 transition-all duration-200 focus:outline-none border ${isSelected
                                                        ? 'border-slate-900 bg-slate-50'
                                                        : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
                                                        }`}
                                                >
                                                    <span className="text-sm font-medium text-slate-900 group-hover:text-black">{cat}</span>
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

                        {/* Location Filter */}
                        <LocationFilter
                            className="relative flex-grow w-full md:w-[45%]"
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

                        {/* Search Button */}
                        <button className="h-[56px] w-full md:w-[56px] bg-slate-900 rounded-xl flex items-center justify-center hover:bg-black transition-colors duration-200 shadow-md flex-shrink-0">
                            <Search className="w-5 h-5 text-white" />
                        </button>
                    </div>

                    {/* Highlights Section */}
                    {selectedLocations.length === 0 && !isNearbyActive && !activeCategory && (
                        <div className="mb-12 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                            <h2 className="text-lg font-medium text-slate-900 mb-6">Find the Right Care for You</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Card 1 */}
                                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer">
                                    <div className="w-12 h-12 bg-[#F1FCA7] rounded-full flex items-center justify-center mb-4">
                                        <Activity className="w-6 h-6 text-slate-900" />
                                    </div>
                                    <h3 className="font-semimedium text-slate-900 mb-2">Check-up & Diagnostic</h3>
                                    <p className="text-xs text-slate-500 leading-relaxed">Comprehensive health screenings and essential diagnostic tests.</p>
                                </div>
                                {/* Card 2 */}
                                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer">
                                    <div className="w-12 h-12 bg-[#F1FCA7] rounded-full flex items-center justify-center mb-4">
                                        <Heart className="w-6 h-6 text-slate-900" />
                                    </div>
                                    <h3 className="font-semimedium text-slate-900 mb-2">Recovery & Physiotherapy</h3>
                                    <p className="text-xs text-slate-500 leading-relaxed">Comprehensive recovery support from physio to post-surgery care.</p>
                                </div>
                                {/* Card 3 */}
                                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer">
                                    <div className="w-12 h-12 bg-[#F1FCA7] rounded-full flex items-center justify-center mb-4">
                                        <Sparkles className="w-6 h-6 text-slate-900" />
                                    </div>
                                    <h3 className="font-semimedium text-slate-900 mb-2">Beauty & Wellness</h3>
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
                        {filteredPackages.map(pkg => {
                            const hasDiscount = !!pkg.discount || !!pkg.originalPrice;
                            return (
                                <div
                                    key={pkg.id}
                                    onClick={() => onViewPackage?.(pkg)}
                                    className="bg-white rounded-lg overflow-hidden border border-slate-200 hover:border-gray-200 hover:shadow-xl transition-all duration-300 flex flex-col group h-full cursor-pointer"
                                >
                                    {/* Image Section */}
                                    <div className="h-52 bg-gray-100 relative overflow-hidden">
                                        <img src={pkg.imageUrl} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        {pkg.discount && (
                                            <div className="absolute bottom-4 left-4 bg-[#FF6B6B] text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-md">
                                                {pkg.discount}
                                            </div>
                                        )}
                                    </div>
                                    {/* Content Section */}
                                    <div className="p-5 flex-1 flex flex-col">
                                        <h3 className="font-medium text-slate-900 text-lg mb-1 line-clamp-2 leading-snug">{pkg.title}</h3>
                                        <p className="text-sm text-slate-500 mb-4 font-medium">{pkg.category}</p>

                                        {/* Hospital Row */}
                                        <div className="flex items-center gap-2.5 mb-3">
                                            <div className="w-7 h-7 bg-[#F1FCA7] rounded-full flex items-center justify-center shrink-0">
                                                <BuildingIcon className="w-4 h-4 text-slate-800" />
                                            </div>
                                            <span className="text-sm text-slate-700 font-medium truncate">{pkg.hospitalName}</span>
                                        </div>

                                        {/* Date Row */}
                                        {pkg.validUntil && (
                                            <div className="flex items-center gap-2.5 mb-6">
                                                <div className="w-7 h-7 bg-pink-100 rounded-full flex items-center justify-center shrink-0">
                                                    <Calendar className="w-4 h-4 text-pink-500" />
                                                </div>
                                                <span className="text-sm text-slate-500">{pkg.validUntil}</span>
                                            </div>
                                        )}

                                        {/* Price Section */}
                                        <div className="mt-auto">
                                            <div className="flex items-center gap-2.5 mb-4">
                                                {hasDiscount && (
                                                    <div className="w-7 h-7 bg-pink-100 rounded-full flex items-center justify-center shrink-0">
                                                        <svg className="w-4 h-4 text-pink-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <circle cx="12" cy="12" r="10" />
                                                            <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                                                            <path d="M12 18V6" />
                                                        </svg>
                                                    </div>
                                                )}
                                                <div className="flex items-baseline gap-2">
                                                    <span className={`text-xl font-medium ${hasDiscount ? 'text-[#FF4545]' : 'text-slate-900'}`}>{pkg.price}</span>
                                                    {pkg.originalPrice && (
                                                        <span className="text-sm text-slate-400 line-through">{pkg.originalPrice}</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Overview Button */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onViewPackage?.(pkg);
                                                }}
                                                className="w-full py-2 rounded-lg border border-slate-200 text-sm font-semimedium text-slate-700 hover:bg-slate-50 transition-colors"
                                            >
                                                Overview
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </main>
            </div>
        </div>
    );
};