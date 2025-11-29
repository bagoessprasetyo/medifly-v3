import React, { useState } from 'react';
import { Search, MapPin, Globe, Sparkles, ArrowRight, X, Navigation } from 'lucide-react';

interface HeroProps {
  onQuickSearch: (query: string, origin?: string, location?: { lat: number; lng: number }) => void;
  onNavigateToMarketplace?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onQuickSearch, onNavigateToMarketplace }) => {
  // Desktop State
  const [treatment, setTreatment] = useState('');
  const [origin, setOrigin] = useState('Jakarta');
  const [destination, setDestination] = useState('Anywhere');
  
  // Mobile Modal State
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | undefined>(undefined);

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserCoords(coords);
        setOrigin("Current Location");
        setIsLoadingLocation(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setIsLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  const handleSubmit = () => {
    if (treatment.trim()) {
        const parts = [];
        parts.push(`I am looking for ${treatment}`);
        if (destination && destination !== 'Anywhere') parts.push(`in ${destination}`);
        if (origin && origin !== 'Anywhere') parts.push(`traveling from ${origin}`);
        
        onQuickSearch(parts.join(' '), origin, userCoords);
        setIsSearchModalOpen(false);
    }
  };

  return (
    <div className="relative overflow-hidden bg-slate-50 min-h-[85vh] selection:bg-teal-100 selection:text-teal-900">
        
        {/* Background Decoration */}
        <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-teal-50/80 via-white to-white"></div>
            <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-teal-200/20 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/30 blur-[100px] rounded-full"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-24 flex flex-col lg:flex-row lg:items-center gap-12 lg:gap-24">
            
            {/* Left Column: Text & Search */}
            <div className="w-full lg:w-[45%] flex flex-col items-start space-y-10">
                <div className="space-y-6">
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 tracking-tight leading-[1.05]">
                        Find world-class care, anywhere
                    </h1>
                    <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-lg">
                        Compare costs, consult specialists, and book treatments across 1,000s of hospitals in 10+ countries, with AI guidance.
                    </p>
                </div>

                {/* Interactive Search Card (Desktop) */}
                <div className="w-full relative group hidden md:block">
                    <div className="absolute -inset-1 bg-gradient-to-r from-teal-400/20 to-lime-400/20 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-700"></div>
                    <div className="relative w-full bg-white rounded-[1.75rem] border border-slate-200 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] overflow-hidden">
                        
                        {/* Text Input */}
                        <div className="p-5 border-b border-slate-100 flex items-start gap-3">
                            <Search className="w-5 h-5 text-teal-500 mt-1" />
                            <div className="w-full">
                                <textarea 
                                    rows={1}
                                    value={treatment}
                                    onChange={(e) => setTreatment(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSubmit())}
                                    className="w-full text-lg font-medium text-slate-900 placeholder:text-slate-300 bg-transparent border-none focus:ring-0 resize-none p-0 leading-relaxed outline-none"
                                    placeholder="Describe your health issue..."
                                />
                                <p className="text-xs text-slate-400 mt-1">E.g. <span className="text-slate-500">Cheapest Medical Checkups in Malaysia</span></p>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="px-5 py-4 bg-slate-50/50 flex flex-wrap gap-3">
                            <button 
                                className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-slate-50 rounded-lg text-sm font-semibold text-slate-700 transition-all border border-slate-200 shadow-sm group/btn"
                                onClick={() => { if(origin === 'Jakarta') setOrigin(''); else handleUseLocation(); }}
                            >
                                <MapPin className="w-3.5 h-3.5 text-slate-400 group-hover/btn:text-teal-500" />
                                <span className="text-slate-400 font-normal">From:</span> 
                                <input 
                                    value={origin} 
                                    onChange={(e) => setOrigin(e.target.value)}
                                    className="bg-transparent border-none p-0 w-24 text-sm font-semibold text-slate-700 focus:ring-0"
                                    placeholder="City"
                                />
                            </button>
                            <button className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-slate-50 rounded-lg text-sm font-semibold text-slate-700 transition-all border border-slate-200 shadow-sm group/btn">
                                <Globe className="w-3.5 h-3.5 text-slate-400 group-hover/btn:text-teal-500" />
                                <span className="text-slate-400 font-normal">To:</span> 
                                <input 
                                    value={destination} 
                                    onChange={(e) => setDestination(e.target.value)}
                                    className="bg-transparent border-none p-0 w-24 text-sm font-semibold text-slate-700 focus:ring-0"
                                    placeholder="Anywhere"
                                />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Search Trigger */}
                <button 
                    onClick={() => setIsSearchModalOpen(true)}
                    className="md:hidden w-full bg-white rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-slate-200 py-3 px-5 flex items-center gap-4 transition-transform active:scale-95 text-left"
                >
                    <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                        <Search className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="font-bold text-slate-900 text-sm truncate">Describe issue...</div>
                        <div className="text-xs text-slate-500 truncate flex items-center gap-1">
                            <span>{origin || 'Anywhere'}</span>
                            <span className="text-[8px]">•</span>
                            <span>{destination || 'Anywhere'}</span>
                        </div>
                    </div>
                </button>

                {/* Main CTA */}
                <button 
                    onClick={handleSubmit}
                    className="group w-full relative overflow-hidden bg-lime-300 hover:bg-lime-400 text-teal-950 font-bold text-lg rounded-2xl p-4 transition-all duration-300 shadow-[0_4px_0_0_#bef264] hover:shadow-[0_2px_0_0_#bef264] hover:translate-y-[2px] active:translate-y-[4px] active:shadow-none flex items-center justify-center gap-3 hidden md:flex"
                >
                    <span className="relative z-10">Generate from 10,000+ Specialists</span>
                    <Sparkles className="w-5 h-5 text-teal-800 relative z-10" />
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                </button>
            </div>

            {/* Right Column: Visual Grid (Desktop Only or hidden on small mobile if needed) */}
            <div className="hidden lg:block w-full lg:w-[55%] h-[750px] relative">
                {/* Fade Masks */}
                <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-slate-50 via-slate-50/80 to-transparent z-10 pointer-events-none"></div>
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent z-10 pointer-events-none"></div>

                <div className="grid grid-cols-2 gap-5 overflow-hidden h-full pr-4 pl-4">
                    {/* Column 1 - Slower */}
                    <div className="animate-scroll-vertical flex flex-col gap-5" style={{ animationDuration: '45s' }}>
                        <Card image="https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&q=80&w=800" badge="Specialists" title="Find Specialists Abroad" subtitle="Top orthopaedic surgeons for ACL reconstruction in Thailand." badgeColor="blue" />
                        <Card image="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800" badge="Wellness" title="Wellness Retreat in Bali" subtitle="Book a full‑body check‑up and weight reset program in Ubud." badgeColor="emerald" />
                        <Card image="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800" badge="Second Opinion" title="Get a Second Opinion" subtitle="Ask a neurologist in Singapore to review your MRI." badgeColor="violet" />
                        {/* Duplicates for Loop */}
                        <Card image="https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&q=80&w=800" badge="Specialists" title="Find Specialists Abroad" subtitle="Top orthopaedic surgeons for ACL reconstruction in Thailand." badgeColor="blue" />
                        <Card image="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800" badge="Wellness" title="Wellness Retreat in Bali" subtitle="Book a full‑body check‑up and weight reset program in Ubud." badgeColor="emerald" />
                    </div>

                    {/* Column 2 - Faster & Offset */}
                    <div className="animate-scroll-vertical flex flex-col gap-5 pt-20" style={{ animationDuration: '35s' }}>
                        <Card image="https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=800" badge="Compare Care" title="Compare Care Worldwide" subtitle="Heart bypass costs: Malaysia vs India." badgeColor="amber" />
                        <Card image="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800" badge="Personalised" title="Personalised Care Path" subtitle="Type 2 diabetes options in Bangkok or Kuala Lumpur." badgeColor="rose" />
                        <Card image="https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&q=80&w=800" badge="Specialists" title="Find Specialists Abroad" subtitle="Top orthopaedic surgeons for ACL reconstruction in Thailand." badgeColor="blue" />
                        {/* Duplicates for Loop */}
                        <Card image="https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=800" badge="Compare Care" title="Compare Care Worldwide" subtitle="Heart bypass costs: Malaysia vs India." badgeColor="amber" />
                        <Card image="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800" badge="Personalised" title="Personalised Care Path" subtitle="Type 2 diabetes options in Bangkok or Kuala Lumpur." badgeColor="rose" />
                    </div>
                </div>
            </div>
        </div>

        {/* Mobile Search Modal */}
        {isSearchModalOpen && (
            <div className="fixed inset-0 z-[60] bg-slate-50 md:hidden flex flex-col animate-in slide-in-from-bottom-5 duration-300">
                <div className="bg-white px-4 py-4 flex items-center gap-4 shadow-sm relative z-10">
                    <button onClick={() => setIsSearchModalOpen(false)} className="p-2 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors">
                        <X className="w-5 h-5 text-slate-700" />
                    </button>
                    <h2 className="text-lg font-bold text-slate-900 flex-1 text-center pr-10">Find Care</h2>
                </div>
                
                <div className="flex-1 p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 space-y-4">
                        {/* Inputs */}
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 focus-within:border-teal-200 focus-within:ring-2 focus-within:ring-teal-100 transition-all">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1">Treatment</label>
                            <input 
                                type="text" 
                                placeholder="Describe issue..." 
                                value={treatment}
                                onChange={(e) => setTreatment(e.target.value)}
                                className="w-full bg-transparent border-none p-0 text-lg font-semibold text-slate-900 placeholder:text-slate-300 focus:ring-0 outline-none"
                                autoFocus
                            />
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 focus-within:border-teal-200 focus-within:ring-2 focus-within:ring-teal-100 transition-all">
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Fly From</label>
                                <button onClick={handleUseLocation} className="text-[10px] text-teal-600 font-semibold flex items-center gap-1">
                                    {isLoadingLocation ? 'Locating...' : 'Use Current'} <Navigation className="w-3 h-3" />
                                </button>
                            </div>
                            <input 
                                type="text" 
                                placeholder="Your City" 
                                value={origin}
                                onChange={(e) => setOrigin(e.target.value)}
                                className="w-full bg-transparent border-none p-0 text-lg font-semibold text-slate-900 placeholder:text-slate-300 focus:ring-0 outline-none"
                            />
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 focus-within:border-teal-200 focus-within:ring-2 focus-within:ring-teal-100 transition-all">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1">Destination</label>
                            <input 
                                type="text" 
                                placeholder="Anywhere" 
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                className="w-full bg-transparent border-none p-0 text-lg font-semibold text-slate-900 placeholder:text-slate-300 focus:ring-0 outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between">
                    <button 
                        onClick={() => { setTreatment(''); setOrigin(''); setDestination(''); }}
                        className="text-slate-500 font-semibold text-sm px-4"
                    >
                        Clear
                    </button>
                    <button 
                        onClick={handleSubmit}
                        className="bg-lime-300 text-teal-950 px-8 py-3.5 rounded-xl font-bold text-base shadow-lg flex items-center gap-2 active:scale-95 transition-transform"
                    >
                        <Search className="w-5 h-5 stroke-[2.5px]" />
                        Search
                    </button>
                </div>
            </div>
        )}

    </div>
  );
};

// Helper Component for Visual Grid Cards
const Card = ({ image, badge, title, subtitle, badgeColor }: any) => {
    const colorClasses: Record<string, string> = {
        blue: 'bg-blue-50 text-blue-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        violet: 'bg-violet-50 text-violet-600',
        amber: 'bg-amber-50 text-amber-600',
        rose: 'bg-rose-50 text-rose-600'
    };

    return (
        <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group cursor-default">
            <div className="aspect-[4/3] rounded-xl overflow-hidden mb-3 relative bg-slate-200">
                <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 relative z-10" />
            </div>
            <div className="px-1 pb-1">
                <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider mb-2 ${colorClasses[badgeColor] || 'bg-slate-100 text-slate-600'}`}>
                    {badge}
                </span>
                <h3 className="text-sm font-semibold text-slate-900 leading-tight mb-1">{title}</h3>
                <p className="text-xs text-slate-500 font-medium">{subtitle}</p>
            </div>
        </div>
    );
}