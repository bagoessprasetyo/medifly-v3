import React from 'react';
import { MapPin, Check } from 'lucide-react';
import { CountryOption } from '../types';

interface CountryListProps {
  countries: CountryOption[];
  onSelect: (country: CountryOption) => void;
  selectedCountries?: string[];
}

export const CountryList: React.FC<CountryListProps> = ({ countries, onSelect, selectedCountries = [] }) => {
  return (
    <div className="space-y-2">
      {countries.map((country) => {
        const isSelected = selectedCountries.includes(country.name);
        return (
            <div
                key={country.id}
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect(country);
                }}
                className={`flex items-start gap-3 p-3 border rounded-xl transition-all cursor-pointer bg-white group relative
                    ${isSelected 
                        ? 'border-blue-500 bg-blue-50/30' 
                        : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                    }
                `}
            >
                <div className={`mt-0.5 min-w-[24px] h-[24px] flex items-center justify-center rounded-full transition-colors
                    ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500'}
                `}>
                    <MapPin size={14} />
                </div>
                <div className="flex-1 min-w-0 pr-6">
                    <h3 className={`font-semibold text-sm ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>{country.name}</h3>
                    <p className="text-gray-500 text-xs mt-0.5 leading-snug line-clamp-1">{country.description}</p>
                </div>
                
                {/* Selection Checkmark */}
                {isSelected && (
                    <div className="absolute top-3 right-3 text-blue-600">
                        <Check size={16} strokeWidth={3} />
                    </div>
                )}
            </div>
        );
      })}
    </div>
  );
};