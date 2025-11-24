
import React, { useState, useMemo, useEffect } from 'react';
import { X, Map, List, LayoutGrid, HeartPulse, Brain, Baby, Stethoscope, Activity, Syringe, Bone, SlidersHorizontal, Star, Check, ChevronDown, Plane, Navigation } from 'lucide-react';
import { FilterState, Hospital, TravelEstimate } from '../types';
import { HOSPITALS, getCoordinatesForCity } from '../constants';
import { HospitalCard } from './HospitalCard';
import { MapboxMap } from './MapboxMap';
import { Sheet } from './ui/Sheet';
import { HospitalDetails } from './HospitalDetails';
import { getTravelEstimates } from '../services/mapService';

interface MarketplaceProps {
  filters: FilterState;
  onClearFilters: () => void;
  onViewHospitalPage: (hospital: Hospital) => void;
  onUpdateFilters?: (filters: FilterState) => void; 
}

// Map specialties to icons
const SPECIALTY_ICONS: Record<string, React.ReactNode> = {
  'Cardiology': <HeartPulse className="w-6 h-6" />,
  'Neurology': <Brain className="w-6 h-6" />,
  'Orthopedics': <Bone className="w-6 h-6" />,
  'Pediatrics': <Baby className="w-6 h-6" />,
  'Oncology': <Activity className="w-6 h-6" />,
  'Fertility': <Baby className="w-6 h-6" />,
  'Check-up': <Stethoscope className="w-6 h-6" />,
  'Wellness': <Activity className="w-6 h-6" />,
  'Transplant': <Syringe className="w-6 h-6" />
};

const ALL_SPECIALTIES = ['Cardiology', 'Orthopedics', 'Neurology', 'Oncology', 'Fertility', 'Pediatrics', 'Wellness', 'Check-up'];

