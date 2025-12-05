import React, { useRef } from 'react';
import { Plane, Stethoscope, Building2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '../contexts/TranslationContext';
import { COUNTRIES } from '../constants';

interface ExploreHospitalsProps {
    onNavigateToCountry?: (countryName: string) => void;
}

export const ExploreHospitals: React.FC<ExploreHospitalsProps> = ({ onNavigateToCountry }) => {
    const { t } = useTranslation();
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 300; // Card width (approx 280) + gap (24)
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="pl-24 mx-auto px-6 py-20 bg-white text-gray-900 antialiased">
            <div className="flex items-center justify-between mb-10">
                <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-gray-900">{t('Explore hospitals around the world')}</h1>

                {/* Navigation Buttons */}
                <div className="flex gap-3 pr-20">
                    <button
                        onClick={() => scroll('left')}
                        className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-900 hover:bg-gray-50 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 stroke-[1.5]" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-900 hover:bg-gray-50 transition-colors"
                    >
                        <ChevronRight className="w-5 h-5 stroke-[1.5]" />
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex overflow-x-auto gap-6  pb-8 -mx-6 px-6 no-scrollbar snap-x snap-mandatory scroll-smooth"
            >

                {COUNTRIES.map((country, idx) => (
                    <div
                        key={idx}
                        className="min-w-[260px] md:min-w-[280px] max-w-[350px] flex-shrink-0 flex flex-col group cursor-pointer snap-center"
                        onClick={() => onNavigateToCountry?.(country.name)}
                    >
                        {/* Image Header */}
                        <div className="relative h-[200px] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm">
                            <img
                                src={country.image}
                                alt={country.name}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                onError={(e) => (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555851944-77a3d3c74332?q=80&w=800'}
                            />
                            <div className="absolute inset-0 bg-black/20 transition-colors"></div>

                            {/* Time Badge */}
                            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 shadow-sm">
                                <Plane className="w-3.5 h-3.5 text-gray-800" />
                                <span className="text-xs font-semibold text-gray-800 tracking-wide">{country.time} away</span>
                            </div>

                            {/* Center Title */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <h2 className="text-2xl font-semibold text-white tracking-widest uppercase drop-shadow-lg">{t(country.name)}</h2>
                            </div>
                        </div>

                        {/* Card Body */}
                        <div className="mt-5 flex-1 flex flex-col">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xl">{country.flag}</span>
                                <h3 className="text-lg font-medium text-gray-900">{t(country.name)}</h3>
                            </div>

                            <p className="text-sm text-gray-500 leading-relaxed min-h-[3em]">
                                {t(country.desc)}
                            </p>

                            {/* Stats Badges */}
                            <div className="flex flex-wrap gap-3 mt-4">
                                <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
                                    <Stethoscope className="w-3.5 h-3.5 text-gray-500" />
                                    <span className="text-xs font-medium text-slate-900">{country.stats.specialists} {t('Specialists')}</span>
                                </div>
                                <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
                                    <Building2 className="w-3.5 h-3.5 text-gray-500" />
                                    <span className="text-xs font-medium text-slate-900">{country.stats.hospitals} {t('Hospitals')}</span>
                                </div>
                            </div>

                            {/* Popular Searches */}
                            <div className="mt-5">
                                <p className="text-xs font-medium text-slate-900 mb-2.5 uppercase tracking-wide">{t('Popular Searches:')}</p>
                                <ul className="space-y-2">
                                    {country.searches.map((search, i) => (
                                        <li key={i} className="flex items-start gap-2 text-xs text-slate-900 hover:text-gray-900 transition-colors cursor-pointer group/link">
                                            <Search className="w-3 h-3 mt-0.5 text-slate-900 group-hover/link:text-gray-600 shrink-0" />
                                            {t(search)}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}

            </div>
        </section>
    );
};