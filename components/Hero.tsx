

import React, { useState } from 'react';
import { Search, Heart, User, Globe, Menu, Stethoscope, Brain, Bone, Baby, Activity, Star, MapPin, Search as SearchIcon, ArrowRight, MessageSquare, List, Sparkles, ShieldCheck, CheckCircle2, Map, Plane, Navigation, AlertTriangle } from 'lucide-react';

interface HeroProps {
  onQuickSearch: (query: string, origin?: string, location?: { lat: number; lng: number }) => void;
}

const SPECIALTIES = [
  { name: 'Cardiology', icon: <Heart className="w-6 h-6" /> },
  { name: 'Orthopedics', icon: <Bone className="w-6 h-6" /> },
  { name: 'Neurology', icon: <Brain className="w-6 h-6" /> },
  { name: 'Fertility', icon: <Baby className="w-6 h-6" /> },
  { name: 'Oncology', icon: <Activity className="w-6 h-6" /> },
  { name: 'Check-up', icon: <Stethoscope className="w-6 h-6" /> },
  { name: 'Plastic Surgery', icon: <User className="w-6 h-6" /> },
  { name: 'Dental', icon: <Star className="w-6 h-6" /> },
];

const DESTINATIONS = [
  { country: 'Bangkok, Thailand', desc: 'Medical tourism hub', rating: 4.94, price: '$$$', img: 'https://picsum.photos/800/800?random=10' },
  { country: 'Seoul, South Korea', desc: 'Plastic surgery & robotics', rating: 4.88, price: '$$$$', img: 'https://picsum.photos/800/800?random=11' },
  { country: 'Singapore', desc: 'Premium advanced care', rating: 4.96, price: '$$$$', img: 'https://picsum.photos/800/800?random=12' },
  { country: 'Kuala Lumpur, Malaysia', desc: 'High quality affordable', rating: 4.82, price: '$$', img: 'https://picsum.photos/800/800?random=13' },
  { country: 'Istanbul, Turkey', desc: 'Hair transplant & dental', rating: 4.75, price: '$$', img: 'https://picsum.photos/800/800?random=14' },
  { country: 'Mexico City, Mexico', desc: 'Dental & Bariatric', rating: 4.70, price: '$', img: 'https://picsum.photos/800/800?random=15' },
  { country: 'Tokyo, Japan', desc: 'Advanced oncology', rating: 4.91, price: '$$$$', img: 'https://picsum.photos/800/800?random=16' },
  { country: 'Bali, Indonesia', desc: 'Wellness & recovery', rating: 4.65, price: '$$', img: 'https://picsum.photos/800/800?random=17' }
];

