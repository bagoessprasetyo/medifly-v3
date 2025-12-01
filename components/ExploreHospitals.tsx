
import React from 'react';
import { Plane, Stethoscope, Building2, Search } from 'lucide-react';

export const ExploreHospitals: React.FC = () => {
  return (
    <section className="max-w-[1400px] mx-auto px-6 py-20 lg:py-24 bg-white text-gray-900 antialiased">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 mb-10">Explore hospitals around the world</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            
            {/* Indonesia Card */}
            <div className="flex flex-col group cursor-pointer">
                {/* Image Header */}
                <div className="relative h-[280px] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm">
                    <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/917d6f93-fb36-439a-8c48-884b67b35381_1600w.jpg" 
                            onError={(e) => (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555851944-77a3d3c74332?q=80&w=800'}
                            alt="Indonesia" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/20 transition-colors"></div>
                    
                    {/* Time Badge */}
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 shadow-sm">
                        <Plane className="w-3.5 h-3.5 text-gray-800" />
                        <span className="text-xs font-semibold text-gray-800 tracking-wide">0 hrs away</span>
                    </div>

                    {/* Center Title */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h2 className="text-2xl font-semibold text-white tracking-widest uppercase drop-shadow-lg">Indonesia</h2>
                    </div>
                </div>

                {/* Card Body */}
                <div className="mt-5">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">🇮🇩</span>
                        <h3 className="text-lg font-semibold text-gray-900">Indonesia</h3>
                    </div>
                    
                    <p className="text-sm text-gray-500 leading-relaxed min-h-[3em]">
                        Modern medical facilities with affordable care and growing centers of excellence.
                    </p>

                    {/* Stats Badges */}
                    <div className="flex flex-wrap gap-3 mt-4">
                        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
                            <Stethoscope className="w-3.5 h-3.5 text-gray-500" />
                            <span className="text-xs font-medium text-gray-600">2,300 Specialists</span>
                        </div>
                        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
                            <Building2 className="w-3.5 h-3.5 text-gray-500" />
                            <span className="text-xs font-medium text-gray-600">115 Hospitals</span>
                        </div>
                    </div>

                    {/* Popular Searches */}
                    <div className="mt-5">
                        <p className="text-xs font-medium text-gray-400 mb-2.5 uppercase tracking-wide">Popular Searches:</p>
                        <ul className="space-y-2">
                            <li className="flex items-start gap-2 text-xs text-gray-500 hover:text-gray-900 transition-colors cursor-pointer group/link">
                                <Search className="w-3 h-3 mt-0.5 text-gray-400 group-hover/link:text-gray-600 shrink-0" />
                                Top hospitals in Bali
                            </li>
                            <li className="flex items-start gap-2 text-xs text-gray-500 hover:text-gray-900 transition-colors cursor-pointer group/link">
                                <Search className="w-3 h-3 mt-0.5 text-gray-400 group-hover/link:text-gray-600 shrink-0" />
                                Top Wellness centers in Bali
                            </li>
                            <li className="flex items-start gap-2 text-xs text-gray-500 hover:text-gray-900 transition-colors cursor-pointer group/link">
                                <Search className="w-3 h-3 mt-0.5 text-gray-400 group-hover/link:text-gray-600 shrink-0" />
                                Wellness & detox clinics in Ubud
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Malaysia Card */}
            <div className="flex flex-col group cursor-pointer">
                <div className="relative h-[280px] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm">
                    <img src="https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&q=80&w=800" 
                            alt="Malaysia" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/20 transition-colors"></div>
                    
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 shadow-sm">
                        <Plane className="w-3.5 h-3.5 text-gray-800" />
                        <span className="text-xs font-semibold text-gray-800 tracking-wide">1.5 hrs away</span>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center">
                        <h2 className="text-2xl font-semibold text-white tracking-widest uppercase drop-shadow-lg">Malaysia</h2>
                    </div>
                </div>

                <div className="mt-5">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">🇲🇾</span>
                        <h3 className="text-lg font-semibold text-gray-900">Malaysia</h3>
                    </div>
                    
                    <p className="text-sm text-gray-500 leading-relaxed min-h-[3em]">
                        Modern hospitals with Bahasa-speaking staff and excellent patient safety.
                    </p>

                    <div className="flex flex-wrap gap-3 mt-4">
                        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
                            <Stethoscope className="w-3.5 h-3.5 text-gray-500" />
                            <span className="text-xs font-medium text-gray-600">2,300 Specialists</span>
                        </div>
                        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
                            <Building2 className="w-3.5 h-3.5 text-gray-500" />
                            <span className="text-xs font-medium text-gray-600">115 Hospitals</span>
                        </div>
                    </div>

                    <div className="mt-5">
                        <p className="text-xs font-medium text-gray-400 mb-2.5 uppercase tracking-wide">Popular Searches:</p>
                        <ul className="space-y-2">
                            <li className="flex items-start gap-2 text-xs text-gray-500 hover:text-gray-900 transition-colors cursor-pointer group/link">
                                <Search className="w-3 h-3 mt-0.5 text-gray-400 group-hover/link:text-gray-600 shrink-0" />
                                IVF centers in Kuala Lumpur
                            </li>
                            <li className="flex items-start gap-2 text-xs text-gray-500 hover:text-gray-900 transition-colors cursor-pointer group/link">
                                <Search className="w-3 h-3 mt-0.5 text-gray-400 group-hover/link:text-gray-600 shrink-0" />
                                Top 10 Orthopedic hospitals in Penang
                            </li>
                            <li className="flex items-start gap-2 text-xs text-gray-500 hover:text-gray-900 transition-colors cursor-pointer group/link">
                                <Search className="w-3 h-3 mt-0.5 text-gray-400 group-hover/link:text-gray-600 shrink-0" />
                                Top cardiac surgeons in Malaysia
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Singapore Card */}
            <div className="flex flex-col group cursor-pointer">
                <div className="relative h-[280px] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm">
                    <img src="https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&q=80&w=800" 
                            alt="Singapore" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/20 transition-colors"></div>
                    
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 shadow-sm">
                        <Plane className="w-3.5 h-3.5 text-gray-800" />
                        <span className="text-xs font-semibold text-gray-800 tracking-wide">1 hr away</span>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center">
                        <h2 className="text-2xl font-semibold text-white tracking-widest uppercase drop-shadow-lg">Singapore</h2>
                    </div>
                </div>

                <div className="mt-5">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">🇸🇬</span>
                        <h3 className="text-lg font-semibold text-gray-900">Singapore</h3>
                    </div>
                    
                    <p className="text-sm text-gray-500 leading-relaxed min-h-[3em]">
                        Premium healthcare standards with cutting-edge technology.
                    </p>

                    <div className="flex flex-wrap gap-3 mt-4">
                        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
                            <Stethoscope className="w-3.5 h-3.5 text-gray-500" />
                            <span className="text-xs font-medium text-gray-600">2,300 Specialists</span>
                        </div>
                        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
                            <Building2 className="w-3.5 h-3.5 text-gray-500" />
                            <span className="text-xs font-medium text-gray-600">115 Hospitals</span>
                        </div>
                    </div>

                    <div className="mt-5">
                        <p className="text-xs font-medium text-gray-400 mb-2.5 uppercase tracking-wide">Popular Searches:</p>
                        <ul className="space-y-2">
                            <li className="flex items-start gap-2 text-xs text-gray-500 hover:text-gray-900 transition-colors cursor-pointer group/link">
                                <Search className="w-3 h-3 mt-0.5 text-gray-400 group-hover/link:text-gray-600 shrink-0" />
                                Cancer centers in Singapore
                            </li>
                            <li className="flex items-start gap-2 text-xs text-gray-500 hover:text-gray-900 transition-colors cursor-pointer group/link">
                                <Search className="w-3 h-3 mt-0.5 text-gray-400 group-hover/link:text-gray-600 shrink-0" />
                                Cardiac surgery specialists
                            </li>
                            <li className="flex items-start gap-2 text-xs text-gray-500 hover:text-gray-900 transition-colors cursor-pointer group/link">
                                <Search className="w-3 h-3 mt-0.5 text-gray-400 group-hover/link:text-gray-600 shrink-0" />
                                Executive health screening packages
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Thailand Card */}
            <div className="flex flex-col group cursor-pointer">
                <div className="relative h-[280px] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm">
                    <img src="https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&q=80&w=800" 
                            alt="Thailand" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/20 transition-colors"></div>
                    
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 shadow-sm">
                        <Plane className="w-3.5 h-3.5 text-gray-800" />
                        <span className="text-xs font-semibold text-gray-800 tracking-wide">3 hrs away</span>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center">
                        <h2 className="text-2xl font-semibold text-white tracking-widest uppercase drop-shadow-lg">Thailand</h2>
                    </div>
                </div>

                <div className="mt-5">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">🇹🇭</span>
                        <h3 className="text-lg font-semibold text-gray-900">Thailand</h3>
                    </div>
                    
                    <p className="text-sm text-gray-500 leading-relaxed min-h-[3em]">
                        World-leading destination for affordable surgeries and wellness retreats.
                    </p>

                    <div className="flex flex-wrap gap-3 mt-4">
                        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
                            <Stethoscope className="w-3.5 h-3.5 text-gray-500" />
                            <span className="text-xs font-medium text-gray-600">2,300 Specialists</span>
                        </div>
                        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
                            <Building2 className="w-3.5 h-3.5 text-gray-500" />
                            <span className="text-xs font-medium text-gray-600">115 Hospitals</span>
                        </div>
                    </div>

                    <div className="mt-5">
                        <p className="text-xs font-medium text-gray-400 mb-2.5 uppercase tracking-wide">Popular Searches:</p>
                        <ul className="space-y-2">
                            <li className="flex items-start gap-2 text-xs text-gray-500 hover:text-gray-900 transition-colors cursor-pointer group/link">
                                <Search className="w-3 h-3 mt-0.5 text-gray-400 group-hover/link:text-gray-600 shrink-0" />
                                Cosmetic surgery in Bangkok
                            </li>
                            <li className="flex items-start gap-2 text-xs text-gray-500 hover:text-gray-900 transition-colors cursor-pointer group/link">
                                <Search className="w-3 h-3 mt-0.5 text-gray-400 group-hover/link:text-gray-600 shrink-0" />
                                Dental clinics in Phuket
                            </li>
                            <li className="flex items-start gap-2 text-xs text-gray-500 hover:text-gray-900 transition-colors cursor-pointer group/link">
                                <Search className="w-3 h-3 mt-0.5 text-gray-400 group-hover/link:text-gray-600 shrink-0" />
                                Top 10 Weight-loss centers in Bangkok
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

        </div>
    </section>
  );
};