export const Marketplace: React.FC<MarketplaceProps> = ({ filters, onClearFilters, onViewHospitalPage, onUpdateFilters }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [sheetHospital, setSheetHospital] = useState<Hospital | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Local state for the advanced filters
  const [activePrice, setActivePrice] = useState<string[]>(filters.priceRange || []);
  const [activeAccreditation, setActiveAccreditation] = useState<string[]>(filters.accreditation || []);
  const [minRating, setMinRating] = useState<number | null>(filters.minRating || null);
  
  // Store travel estimates: hospitalId -> TravelEstimate
  const [travelEstimates, setTravelEstimates] = useState<Record<string, TravelEstimate>>({});

  // Sync local state with props when filters change
  useEffect(() => {
    setActivePrice(filters.priceRange || []);
    setActiveAccreditation(filters.accreditation || []);
    setMinRating(filters.minRating || null);
  }, [filters]);

  // Effect to calculate travel times when origin changes
  useEffect(() => {
    const fetchEstimates = async () => {
      let originCoords: { lat: number; lng: number } | null = null;
      
      // Prioritize GPS location
      if (filters.userLocation) {
        originCoords = filters.userLocation;
      } 
      // Fallback to text city lookup
      else if (filters.userOrigin) {
        originCoords = getCoordinatesForCity(filters.userOrigin);
      }

      if (originCoords && filteredHospitals.length > 0) {
        const estimates = await getTravelEstimates(originCoords, filteredHospitals);
        setTravelEstimates(estimates);
      }
    };

    fetchEstimates();
  }, [filters.userOrigin, filters.userLocation, filters.country]); // Recalc if origin or relevant filter changes

  const filteredHospitals = useMemo(() => {
    return HOSPITALS.filter(hospital => {
      // Basic Filters
      const matchesCountry = !filters.country || hospital.country === filters.country;
      const matchesSpecialty = !filters.specialty || hospital.specialties.includes(filters.specialty);
      
      // Advanced Filters
      const matchesPrice = activePrice.length === 0 || activePrice.includes(hospital.priceRange);
      const matchesAccreditation = activeAccreditation.length === 0 || activeAccreditation.some(acc => hospital.accreditation.includes(acc));
      const matchesRating = !minRating || hospital.rating >= minRating;

      return matchesCountry && matchesSpecialty && matchesPrice && matchesAccreditation && matchesRating;
    });
  }, [filters, activePrice, activeAccreditation, minRating]);

  const toggleView = () => {
    setViewMode(prev => prev === 'grid' ? 'map' : 'grid');
  };

  const togglePrice = (price: string) => {
      setActivePrice(prev => prev.includes(price) ? prev.filter(p => p !== price) : [...prev, price]);
  };

  const toggleAccreditation = (acc: string) => {
      setActiveAccreditation(prev => prev.includes(acc) ? prev.filter(a => a !== acc) : [...prev, acc]);
  };

  const clearAdvancedFilters = () => {
      setActivePrice([]);
      setActiveAccreditation([]);
      setMinRating(null);
  };

  const handleClearOrigin = () => {
      if (onUpdateFilters) {
          onUpdateFilters({ ...filters, userOrigin: undefined, userLocation: undefined });
      }
  };

  return (
    <div className="h-full flex flex-col bg-white relative">
      {/* Sticky Filter Bar */}
      <div className="bg-white pt-6 pb-2 px-6 md:px-8 sticky top-0 z-20 border-b border-slate-100 shadow-sm">
        
        {/* Row 1: Title & Context */}
        <div className="flex items-center justify-between mb-4">
           <div>
              {filters.aiListName ? (
                <div className="flex items-center gap-2">
                   <h1 className="text-lg font-bold text-slate-900 tracking-tight">{filters.aiListName}</h1>
                   <button onClick={onClearFilters} className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"><X className="w-4 h-4"/></button>
                </div>
              ) : (
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Explore Treatments</h1>
              )}
           </div>
        </div>

        {/* Row 2: Categories (Icons) - Horizontal Scroll */}
        <div className="flex items-center gap-8 overflow-x-auto no-scrollbar pb-4 -mx-6 px-6 md:mx-0 md:px-0">
           {ALL_SPECIALTIES.map((spec) => {
              const isActive = filters.specialty === spec;
              return (
                 <button 
                    key={spec}
                    className={`flex flex-col items-center gap-2 min-w-fit group transition-all cursor-pointer relative`}
                    onClick={() => {/* In a real app, we might update filter here */}}
                 >
                    <div className={`p-2 rounded-full transition-all ${isActive ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-800 group-hover:bg-[#F4F0EE]'}`}>
                       {SPECIALTY_ICONS[spec] || <Activity className="w-6 h-6" />}
                    </div>
                    <span className={`text-xs font-medium ${isActive ? 'text-slate-900' : 'text-slate-500'} relative`}>
                        {spec}
                        {isActive && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-full h-0.5 bg-slate-900 rounded-full" />}
                    </span>
                 </button>
              )
           })}
        </div>

        {/* Row 3: Advanced Filter Pills - Horizontal Scroll */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pt-2 pb-2 -mx-6 px-6 md:mx-0 md:px-0 mt-1">
            
            {/* All Filters Button */}
            <button 
                onClick={() => setIsFilterModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 text-xs font-semibold text-slate-700 hover:border-slate-900 transition-all whitespace-nowrap bg-white"
            >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filters
                {(activePrice.length > 0 || activeAccreditation.length > 0 || minRating) && (
                    <div className="w-1.5 h-1.5 bg-[#B2D7FF] rounded-full absolute top-2 right-3" />
                )}
            </button>

            <div className="h-6 w-[1px] bg-slate-200 mx-1 flex-shrink-0" />

            {/* User Origin Active Filter Pill */}
            {(filters.userOrigin || filters.userLocation) && (
                 <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-medium whitespace-nowrap border border-slate-900">
                    {filters.userLocation ? <Navigation className="w-3 h-3" /> : <Plane className="w-3 h-3" />}
                    <span>
                      {filters.userOrigin || "My Location"}
                    </span>
                    <button onClick={handleClearOrigin} className="ml-1 p-0.5 hover:bg-slate-700 rounded-full"><X className="w-3 h-3" /></button>
                 </div>
            )}

            {/* Quick Price Toggle Pills */}
            {['$$', '$$$', '$$$$'].map(price => {
                const isActive = activePrice.includes(price);
                return (
                    <button
                        key={price}
                        onClick={() => togglePrice(price)}
                        className={`px-4 py-2 rounded-full border text-xs font-medium transition-all whitespace-nowrap ${isActive ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-900'}`}
                    >
                        {price}
                    </button>
                )
            })}

            {/* JCI Quick Filter */}
            <button 
                onClick={() => toggleAccreditation('JCI')}
                className={`px-4 py-2 rounded-full border text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${activeAccreditation.includes('JCI') ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-900'}`}
            >
                JCI Accredited
            </button>
            
            {/* Top Rated Quick Filter */}
            <button 
                onClick={() => setMinRating(minRating === 4.8 ? null : 4.8)}
                className={`px-4 py-2 rounded-full border text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${minRating === 4.8 ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-900'}`}
            >
                Guest Favorites <Star className="w-3 h-3" fill={minRating === 4.8 ? "white" : "none"} />
            </button>

        </div>
      </div>

      {/* Content Area - Background White as requested */}
      <div className="flex-1 overflow-hidden relative bg-white">
        
        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="h-full overflow-y-auto p-6 md:p-8 pb-36">
            {filteredHospitals.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                {filteredHospitals.map(hospital => (
                  <HospitalCard 
                    key={hospital.id} 
                    hospital={hospital} 
                    onViewDetails={(h) => setSheetHospital(h)}
                    travelEstimate={travelEstimates[hospital.id]}
                  />
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 pb-20">
                <Map className="w-12 h-12 mb-4 opacity-10" />
                <h3 className="text-lg font-medium text-slate-800">No exact matches</h3>
                <p className="text-slate-500 mt-1 text-sm max-w-xs text-center">Try adjusting your filters to see more options.</p>
                <button 
                  onClick={clearAdvancedFilters} 
                  className="mt-6 px-6 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* Map View */}
        {viewMode === 'map' && (
          <div className="w-full h-full">
             <MapboxMap 
               hospitals={filteredHospitals} 
               onSelectHospital={(h) => setSheetHospital(h)}
             />
          </div>
        )}

        {/* Floating Map/List Toggle Button (Airbnb Style) */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
            <button 
                onClick={toggleView}
                className="bg-slate-900 hover:scale-105 hover:bg-black text-white px-5 py-3.5 rounded-full font-medium text-sm shadow-xl shadow-slate-900/20 flex items-center gap-2 transition-all active:scale-95"
            >
                {viewMode === 'grid' ? (
                    <>
                        <span className="font-semibold">Show map</span>
                        <Map className="w-4 h-4 fill-white" />
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

      {/* Details Sheet */}
      <Sheet isOpen={!!sheetHospital} onClose={() => setSheetHospital(null)}>
         {sheetHospital && (
            <HospitalDetails 
              hospital={sheetHospital} 
              onViewFullProfile={(h) => onViewHospitalPage(h)} 
            />
         )}
      </Sheet>

      {/* Advanced Filter Modal */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsFilterModalOpen(false)} />
           <div className="bg-white w-full max-w-lg max-h-[85vh] rounded-2xl shadow-2xl relative flex flex-col animate-in fade-in zoom-in-95 duration-200">
              
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                 <button onClick={() => setIsFilterModalOpen(false)}><X className="w-4 h-4 text-slate-500" /></button>
                 <h3 className="font-bold text-slate-900">Filters</h3>
                 <div className="w-4" /> {/* Spacer */}
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                 
                 {/* Price Range Section */}
                 <section>
                    <h4 className="text-lg font-semibold text-slate-900 mb-4">Price Range</h4>
                    <div className="flex gap-4">
                        {['$$', '$$$', '$$$$'].map(price => (
                            <button 
                                key={price}
                                onClick={() => togglePrice(price)}
                                className={`flex-1 py-3 rounded-xl border-2 font-semibold transition-all ${activePrice.includes(price) ? 'border-slate-900 bg-[#F4F0EE] text-slate-900' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
                            >
                                {price}
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-slate-400 mt-2">$$ (Affordable) • $$$$ (Luxury/Premium)</p>
                 </section>

                 <div className="h-px bg-slate-100 w-full" />

                 {/* Accreditation Section */}
                 <section>
                    <h4 className="text-lg font-semibold text-slate-900 mb-4">Accreditation Standards</h4>
                    <div className="space-y-3">
                        {['JCI', 'GHA', 'KARS', 'MSQH', 'ACHS'].map(acc => (
                           <label key={acc} className="flex items-center justify-between cursor-pointer group">
                              <span className="text-slate-700 font-medium group-hover:text-slate-900">{acc} Certified</span>
                              <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${activeAccreditation.includes(acc) ? 'bg-slate-900 border-slate-900' : 'border-slate-300 bg-white'}`}>
                                 {activeAccreditation.includes(acc) && <Check className="w-4 h-4 text-white" />}
                              </div>
                              <input 
                                type="checkbox" 
                                className="hidden" 
                                checked={activeAccreditation.includes(acc)}
                                onChange={() => toggleAccreditation(acc)}
                              />
                           </label>
                        ))}
                    </div>
                 </section>

                 <div className="h-px bg-slate-100 w-full" />

                 {/* Rating Section */}
                 <section>
                    <h4 className="text-lg font-semibold text-slate-900 mb-4">Quality Rating</h4>
                    <div className="flex items-center justify-between">
                        <span className="text-slate-600">Minimum Rating</span>
                        <div className="flex items-center gap-2">
                           {[4.0, 4.5, 4.8].map(rating => (
                               <button 
                                  key={rating}
                                  onClick={() => setMinRating(minRating === rating ? null : rating)}
                                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${minRating === rating ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200'}`}
                               >
                                  {rating}+
                               </button>
                           ))}
                        </div>
                    </div>
                 </section>

              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-100 bg-white rounded-b-2xl flex justify-between items-center">
                 <button 
                    onClick={clearAdvancedFilters}
                    className="text-sm font-semibold text-slate-500 underline hover:text-slate-800"
                 >
                    Clear all
                 </button>
                 <button 
                    onClick={() => setIsFilterModalOpen(false)}
                    className="bg-slate-900 text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-black transition-colors"
                 >
                    Show {filteredHospitals.length} hospitals
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
