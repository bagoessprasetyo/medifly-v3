import React, { useState, useEffect, useRef } from 'react';
import { Plane, Check, MapPin, Loader2 } from 'lucide-react';
import { CITY_COORDINATES } from '../constants';

interface LocationSelectorProps {
  city: string;
  loading?: boolean;
  onLocationChange: (newCity: string) => void;
  onDetectLocation?: () => void;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({ city, loading, onLocationChange, onDetectLocation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(city);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(city);
  }, [city]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  // Handle outside click to close suggestions/edit mode
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (isEditing) handleSave();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isEditing, inputValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    
    if (val.trim().length > 0) {
        const matches = Object.keys(CITY_COORDINATES).filter(c => 
            c.toLowerCase().includes(val.toLowerCase())
        ).map(c => c.charAt(0).toUpperCase() + c.slice(1)); // Capitalize
        setSuggestions(matches.slice(0, 5));
    } else {
        setSuggestions([]);
    }
  };

  const handleSave = (finalValue?: string) => {
    const valToSave = finalValue || inputValue;
    if (valToSave.trim()) {
      onLocationChange(valToSave);
    } else {
      setInputValue(city);
    }
    setIsEditing(false);
    setSuggestions([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setInputValue(city);
      setIsEditing(false);
      setSuggestions([]);
    }
  };

  return (
    <div ref={containerRef} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl mb-4 shadow-sm relative">
      <div className="flex items-center gap-4 flex-1">
        <div className="w-10 h-10 bg-[#D9F99D] rounded-lg flex items-center justify-center text-gray-800 shrink-0">
          <Plane size={20} className="transform rotate-45" />
        </div>
        <div className="flex-1 min-w-0 relative">
          <p className="text-xs text-gray-400 font-medium">From</p>
          {isEditing ? (
            <div className="relative">
                <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="w-full text-sm font-medium text-gray-900 border-b-2 border-blue-500 focus:outline-none bg-transparent p-0 pr-6"
                placeholder="City..."
                />
                {/* Detect Location Button inside Input */}
                {onDetectLocation && (
                    <button 
                        onClick={onDetectLocation}
                        className="absolute right-0 top-0 text-blue-500 hover:text-blue-700"
                        title="Use my current location"
                    >
                        {loading ? <Loader2 size={14} className="animate-spin" /> : <MapPin size={14} />}
                    </button>
                )}
            </div>
          ) : (
            <h3 className="text-gray-900 font-medium text-sm truncate">
              {loading ? 'Locating...' : city}
            </h3>
          )}
          
          {/* Autocomplete Suggestions */}
          {isEditing && suggestions.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-100 rounded-lg shadow-lg mt-2 z-50 overflow-hidden">
                  {suggestions.map(s => (
                      <button
                        key={s}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 text-gray-700 block"
                        onClick={() => handleSave(s)}
                      >
                          {s}
                      </button>
                  ))}
              </div>
          )}
        </div>
      </div>
      
      {isEditing ? (
         <button 
            onClick={(e) => {
                e.stopPropagation();
                handleSave();
            }} 
            className="p-1 text-green-600 hover:bg-green-50 rounded"
         >
            <Check size={18} />
         </button>
      ) : (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
          className="text-xs font-bold text-gray-900 underline hover:text-blue-600 px-3 shrink-0"
        >
          change
        </button>
      )}
    </div>
  );
};