export const Hero: React.FC<HeroProps> = ({ onQuickSearch }) => {
  const [treatment, setTreatment] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [activeTab, setActiveTab] = useState<string>('Find Care');
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
        
        // Proper error handling
        let msg = "Unable to retrieve location.";
        if (error.code === 1) msg = "Location permission denied.";
        else if (error.code === 2) msg = "Location unavailable.";
        else if (error.code === 3) msg = "Location request timed out.";
        
        alert(`${msg} Please enter your city manually.`);
        setIsLoadingLocation(false);
      },
      { 
        enableHighAccuracy: true, 
        timeout: 8000, 
        maximumAge: 0 
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (treatment.trim()) {
        const parts = [];
        parts.push(`I am looking for ${treatment}`);
        if (destination.trim()) parts.push(`in ${destination.trim()}`);
        if (origin.trim()) parts.push(`traveling from ${origin.trim()}`);
        
        // Explicitly instruct AI to consider distance if origin is provided
        if (origin.trim()) {
            parts.push(`\n\n[System Note: The user is located in ${origin.trim()}. Please explicitly calculate/estimate the flight time and distance range to potential destinations. If multiple destinations offer similar quality for ${treatment}, prioritize or highlight those with shorter travel distance/time. Mention the estimated flight duration in your response.]`);
        }
        
        onQuickSearch(parts.join(' '), origin.trim(), userCoords);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navbar - Airbnb Style (Sticky & Clean) */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 h-20">
        <div className="max-w-[1760px] mx-auto px-6 md:px-12 h-full flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-1 lg:flex-none">
            <div className="w-8 h-8 bg-[#B2D7FF] rounded-lg flex items-center justify-center text-slate-900 font-bold text-xl">M</div>
            <span className="font-bold text-xl text-slate-900 tracking-tight hidden md:block">medifly.ai</span>
          </div>

          {/* Desktop Center Nav - "Stays" style pills */}
          <div className="hidden lg:flex items-center justify-center gap-1 absolute left-1/2 -translate-x-1/2">
             <button 
                onClick={() => setActiveTab('Find Care')}
                className={`px-4 py-2.5 text-sm font-medium rounded-full transition-colors ${activeTab === 'Find Care' ? 'text-slate-900 font-semibold bg-[#F4F0EE]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
             >
                Find Care
             </button>
             <button 
                onClick={() => setActiveTab('Destinations')}
                className={`px-4 py-2.5 text-sm font-medium rounded-full transition-colors ${activeTab === 'Destinations' ? 'text-slate-900 font-semibold bg-[#F4F0EE]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
             >
                Destinations
             </button>
             <button 
                onClick={() => setActiveTab('Concierge')}
                className={`px-4 py-2.5 text-sm font-medium rounded-full transition-colors ${activeTab === 'Concierge' ? 'text-slate-900 font-semibold bg-[#F4F0EE]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
             >
                Concierge
             </button>
          </div>

          {/* Right Actions - User Pill */}
          <div className="flex-1 flex justify-end">
             <div className="flex items-center gap-2">
                <button className="text-sm font-semibold text-slate-900 hover:bg-slate-50 px-4 py-2.5 rounded-full transition-colors hidden md:block">
                    Add your hospital
                </button>
                <button className="p-2 hover:bg-slate-50 rounded-full mr-1">
                   <Globe className="w-4 h-4 text-slate-900" />
                </button>
                <div className="flex items-center gap-2 p-1 pl-3 pr-1 border border-slate-200 rounded-full hover:shadow-md transition-shadow cursor-pointer">
                    <Menu className="w-4 h-4 text-slate-600" />
                    <div className="w-8 h-8 bg-slate-500 rounded-full flex items-center justify-center text-white overflow-hidden">
                        <User className="w-5 h-5 fill-current relative top-1" />
                    </div>
                </div>
             </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16 pb-20 max-w-[1760px] mx-auto px-6 md:px-12">
        
        {/* Search Section - Centered Layout */}
        <div className="flex flex-col items-center justify-center mb-12 text-center">
           
           <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 max-w-4xl leading-[1.1]">
              Find Care With Confidence.<br/>
              <span className="text-[#6495ED]">Anywhere in Southeast Asia.</span>
           </h1>
           
           <p className="text-lg text-slate-500 max-w-2xl mb-10 leading-relaxed">
              Discover trusted hospitals, doctors, and treatments — guided by an AI concierge who reasons with you, not for you.
           </p>

           {/* The Big Search Pill - Now with 3 sections */}
           <div className="w-full max-w-4xl bg-white rounded-full border border-slate-200 shadow-[0_6px_16px_rgba(0,0,0,0.08)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.12)] transition-all p-0 flex items-center divide-x divide-slate-100 relative h-[66px] z-20">
               
               {/* Input 1: Treatment (Semantic) */}
               <div className="flex-[1.5] px-8 py-3 text-left hover:bg-[#F4F0EE] rounded-l-full cursor-pointer group relative h-full flex flex-col justify-center transition-colors">
                   <label className="block text-xs font-bold text-slate-800 tracking-wide mb-0.5">Treatment</label>
                   <input 
                      type="text" 
                      placeholder="Surgery, Check-up, IVF..." 
                      value={treatment}
                      onChange={(e) => setTreatment(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                      className="w-full bg-transparent border-none p-0 text-sm text-slate-600 placeholder:text-slate-400 focus:ring-0 truncate outline-none"
                   />
               </div>

               {/* Input 2: Fly From */}
               <div className="flex-1 px-6 py-3 text-left hover:bg-[#F4F0EE] cursor-pointer group hidden sm:flex flex-col justify-center h-full transition-colors relative">
                   <div className="flex justify-between items-center">
                        <label className="block text-xs font-bold text-slate-800 tracking-wide mb-0.5">Fly From</label>
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleUseLocation(); }}
                            className="text-[10px] font-semibold text-[#6495ED] hover:underline flex items-center gap-1 p-0.5 rounded"
                            title="Use current GPS location"
                        >
                           {isLoadingLocation ? <div className="w-3 h-3 border-2 border-[#6495ED] border-t-transparent rounded-full animate-spin"/> : <Navigation className="w-3 h-3" />}
                           {isLoadingLocation ? 'Locating...' : 'My Location'}
                        </button>
                   </div>
                   <input 
                      type="text" 
                      placeholder="Your City" 
                      value={origin}
                      onChange={(e) => { setOrigin(e.target.value); setUserCoords(undefined); }}
                      onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                      className="w-full bg-transparent border-none p-0 text-sm text-slate-600 placeholder:text-slate-400 focus:ring-0 truncate outline-none"
                   />
               </div>

               {/* Input 3: Destination */}
               <div className="flex-1 px-6 py-3 text-left hover:bg-[#F4F0EE] cursor-pointer group hidden md:flex flex-col justify-center h-full transition-colors relative">
                   <label className="block text-xs font-bold text-slate-800 tracking-wide mb-0.5">Destination</label>
                   <input 
                      type="text" 
                      placeholder="Anywhere" 
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                      className="w-full bg-transparent border-none p-0 text-sm text-slate-600 placeholder:text-slate-400 focus:ring-0 truncate outline-none"
                   />
               </div>

               {/* Search Button */}
               <div className="pl-2 pr-2">
                   <button 
                      onClick={handleSubmit}
                      className="bg-[#B2D7FF] hover:bg-[#9ac5f5] text-slate-900 w-12 h-12 rounded-full flex items-center justify-center transition-transform active:scale-95 shadow-sm"
                   >
                       <SearchIcon className="w-5 h-5 stroke-[2.5px]" />
                   </button>
               </div>
           </div>

           {/* Categories Strip */}
           <div className="mt-12 w-full border-t border-slate-100 pt-8">
               <div className="flex items-center justify-start md:justify-center gap-10 overflow-x-auto w-full no-scrollbar pb-4 px-4">
                   {SPECIALTIES.map((spec) => (
                      <button 
                        key={spec.name}
                        onClick={() => onQuickSearch(`Show me ${spec.name} options`, origin.trim(), userCoords)}
                        className="flex flex-col items-center gap-3 group cursor-pointer min-w-fit opacity-60 hover:opacity-100 transition-all border-b-2 border-transparent hover:border-[#B2D7FF] pb-2"
                      >
                         <div className="text-slate-500 group-hover:text-slate-900 group-hover:scale-105 transition-all duration-200">
                            {spec.icon}
                         </div>
                         <span className="text-xs font-semibold text-slate-600 group-hover:text-slate-900 whitespace-nowrap">{spec.name}</span>
                      </button>
                   ))}
               </div>
           </div>
        </div>

        {/* How Medifly Works - 4 Columns */}
        <section className="mt-20 mb-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-10 text-center md:text-left">How Medifly Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="flex flex-col gap-4">
                    <div className="w-12 h-12 bg-[#F4F0EE] rounded-xl flex items-center justify-center text-slate-700 mb-2">
                        <MessageSquare className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg">1. Chat With Aria</h3>
                    <p className="text-slate-500 leading-relaxed text-sm">Ask about symptoms or treatments. Aria explains options clearly with gentle guidance, like a medical friend.</p>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="w-12 h-12 bg-[#F4F0EE] rounded-xl flex items-center justify-center text-slate-700 mb-2">
                        <Map className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg">2. Explore Hospitals</h3>
                    <p className="text-slate-500 leading-relaxed text-sm">See trusted hospitals across Asia with specialties and patient-friendly details. Compare without the overwhelm.</p>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="w-12 h-12 bg-[#B2D7FF] rounded-xl flex items-center justify-center text-slate-900 mb-2">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg">3. Let Aria Curate</h3>
                    <p className="text-slate-500 leading-relaxed text-sm">Whenever you're ready, Aria can generate a tailored list of recommendations. You remain in control.</p>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="w-12 h-12 bg-[#F4F0EE] rounded-xl flex items-center justify-center text-slate-700 mb-2">
                        <List className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg">4. Refine & Save</h3>
                    <p className="text-slate-500 leading-relaxed text-sm">Lists are automatically named and saved, like "Spine & Rehab - Malaysia". Return to any view with one click.</p>
                </div>
            </div>
        </section>

        {/* Why People Love Medifly - Soft Brown Background Section */}
        <section className="my-20 bg-[#F4F0EE] -mx-6 md:-mx-12 px-6 md:px-12 py-20 rounded-3xl">
            <div className="max-w-[1760px] mx-auto">
                <div className="mb-12">
                   <h2 className="text-3xl font-bold text-slate-900 mb-4">A peaceful, modern experience.</h2>
                   <p className="text-lg text-slate-600 max-w-2xl">Your health journey deserves more than a search box. We bring together expert guidance and transparent information.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-slate-900">A calmer way to explore</h3>
                        <p className="text-slate-600 leading-relaxed">No pressure. No noise. No endless tabs. Just clear guidance that meets you where you are in your journey.</p>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-slate-900">AI you can actually trust</h3>
                        <p className="text-slate-600 leading-relaxed">Aria shows her reasoning step-by-step, so you always understand the “why” behind her suggestions.</p>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-slate-900">Choice stays in your hands</h3>
                        <p className="text-slate-600 leading-relaxed">Aria helps you think. You decide when to update the marketplace. It's designed for real decisions.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Aria Banner - "Reasoning Concierge" */}
        <section className="mb-24">
            <div className="rounded-3xl overflow-hidden relative bg-[#F9FAFB] min-h-[520px] flex items-center shadow-sm border border-slate-100">
                {/* Content */}
                <div className="relative z-10 max-w-2xl p-10 md:p-20">
                    <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-900 mb-6 uppercase tracking-widest border border-white/50 shadow-sm">
                        <Sparkles className="w-3 h-3 text-[#6495ED]" /> Medifly Concierge
                    </div>
                    <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tighter leading-tight">
                        Aria doesn't just answer.<br/>
                        <span className="text-slate-400">She thinks with you.</span>
                    </h2>
                    <p className="text-lg text-slate-600 mb-10 max-w-lg leading-relaxed">
                        Her animations show how she reasons — connecting symptoms to departments, narrowing specialties, and comparing hospitals. Transparent, relatable, and reassuring.
                    </p>
                    <button 
                        onClick={() => onQuickSearch("Hello Aria", origin.trim(), userCoords)}
                        className="bg-slate-900 text-white px-8 py-4 rounded-xl font-semibold text-base hover:bg-black transition-all shadow-lg hover:scale-105 active:scale-95 flex items-center gap-3"
                    >
                        Chat with Aria <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
                
                {/* Background Graphic/Image */}
                <div className="absolute right-0 top-0 bottom-0 w-full md:w-[60%] h-full">
                     <img 
                        src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=2070" 
                        alt="Concierge" 
                        className="w-full h-full object-cover opacity-90 grayscale-[20%]"
                     />
                     <div className="absolute inset-0 bg-gradient-to-r from-[#F9FAFB] via-[#F9FAFB]/90 to-transparent" />
                </div>
            </div>
        </section>

        {/* Destinations Grid */}
        <section>
           <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
               <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">A Marketplace Built for Comfort & Clarity</h2>
                  <p className="text-slate-500">Curated hospitals and specialists, organized to help you discover.</p>
               </div>
               <button onClick={() => setActiveTab('Destinations')} className="text-slate-900 font-semibold underline decoration-slate-200 hover:decoration-slate-900 transition-all self-start md:self-end">
                  See all regions
               </button>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
              {DESTINATIONS.map((dest, i) => (
                 <div 
                    key={i} 
                    className="group cursor-pointer flex flex-col gap-2"
                    onClick={() => onQuickSearch(`Hospitals in ${dest.country.split(',')[0]}`, origin.trim(), userCoords)}
                 >
                    {/* Card Image */}
                    <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-200 mb-1">
                       <img 
                         src={dest.img} 
                         alt={dest.country} 
                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                       />
                       <button className="absolute top-3 right-3 p-1.5 hover:scale-110 transition-transform">
                          <Heart className="w-6 h-6 text-white fill-black/50 stroke-[2px]" />
                       </button>
                       {/* Guest Favorite Badge (Conditional) */}
                       {i < 3 && (
                          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                             <ShieldCheck className="w-3 h-3 text-slate-900" />
                             <span className="text-xs font-bold text-slate-900">Guest favorite</span>
                          </div>
                       )}
                    </div>

                    {/* Card Content */}
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-0.5">
                            <h3 className="font-semibold text-slate-900 text-[15px] leading-tight">{dest.country}</h3>
                            <p className="text-slate-500 text-[15px]">{dest.desc}</p>
                            <div className="mt-1 flex items-baseline gap-1">
                                <span className="font-semibold text-slate-900 text-[15px] underline decoration-slate-300 underline-offset-2">{dest.price}</span>
                                <span className="text-slate-900 text-[15px]">est. cost</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 text-[15px] mt-0.5">
                            <Star className="w-3.5 h-3.5 fill-slate-900 text-slate-900" />
                            <span className="font-light">{dest.rating}</span>
                        </div>
                    </div>
                 </div>
              ))}
           </div>
        </section>

      </main>
      
      {/* Simple Footer */}
      <footer className="border-t border-slate-100 py-10 bg-[#F4F0EE]">
         <div className="max-w-[1760px] mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
               <p className="text-sm text-slate-500">© 2024 Medifly AI, Inc.</p>
               <span className="text-slate-400">·</span>
               <a href="#" className="text-sm text-slate-500 hover:underline">Privacy</a>
               <span className="text-slate-400">·</span>
               <a href="#" className="text-sm text-slate-500 hover:underline">Terms</a>
            </div>
            <div className="flex gap-6 text-sm font-semibold text-slate-700">
               <div className="flex items-center gap-2 cursor-pointer hover:bg-white px-3 py-2 rounded-full transition-colors">
                  <Globe className="w-4 h-4" />
                  <span>English (US)</span>
               </div>
               <div className="flex items-center gap-2 cursor-pointer hover:bg-white px-3 py-2 rounded-full transition-colors">
                  <span>$ USD</span>
               </div>
            </div>
         </div>
      </footer>

    </div>
  );
};