import React, { useState, useRef, useEffect } from 'react';
import { MapPin, X } from 'lucide-react';
import { LocationSelector } from './LocationSelector';
import { CountryOption } from '@/types';
import { CountryList } from './CountryList';
import { NearbyCard } from './NearbyCard';
// import { NearbyCard } from './NearbyCard';
// import { CountryList } from './CountryList';
// import { CountryOption } from '../types';

interface LocationFilterProps {
  selectedCountries: string[];
  isNearbyActive: boolean;
  userOrigin: string;
  onCountriesChange: (countries: string[]) => void;
  onNearbyChange: (isActive: boolean) => void;
  onOriginChange: (origin: string) => void;
  onGeolocationRequest: () => void;
  isLoadingNearby?: boolean;
  placeholder?: string;
  countries: CountryOption[];
  className?: string;
}

export const LocationFilter: React.FC<LocationFilterProps> = ({
  selectedCountries,
  isNearbyActive,
  userOrigin,
  onCountriesChange,
  onNearbyChange,
  onOriginChange,
  onGeolocationRequest,
  isLoadingNearby = false,
  placeholder = "Select countries",
  countries,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNearbyClick = () => {
    onNearbyChange(true); // Exclusive logic handled by parent via this callback if needed, or we enforce here:
    onCountriesChange([]); // Clear countries when nearby is active
    setIsOpen(false);
    onGeolocationRequest();
  };

  const handleCountrySelect = (country: CountryOption) => {
    // Toggle logic
    const newSelection = selectedCountries.includes(country.name)
      ? selectedCountries.filter(c => c !== country.name)
      : [...selectedCountries, country.name];
    
    onCountriesChange(newSelection);
    if (newSelection.length > 0) {
        onNearbyChange(false); // Disable nearby if specific countries selected
    }
    // Don't close immediately to allow multiple selection
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCountriesChange([]);
    onNearbyChange(false);
    setSearchTerm('');
  };

  const filteredCountries = countries.filter(c => 
    !searchTerm || c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`min-h-[56px] flex hover:border-slate-300 transition-all duration-200 focus:outline-none text-left bg-white w-full h-auto border rounded-xl py-2.5 px-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] gap-x-3 items-center ${
            isOpen ? 'border-slate-400 ring-2 ring-slate-50' : 'border-slate-200'
        }`}
      >
        <div className="flex-shrink-0 text-slate-400">
            <MapPin className="w-5 h-5" strokeWidth={1.5} />
        </div>
        <div className="flex flex-col justify-center w-full overflow-hidden">
            <span className="text-xs font-medium text-slate-500 mb-0.5 leading-tight">Where to?</span>
            {isNearbyActive ? (
                <div className="flex items-center justify-between w-full">
                    <span className="text-sm font-medium leading-tight truncate text-slate-900">Nearby Hospitals</span>
                    <button onClick={handleClear} className="p-0.5 hover:bg-slate-100 rounded-full">
                        <X className="w-3 h-3 text-slate-400" />
                    </button>
                </div>
            ) : selectedCountries.length > 0 ? (
                <div className="flex items-center justify-between w-full">
                    <span className="text-sm font-medium leading-tight truncate text-slate-900">
                        {selectedCountries.join(', ')}
                    </span>
                    <button onClick={handleClear} className="p-0.5 hover:bg-slate-100 rounded-full">
                        <X className="w-3 h-3 text-slate-400" />
                    </button>
                </div>
            ) : (
                <input 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder}
                    className="text-sm font-medium leading-tight truncate text-slate-900 placeholder:text-slate-400 w-full outline-none bg-transparent"
                />
            )}
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-1.5 bg-white rounded-lg border border-slate-200 shadow-lg overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 p-3">
            
            {/* Nearby Card */}
            <NearbyCard 
                onClick={handleNearbyClick} 
                isLoading={isLoadingNearby} 
                isActive={isNearbyActive} 
            />

            {/* Flight Origin Card */}
            <LocationSelector 
                city={userOrigin} 
                onLocationChange={onOriginChange} 
                onDetectLocation={onGeolocationRequest}
                loading={isLoadingNearby}
            />

            {/* Country List */}
            <div className="pt-2 pb-2">
                <h3 className="text-xs font-medium text-slate-400 pl-1 mb-2">Popular Destinations</h3>
                <div className="max-h-[240px] overflow-y-auto custom-scrollbar">
                    <CountryList 
                        countries={filteredCountries}
                        onSelect={handleCountrySelect}
                        selectedCountries={selectedCountries}
                    />
                </div>
            </div>
        </div>
      )}
    </div>
  );
};