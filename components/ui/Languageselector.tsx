
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, MessageSquareText, Info } from "lucide-react";
import { useTranslation } from '../../contexts/TranslationContext';

export const LanguageSelector: React.FC = () => {
  const { language: selectedLanguage, setLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const countries = [
    { label: "Singapore", value: "English", flag: "🇸🇬" },
    { label: "Thailand", value: "Thai", flag: "🇹🇭" },
    { label: "Indonesia", value: "Bahasa Indonesia", flag: "🇮🇩" },
    { label: "Malaysia", value: "Bahasa Melayu", flag: "🇲🇾" },
    { label: "Vietnam", value: "Vietnamese", flag: "🇻🇳" },
    { label: "South Korea", value: "Korean", flag: "🇰🇷" },
    { label: "Japan", value: "Japanese", flag: "🇯🇵" },
    { label: "China", value: "Mandarin", flag: "🇨🇳" },
    { label: "Australia", value: "English (AU)", flag: "🇦🇺" },
  ];

  const currentCountry = countries.find(c => c.value === selectedLanguage) || countries[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-full border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all cursor-pointer bg-white group outline-none focus:ring-2 focus:ring-slate-100"
        aria-label="Select Language"
        aria-expanded={isOpen}
        title="Change conversation language"
      >
        <span className="text-lg leading-none">{currentCountry.flag}</span>
        <span className="text-sm font-medium text-slate-700 hidden sm:inline group-hover:text-slate-900 transition-colors">
            {currentCountry.value}
        </span>
        <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden py-1 z-[100] animate-in fade-in zoom-in-95 duration-200 origin-top-right">
            <div className="px-4 py-2.5 border-b border-slate-50 mb-1 bg-slate-50/50">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquareText className="w-3 h-3" /> Conversation Language
                </p>
            </div>
            
            <div className="max-h-[320px] overflow-y-auto py-1">
                {countries.map((country) => (
                <button
                    key={country.value}
                    onClick={() => {
                        setLanguage(country.value);
                        setIsOpen(false);
                    }}
                    className={`w-full relative flex items-center px-4 py-2.5 text-sm transition-colors hover:bg-slate-50 text-left gap-3 group
                    ${selectedLanguage === country.value ? 'bg-slate-50' : ''}
                    `}
                >
                    <span className="text-xl leading-none">{country.flag}</span>
                    <div className="flex flex-col items-start flex-1 min-w-0">
                        <span className={`font-medium truncate ${selectedLanguage === country.value ? 'text-slate-900' : 'text-slate-700'}`}>
                            {country.value}
                        </span>
                        <span className="text-[10px] text-slate-400 truncate group-hover:text-slate-500 transition-colors">
                            {country.label}
                        </span>
                    </div>
                    {selectedLanguage === country.value && (
                        <Check className="w-4 h-4 text-[#1C1C1C]" />
                    )}
                </button>
                ))}
            </div>

            <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 mt-1 flex items-start gap-2">
                <Info className="w-3 h-3 text-slate-400 mt-0.5 shrink-0" />
                <p className="text-[10px] text-slate-500 leading-tight">
                    Medifly will automatically translate content to {selectedLanguage}.
                </p>
            </div>
        </div>
      )}
    </div>
  );
};
