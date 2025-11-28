
import React, { useState, useMemo, useEffect } from 'react';
import { X, Search, Map, List, BriefcaseMedical, MapPin, Star, MessageSquare, Check, ChevronDown } from 'lucide-react';
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

export const Marketplace: React.FC<MarketplaceProps> = ({ 
  filters, 
  onClearFilters, 
  onViewHospitalPage, 
  onUpdateFilters,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [sheetHospital, setSheetHospital] = useState<Hospital | null>(null);

  // Search Bar Local State
  const [specialtyInput, setSpecialtyInput] = useState(filters.specialty || '');
  const [locationInput, setLocationInput] = useState(filters.userOrigin || filters.country || '');

  // Advanced Filters State
  const [activePrice, setActivePrice] = useState<string[]>(filters.priceRange || []);
  const [activeAccreditation, setActiveAccreditation] = useState<string[]>(filters.accreditation || []);
  const [minRating, setMinRating] = useState<number | null>(filters.minRating || null);
  
  // Travel Estimates
  const [travelEstimates, setTravelEstimates] = useState<Record<string, TravelEstimate>>({});

  // Pagination State
  const [visibleCount, setVisibleCount] = useState(6);

  // Sync props to state
  useEffect(() => {
    setSpecialtyInput(filters.specialty || '');
    setLocationInput(filters.userOrigin || filters.country || '');
    setActivePrice(filters.priceRange || []);
    setActiveAccreditation(filters.accreditation || []);
    setMinRating(filters.minRating || null);
  }, [filters]);

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
    return HOSPITALS.filter(hospital => {
      // Input-based filtering (case insensitive partial match)
      const matchesSpecialty = !specialtyInput || hospital.specialties.some(s => s.toLowerCase().includes(specialtyInput.toLowerCase()));
      
      // Location logic: match country OR city
      const loc = locationInput.toLowerCase();
      const matchesLocation = !locationInput || 
          hospital.country.toLowerCase().includes(loc) || 
          hospital.location.toLowerCase().includes(loc);
      
      const matchesPrice = activePrice.length === 0 || activePrice.includes(hospital.priceRange);
      const matchesAccreditation = activeAccreditation.length === 0 || activeAccreditation.some(acc => hospital.accreditation.includes(acc));
      const matchesRating = !minRating || hospital.rating >= minRating;

      return matchesSpecialty && matchesLocation && matchesPrice && matchesAccreditation && matchesRating;
    });
  }, [specialtyInput, locationInput, activePrice, activeAccreditation, minRating]);

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

  const handleSearchSubmit = () => {
      onUpdateFilters?.({
          ...filters,
          specialty: specialtyInput,
          // If the input matches a country name strictly, set country filter, otherwise treat as general search or origin
          country: HOSPITALS.some(h => h.country.toLowerCase() === locationInput.toLowerCase()) ? locationInput : undefined,
          userOrigin: !HOSPITALS.some(h => h.country.toLowerCase() === locationInput.toLowerCase()) ? locationInput : undefined
      });
  };

  const loadMore = () => {
      setVisibleCount(prev => prev + 6);
  };

  return (
    <div className="bg-white text-gray-900 font-sans min-h-screen flex flex-col">
        {/* Main Layout Container */}
        <div className="max-w-[1600px] mx-auto w-full px-4 md:px-6 pt-6 md:pt-8 pb-20 flex flex-col lg:flex-row gap-8 lg:gap-12 flex-1 relative">
            
            {/* Sidebar Filters (Desktop) - Added Sticky */}
            <aside className="w-full lg:w-64 flex-shrink-0 space-y-8 hidden lg:block sticky top-24 h-fit">
                <div>
                    <h2 className="text-lg font-semibold tracking-tight mb-6 text-gray-900">Filters</h2>
                    
                    {/* Language Section */}
                    <div className="space-y-4 mb-8">
                        <h3 className="text-sm font-medium text-gray-900">Language Support</h3>
                        <div className="space-y-3">
                            {['English', 'Melayu', 'Mandarin', 'Hokkien', 'Cantonese'].map(lang => (
                                <label key={lang} className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input 
                                            type="checkbox" 
                                            defaultChecked={lang === 'English'}
                                            className="peer appearance-none w-5 h-5 border border-gray-300 rounded bg-white checked:bg-[#3395FF] checked:border-[#3395FF] transition-all"
                                        />
                                        <Check className="w-3.5 h-3.5 text-white absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100" />
                                    </div>
                                    <span className="text-sm text-gray-600 font-medium group-hover:text-gray-900 transition-colors">{lang}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="h-px bg-gray-100 w-full mb-8"></div>

                    {/* Cost Range */}
                    <div className="space-y-4 mb-8">
                        <h3 className="text-sm font-medium text-gray-900">Cost Range</h3>
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
                                    <span className="text-sm text-gray-700 font-medium flex gap-1 group-hover:text-gray-900">
                                        <span className="font-medium text-black">{price}</span>
                                        <span className="text-gray-300">{price === '$' ? '$$' : price === '$$' ? '$' : ''}</span>
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="h-px bg-gray-100 w-full mb-8"></div>

                    {/* Rating */}
                    <div className="space-y-4 mb-8">
                        <h3 className="text-sm font-medium text-gray-900">Rating</h3>
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
                                    <span className="text-sm text-gray-700 font-medium group-hover:text-gray-900">4+ Star Rating</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="h-px bg-gray-100 w-full mb-8"></div>

                    {/* Accreditation */}
                    <div className="space-y-4 mb-8">
                        <h3 className="text-sm font-medium text-gray-900">Accreditation</h3>
                        <div 
                            onClick={() => toggleAccreditation('JCI')}
                            className={`flex items-start gap-3 p-3 rounded-lg transition cursor-pointer border ${activeAccreditation.includes('JCI') ? 'bg-blue-50 border-blue-100' : 'hover:bg-gray-50 border-transparent'}`}
                        >
                            <div className="relative flex items-center mt-1">
                                <input 
                                    type="checkbox" 
                                    checked={activeAccreditation.includes('JCI')}
                                    readOnly
                                    className="peer appearance-none w-5 h-5 border border-gray-300 rounded bg-white checked:bg-[#3395FF] checked:border-[#3395FF] transition-all"
                                />
                                <Check className="w-3.5 h-3.5 text-white absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100" />
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center border border-yellow-200 shrink-0">
                                    <div className="w-6 h-6 rounded-full border-2 border-[#D4AF37] bg-gradient-to-br from-[#FFD700] to-[#B8860B]"></div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 leading-none mb-1">JCI Accredited Only</p>
                                    <p className="text-xs text-gray-500 leading-snug">International healthcare standards</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Help Card */}
                    <div className="bg-[#FAF8F7] rounded-xl p-5 mt-4">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-white">
                                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80" alt="Support" className="w-full h-full object-cover" />
                            </div>
                            <p className="text-sm font-medium text-gray-900 leading-tight">Hi! Need a bit of guidance?</p>
                        </div>
                        <p className="text-xs text-gray-600 mb-4 leading-relaxed">Tell us what you're looking for we'll help you get there.</p>
                        <button className="w-full bg-[#111] text-white text-xs font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-black/90 transition-transform active:scale-95">
                            <MessageSquare className="w-3.5 h-3.5" /> Start Chat
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                
                {/* Search Bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="flex-1 flex border border-gray-200 rounded-lg overflow-hidden h-14 shadow-sm bg-white">
                        {/* Specialization Input */}
                        <div className="flex-1 flex flex-col justify-center px-4 border-r border-gray-100 hover:bg-gray-50 cursor-text group relative transition-colors">
                            <label className="text-[10px] text-gray-500 font-medium absolute top-2.5">Which specializations are you looking for?</label>
                            <div className="flex items-center gap-2 mt-3">
                                <BriefcaseMedical className="w-4 h-4 text-gray-400" />
                                <input 
                                    type="text" 
                                    value={specialtyInput}
                                    onChange={(e) => setSpecialtyInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
                                    className="w-full text-sm font-medium text-gray-900 outline-none bg-transparent placeholder-gray-400"
                                    placeholder="e.g. Cardiology"
                                />
                            </div>
                        </div>
                        {/* Location Input */}
                        <div className="w-full md:w-[35%] flex flex-col justify-center px-4 hover:bg-gray-50 cursor-text group relative transition-colors">
                            <label className="text-[10px] text-gray-500 font-medium absolute top-2.5">Where to?</label>
                            <div className="flex items-center gap-2 mt-3">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <input 
                                    type="text" 
                                    value={locationInput}
                                    onChange={(e) => setLocationInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
                                    className="w-full text-sm font-medium text-gray-900 outline-none bg-transparent placeholder-gray-400"
                                    placeholder="e.g. Malaysia"
                                />
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={handleSearchSubmit}
                        className="w-14 h-14 bg-[#111] rounded-lg flex items-center justify-center text-white shrink-0 hover:bg-black/90 transition-transform active:scale-95 shadow-md"
                    >
                        <Search className="w-5 h-5" />
                    </button>
                </div>

                {/* Filters Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h1 className="text-sm font-medium text-gray-900">{filteredHospitals.length} hospitals found</h1>
                    <div className="flex flex-wrap items-center gap-2">
                        {activeAccreditation.map(acc => (
                            <div key={acc} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700 shadow-sm animate-in fade-in zoom-in-95">
                                {acc} Accredited
                                <button onClick={() => toggleAccreditation(acc)} className="text-gray-400 hover:text-gray-600"><X className="w-3 h-3" /></button>
                            </div>
                        ))}
                        {minRating && (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700 shadow-sm animate-in fade-in zoom-in-95">
                                {minRating}+ Star Rating
                                <button onClick={() => setMinRating(null)} className="text-gray-400 hover:text-gray-600"><X className="w-3 h-3" /></button>
                            </div>
                        )}
                        {activePrice.map(price => (
                            <div key={price} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700 shadow-sm animate-in fade-in zoom-in-95">
                                {price}
                                <button onClick={() => togglePrice(price)} className="text-gray-400 hover:text-gray-600"><X className="w-3 h-3" /></button>
                            </div>
                        ))}
                        
                        {(activePrice.length > 0 || activeAccreditation.length > 0 || minRating) && (
                            <>
                                <div className="h-4 w-px bg-gray-200 mx-1"></div>
                                <button onClick={onClearFilters} className="text-xs font-medium text-gray-500 hover:text-gray-900">Reset Filter</button>
                            </>
                        )}
                    </div>
                </div>

                {/* Content View */}
                <div className="flex-1 relative">
                    {viewMode === 'grid' ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-8">
                                {displayedHospitals.map(hospital => (
                                    <HospitalCard 
                                        key={hospital.id} 
                                        hospital={hospital} 
                                        onViewDetails={(h) => setSheetHospital(h)}
                                        travelEstimate={travelEstimates[hospital.id]}
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

                    {/* Floating Map/List Toggle */}
                    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-30">
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
    </div>
  );
};
