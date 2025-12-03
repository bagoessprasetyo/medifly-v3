import React, { useEffect, useState, useMemo } from 'react';
import { 
  Activity, Building2, Stethoscope, Package, Users, MapPin, Languages, 
  Award, Bed, Trophy, ChevronDown, ChevronRight, Navigation, Plane, 
  Bus, Flag, Wind, Heart, Link, Brain, Droplet, HeartPulse, Bone, Dna, 
  BrainCircuit, Baby, Utensils, Eye, Ear, ChevronUp, Star, LayoutGrid,
  CheckCircle2, ArrowLeft, ArrowRight, Microscope, Filter, Clock, ChevronLeft,
  GraduationCap, Scan, CheckCircle, Scissors, Sparkles, Bot, MessageSquare,
  Crown, Globe, Target, Car, Mountain, BriefcaseMedical
} from 'lucide-react';
import { Hospital } from '../types';
import { HOSPITALS } from '../constants';

interface HospitalPageProps {
  hospital: Hospital;
  onBack: () => void;
  onNavigateToHospitals: () => void;
  onNavigateToDoctors: () => void;
  onViewGallery: () => void;
  onViewFacilities: () => void;
  onAskAria: (query: string) => void;
  onViewSpecialization?: (spec: string) => void;
  onNavigateToHospital?: (hospital: Hospital) => void;
}

export const HospitalPage: React.FC<HospitalPageProps> = ({ 
  hospital, 
  onBack, 
  onNavigateToHospitals, 
  onNavigateToDoctors, 
  onViewGallery, 
  onViewFacilities,
  onAskAria,
  onViewSpecialization,
  onNavigateToHospital
}) => {
  
  const [activeTab, setActiveTab] = useState('overview');
  const [showAllAwards, setShowAllAwards] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    const scrollContainer = document.getElementById('main-content-area');
    if (scrollContainer) {
        scrollContainer.scrollTo(0, 0);
    } else {
        window.scrollTo(0, 0);
    }
  }, [hospital.id]);

  // Scroll Spy Logic
  useEffect(() => {
    const handleScrollSpy = () => {
        const mainContainer = document.getElementById('main-content-area');
        if (!mainContainer) return;

        const headerOffset = 180; 
        const scrollPosition = mainContainer.scrollTop + headerOffset;

        const sections = ['overview', 'specialization', 'doctors', 'facilities', 'packages'];
        
        for (const sectionId of sections) {
            const element = document.getElementById(sectionId);
            if (element) {
                const { offsetTop, offsetHeight } = element;
                if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                    setActiveTab(sectionId);
                    break;
                }
            }
        }
    };

    const mainContainer = document.getElementById('main-content-area');
    if (mainContainer) {
        mainContainer.addEventListener('scroll', handleScrollSpy);
        handleScrollSpy();
    }

    return () => {
        if (mainContainer) {
            mainContainer.removeEventListener('scroll', handleScrollSpy);
        }
    };
  }, []);

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    const offset = 180; 
    
    if (element) {
        const mainContainer = document.getElementById('main-content-area');
        if (mainContainer) {
             const elementTop = element.offsetTop;
             mainContainer.scrollTo({
                 top: elementTop - offset,
                 behavior: 'smooth'
             });
        }
    }
  };

  const relatedHospitals = useMemo(() => {
      return HOSPITALS.filter(h => h.id !== hospital.id && h.country === hospital.country).slice(0, 4);
  }, [hospital]);

  // Explore More Hospitals Logic:
  // 1. Similar Price Range (or within 1 tier)
  // 2. Similar Expertise (specialties overlap)
  // 3. Different Country (to promote exploration) or fall back to any
  const exploreMoreHospitals = useMemo(() => {
      return HOSPITALS.filter(h => {
          if (h.id === hospital.id) return false;
          if (h.country === hospital.country) return false; // Prefer international alternatives

          const priceMatch = h.priceRange === hospital.priceRange || 
                             (h.priceRange.length >= 2 && hospital.priceRange.length >= 2);
          
          const specialtyOverlap = h.specialties.some(s => hospital.specialties.includes(s));
          
          // Similar scale proxy
          const isLarge = hospital.reviewCount > 500;
          const targetIsLarge = h.reviewCount > 500;
          const scaleMatch = isLarge === targetIsLarge;

          return priceMatch && specialtyOverlap && scaleMatch;
      })
      .slice(0, 4);
  }, [hospital]);

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(2);

  // Helper to safely get images or fallback
  const getImages = (count: number) => {
      const sourceImages = hospital.images || [];
      const imgs = sourceImages.length > 0 ? [...sourceImages] : [hospital.imageUrl];
      while (imgs.length < count) {
          imgs.push(imgs[0] || hospital.imageUrl || 'https://via.placeholder.com/800x600');
      }
      return imgs.slice(0, count);
  };

  const galleryImages = getImages(5);

  const tabs = [
      { id: 'overview', label: 'Overview' },
      { id: 'specialization', label: 'Specialization' },
      { id: 'doctors', label: 'Doctor List' },
      { id: 'facilities', label: 'Facilities' },
      { id: 'packages', label: 'Packages' }
  ];

  // Awards Data
  const awardsList = [
      { year: "2019", title: "Asian Hospital Management Awards 2019", org: "Gold Award (Customer Service Category)" },
      { year: "2019", title: "Asia Pacific Society of Infection Control", org: "CSSD Centre of Excellence Award" },
      { year: "2023", title: "Best Medical Tourism Hospital", org: "APAC Healthcare Awards" },
      { year: "2023", title: "Smart Hospital Initiative of the Year", org: "Healthcare Asia" },
      { year: "2022", title: "Patient Care Excellence Award", org: "Global Health Asia" },
      { year: "2021", title: "Gold Seal of Approval®", org: "Joint Commission International (JCI)" },
  ];

  const visibleAwards = showAllAwards ? awardsList : awardsList.slice(0, 2);

  return (
    <div className="bg-white text-[#1C1C1C] font-sans antialiased w-full min-h-full pb-20">

      {/* Mobile Back Button */}
      <div className="md:hidden sticky top-0 z-[50] bg-white/90 backdrop-blur-sm border-b border-[#FAF8F7] px-6 h-16 flex items-center">
          <button 
              onClick={onBack}
              className="p-1 hover:bg-zinc-100 rounded-full transition-colors flex items-center gap-2"
          >
              <ArrowLeft className="w-5 h-5 text-[#1C1C1C]" />
              <span className="font-semibold text-[#1C1C1C]">Back</span>
          </button>
      </div>

      {/* Desktop Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 pt-6 hidden md:block">
          <div className="flex items-center gap-2 text-sm text-slate-500">
              <button onClick={onBack} className="hover:text-slate-900 transition-colors flex items-center gap-1">
                  <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <span className="text-slate-300">|</span>
              <span className="cursor-pointer hover:text-slate-900 transition-colors" onClick={onNavigateToHospitals}>Hospitals</span>
              <ChevronRight className="w-4 h-4 text-slate-300" />
              <span className="font-semibold text-slate-900">{hospital.name}</span>
          </div>
      </div>

      {/* Hero Gallery */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[400px] md:h-[500px]">
              {/* Main Image */}
              <div className="md:col-span-2 relative rounded-2xl overflow-hidden group h-full cursor-pointer" onClick={onViewGallery}>
                  <img src={galleryImages[0]} alt={hospital.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute bottom-4 right-4 bg-[#1C1C1C]/90 backdrop-blur text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium">
                      <Star className="w-3 h-3 fill-[#F1FCA7] text-[#F1FCA7]" />
                      {hospital.rating}/5 ({hospital.reviewCount} reviews)
                  </div>
              </div>
              {/* Side Images Grid */}
              <div className="grid grid-cols-2 gap-4 h-full">
                  {galleryImages.slice(1, 5).map((img, idx) => (
                      <div key={idx} className="rounded-2xl overflow-hidden relative h-full cursor-pointer group" onClick={onViewGallery}>
                          <img src={img} alt={`Facility ${idx}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                          {idx === 3 && (
                              <button 
                                onClick={(e) => { e.stopPropagation(); onViewGallery(); }}
                                className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-[#1C1C1C] text-xs font-medium px-3 py-1.5 rounded-md shadow-sm flex items-center gap-1.5 transition-colors z-10"
                              >
                                  <LayoutGrid className="w-3.5 h-3.5" /> Show All
                              </button>
                          )}
                      </div>
                  ))}
              </div>
          </div>
      </div>

      {/* Sticky Info Header */}
      <div className="sticky top-20 z-40 bg-white border-b border-gray-100 hidden md:block transition-shadow duration-300">
          <div className="max-w-7xl mx-auto px-6 h-[72px] relative flex items-center justify-center">
              {/* Left: Identity */}
              <div className="absolute left-6 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 shadow-sm flex items-center justify-center bg-gray-50 text-lg">
                      {hospital.country === 'Thailand' ? '🇹🇭' : 
                       hospital.country === 'Singapore' ? '🇸🇬' : 
                       hospital.country === 'Malaysia' ? '🇲🇾' : '🏳️'}
                  </div>
                  <span className="font-semibold text-slate-900">{hospital.name}</span>
              </div>
              
              {/* Center: Tabs */}
              <div className="flex items-center gap-8 h-full">
                  {tabs.map(tab => (
                      <button 
                        key={tab.id}
                        onClick={() => scrollToSection(tab.id)}
                        className={`
                            h-full flex items-center text-sm font-medium border-b-[3px] transition-all px-1
                            ${activeTab === tab.id ? 'border-[#1C1C1C] text-[#1C1C1C]' : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-200'}
                        `}
                      >
                          {tab.label}
                      </button>
                  ))}
              </div>

              {/* Right: CTA */}
              <div className="absolute right-6">
                  <button 
                    onClick={() => onAskAria(`I have questions about ${hospital.name}`)}
                    className="bg-[#1C1C1C] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-black transition-all shadow-sm shadow-slate-200 flex items-center gap-2 active:scale-95"
                  >
                      Book a Consultation
                  </button>
              </div>
          </div>
      </div>

      {/* Main Content Split - ID: overview */}
      <div id="overview" className="max-w-7xl mx-auto px-4 md:px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-12 scroll-mt-20">
          
          {/* Left Column: Hospital Info */}
          <div className="lg:col-span-2 space-y-8">
              
              {/* 1. Header Title & Action */}
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1C1C1C] leading-tight">
                      {hospital.name}
                  </h1>
                  <button className="hidden md:block bg-[#1C1C1C] text-white px-6 py-3 rounded-lg font-medium text-sm hover:bg-black transition-colors shadow-lg shadow-black/5 whitespace-nowrap">
                      Book a Consultation
                  </button>
                  {/* Mobile Ask Aria */}
                  <button 
                    onClick={() => onAskAria(`Info about ${hospital.name}`)}
                    className="w-full md:hidden bg-[#1C1C1C] hover:bg-zinc-800 text-white px-6 py-3 rounded-lg text-sm font-medium transition-all shadow-lg"
                  >
                    Ask Aria
                  </button>
              </div>

              {/* 2. Badges Row */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-slate-800">
                  <div className="flex items-center gap-1.5">
                      <Crown className="w-4 h-4" /> VIP Patient Support
                  </div>
                  <div className="flex items-center gap-1.5">
                      <Plane className="w-4 h-4" /> Easy Airport Access
                  </div>
                  <div className="flex items-center gap-1.5">
                      <Globe className="w-4 h-4" /> Popular with Foreigners
                  </div>
              </div>

              {/* 3. Language Support */}
              <div>
                  <span className="inline-flex items-center gap-2 bg-[#F1FCA7] px-3 py-1.5 rounded text-xs font-semibold text-slate-900">
                      <Languages className="w-3.5 h-3.5" />
                      Language Support: {hospital.languages?.join(', ') || "English, Melayu, Mandarin, Hokkien, Cantonese"}
                  </span>
              </div>

              {/* 4. Accreditations Row */}
              <div className="flex flex-col sm:flex-row gap-6 p-5 bg-[#FAFAFA] rounded-xl border border-slate-100">
                  {/* JCI */}
                  <div className="flex gap-3 items-center">
                     <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-sm flex items-center justify-center text-white font-bold text-[10px] border-2 border-white ring-1 ring-yellow-100">
                        JCI
                     </div>
                     <div>
                         <div className="font-bold text-slate-900 text-sm">JCI Accredited</div>
                         <div className="text-xs text-slate-500">International healthcare standards</div>
                     </div>
                  </div>
                  {/* ACCME (Mock) */}
                  <div className="flex gap-3 items-center">
                     <div className="w-10 h-10 bg-[#008080] text-white font-bold flex items-center justify-center rounded-lg shadow-sm text-sm">
                        A
                     </div>
                     <div>
                         <div className="font-bold text-slate-900 text-sm">ACCME-Accredited</div>
                         <div className="text-xs text-slate-500">Committed in medical education</div>
                     </div>
                  </div>
              </div>

              {/* 5. Description */}
              <div className="text-slate-600 text-sm leading-relaxed space-y-4">
                  <p>{hospital.description}</p>
                  <p>{hospital.name} is a JCI and MSQH accredited facility and will remain one of the leading medical centres that cater to the growing number of local population in Penang, Northern region and neighbouring countries.</p>
              </div>

              {/* 6. Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-2 gap-y-6 gap-x-12 border-y border-slate-100 py-8">
                  <div className="flex items-center gap-3">
                      <Stethoscope className="w-5 h-5 text-slate-900" strokeWidth={1.5} />
                      <div className="font-semibold text-[#1C1C1C] text-sm">170 specialists</div>
                  </div>
                  <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-slate-900" strokeWidth={1.5} />
                      <div className="font-semibold text-[#1C1C1C] text-sm">{hospital.specialties.length} Specialties</div>
                  </div>
                  <div className="flex items-center gap-3">
                      <Bed className="w-5 h-5 text-slate-900" strokeWidth={1.5} />
                      <div className="font-semibold text-[#1C1C1C] text-sm">380 beds</div>
                  </div>
                  <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-slate-900" strokeWidth={1.5} />
                      <div className="font-semibold text-[#1C1C1C] text-sm">333K+ patients annually</div>
                  </div>
              </div>

              {/* 7. Awards */}
              <div className="space-y-4">
                  <h3 className="font-bold text-lg flex items-center gap-2 text-slate-900">
                      <Trophy className="w-5 h-5" /> Awards & Accreditations
                  </h3>
                  <div className="space-y-4 pl-2">
                      {visibleAwards.map((award, i) => (
                          <div key={i} className="flex gap-4 text-sm animate-in fade-in slide-in-from-top-1 duration-300">
                              <span className="font-bold text-[#1C1C1C] w-12 shrink-0">{award.year}</span>
                              <div className="flex-1 h-px bg-slate-200 my-auto max-w-[20px] hidden sm:block"></div>
                              <span className="text-slate-600">
                                <span className="underline decoration-slate-300 underline-offset-4 font-medium text-slate-800">{award.title}</span> — {award.org}
                              </span>
                          </div>
                      ))}
                      
                      <button 
                        onClick={() => setShowAllAwards(!showAllAwards)}
                        className="text-slate-600 text-xs font-semibold flex items-center gap-1 border border-slate-200 px-4 py-2 rounded-lg mt-2 hover:bg-slate-50 transition-colors w-fit"
                      >
                          {showAllAwards ? 'View Less' : 'View More'} 
                          <ChevronDown className={`w-3 h-3 transition-transform ${showAllAwards ? 'rotate-180' : ''}`} />
                      </button>
                  </div>
              </div>
          </div>

          {/* Right Column: Widgets */}
          <div className="space-y-6">
              
              {/* AI Concierge Widget */}
              <div className="border border-slate-200 bg-gradient-to-br from-white to-slate-50 rounded-xl p-6 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Bot className="w-24 h-24 text-slate-900" />
                  </div>
                  
                  <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-3">
                          <div className="p-2 bg-[#1C1C1C] rounded-lg text-[#F1FCA7] shadow-lg shadow-slate-200">
                              <Sparkles className="w-4 h-4" />
                          </div>
                          <div>
                              <h3 className="font-bold text-gray-900 text-sm">Hospital Concierge</h3>
                              <p className="text-[10px] text-slate-500 font-medium">Powered by Aria AI</p>
                          </div>
                      </div>
                      
                      <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                          I can analyze <strong>{hospital.name}</strong>'s pricing, insurance coverage, and specialist availability instantly.
                      </p>

                      <div className="grid grid-cols-2 gap-2 mb-4">
                          {["Pricing", "Insurance", "Doctors", "Booking"].map((item, i) => (
                              <button 
                                key={i}
                                onClick={() => onAskAria(`Tell me about ${item.toLowerCase()} at ${hospital.name}`)}
                                className="text-xs font-medium bg-white border border-slate-200 text-slate-700 py-2 px-3 rounded-lg hover:border-slate-900 hover:text-slate-900 transition-all text-left hover:shadow-sm"
                              >
                                  {item === "Pricing" ? "💰" : item === "Insurance" ? "🛡️" : item === "Doctors" ? "👨‍⚕️" : "📅"} {item}
                              </button>
                          ))}
                      </div>

                      <button 
                          onClick={() => onAskAria(`I have general questions about ${hospital.name}`)}
                          className="w-full bg-white border border-slate-200 text-slate-400 text-xs py-3 px-4 rounded-xl text-left flex justify-between items-center hover:border-slate-900 hover:text-slate-600 transition-colors shadow-sm group/input"
                      >
                          <span>Ask anything...</span>
                          <div className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center group-hover/input:bg-[#1C1C1C] transition-colors">
                              <ArrowRight className="w-3 h-3 text-slate-400 group-hover/input:text-[#F1FCA7] transition-colors" />
                          </div>
                      </button>
                  </div>
              </div>

              {/* Getting Here Widget */}
              <div className="border border-zinc-200 rounded-xl p-6 shadow-sm bg-white">
                  <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2 font-bold text-[#1C1C1C]">
                          <div className="p-1.5 bg-slate-100 rounded-full"><Navigation className="w-4 h-4" /></div>
                          Getting Here
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wide mb-0.5">From your Location</div>
                        <div className="text-sm font-bold text-slate-900 flex items-center justify-end gap-1.5">
                            <Target className="w-3.5 h-3.5" /> Jakarta
                        </div>
                      </div>
                  </div>
                  
                  <div className="flex items-center gap-4 pt-2">
                      <div className="w-12 h-12 bg-[#E4F28A] rounded-full flex items-center justify-center text-[#1C1C1C] border-4 border-white shadow-sm ring-1 ring-slate-100">
                          <Plane className="w-5 h-5 rotate-[-45deg]" strokeWidth={2} />
                      </div>
                      <div>
                          <div className="text-xs text-zinc-500 font-medium mb-0.5">By Air</div>
                          <div className="text-sm font-bold text-[#1C1C1C]">Less than 3 hour Away</div>
                      </div>
                  </div>
              </div>

              {/* Around the Area Widget */}
              <div className="border border-zinc-200 rounded-xl p-6 shadow-sm bg-white">
                  <div className="flex items-center gap-2 font-bold text-[#1C1C1C] mb-4">
                      <div className="p-1.5 bg-slate-100 rounded-full"><Scan className="w-4 h-4" /></div>
                      Around the Area
                  </div>

                  <div className="flex items-center gap-2 mb-5 cursor-pointer hover:opacity-80 transition-opacity">
                       <MapPin className="w-4 h-4 text-slate-500" />
                       <span className="font-semibold text-slate-900 text-sm">Map</span>
                  </div>

                  {/* Map Placeholder */}
                  <div className="w-full h-32 bg-slate-100 rounded-xl mb-5 overflow-hidden relative border border-slate-200 group cursor-pointer">
                      <img 
                        src="https://api.mapbox.com/styles/v1/mapbox/light-v10/static/100.3,5.4,13,0/400x200?access_token=pk.eyJ1IjoibWVkaWZseSIsImEiOiJjbTdtbnh5aXYwMHFyMmtzY3Z3Z3l3c3d6In0.99999999999" 
                        alt="Map" 
                        className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                        onError={(e) => (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=400'}
                      />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold text-slate-900 shadow-sm border border-slate-200">View Map</div>
                      </div>
                  </div>

                  {/* Address */}
                  <div className="flex gap-3 mb-6 text-xs text-slate-600 items-start leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <div className="w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                         <span className="text-[10px]">🇲🇾</span>
                      </div>
                      <p>1, Jalan Pangkor, 10050 George Town, Pulau Pinang, Malaysia</p>
                  </div>

                  <div className="space-y-5">
                      <div>
                          <div className="flex items-center gap-2 text-sm font-bold text-[#1C1C1C] mb-2">
                              <Plane className="w-4 h-4 text-slate-400" /> Airports
                          </div>
                          <ul className="pl-8 space-y-2 text-xs text-slate-600 list-disc marker:text-slate-300">
                              <li>Penang International Airport (PEN) | 5.8 km away</li>
                          </ul>
                      </div>
                      <div>
                          <div className="flex items-center gap-2 text-sm font-bold text-[#1C1C1C] mb-2">
                              <Bus className="w-4 h-4 text-slate-400" /> Transportations
                          </div>
                          <ul className="pl-8 space-y-2 text-xs text-slate-600 list-disc marker:text-slate-300">
                              <li>Rapid Penang Bus line 102 | 5.8 km away</li>
                          </ul>
                      </div>
                      <div>
                          <div className="flex items-center gap-2 text-sm font-bold text-[#1C1C1C] mb-2">
                              <Flag className="w-4 h-4 text-slate-400" /> Landmarks
                          </div>
                          <ul className="pl-8 space-y-2 text-xs text-slate-600 list-disc marker:text-slate-300">
                              <li>Buddhist Temple Wat Buppharam | 5.8 km away</li>
                              <li>Giant Penang Plaza | 5.8 km away</li>
                              <li>Ivy’s Nyonya Cuisine | 5.8 km away</li>
                          </ul>
                      </div>
                  </div>
              </div>

          </div>
      </div>

      {/* --- Appended Details Sections --- */}

      {/* 1. Top Expertise - ID: specialization */}
      <section id="specialization" className="max-w-7xl mx-auto px-6 py-16 scroll-mt-40">
        <h2 className="text-3xl font-semibold text-center tracking-tight mb-12">Our Top Expertise</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
                { icon: Wind, title: "Pulmonology", desc: "Advanced care for lungs with leading specialists and integrated treatments." },
                { icon: HeartPulse, title: "Cardiology", desc: "Trusted heart specialists offering preventive and corrective care." },
                { icon: Microscope, title: "Oncology", desc: "Expert cancer care and support utilizing latest surgery protocols." },
                { icon: BrainCircuit, title: "Neurology", desc: "Specialized brain & nerve care with precise diagnosis tools." },
                { icon: Droplet, title: "Hematology", desc: "State-of-the-art care, diagnosis and concerns for blood-related issues." },
            ].map((item, idx) => (
                <div 
                    key={idx} 
                    className="group p-6 rounded-xl border border-gray-100 bg-white hover:shadow-lg hover:border-gray-200 transition-all duration-300 cursor-pointer"
                    onClick={() => onViewSpecialization?.(item.title)}
                >
                    <div className="w-10 h-10 rounded-full bg-lime-100 flex items-center justify-center mb-4 text-lime-700">
                        <item.icon strokeWidth={1.5} className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-medium mb-2 tracking-tight group-hover:text-[#1C1C1C] transition-colors">{item.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
            ))}
        </div>

        {/* Other Specializations Grid */}
        <div className="mt-20 bg-[#FAFAFA] rounded-2xl p-8 md:p-12">
            <h4 className="text-center text-xl font-medium text-gray-900 mb-10">Other Specializations Available</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
                {[
                    "Fertility & IVF",
                    "Gastroenterology",
                    "Internal Medicine",
                    "Aesthetics",
                    "Dermatology",
                    "General Surgery",
                    "Dental Care",
                    "Diabetes & Chronic Diseases Care",
                    "ENT"
                ].map((spec, i) => (
                    <div 
                        key={i} 
                        onClick={() => onViewSpecialization?.(spec)}
                        className="bg-white px-6 py-4 rounded-xl border border-gray-100 text-sm font-medium text-gray-800 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-gray-300 hover:text-black flex justify-between items-center group"
                    >
                        {spec}
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" />
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* 2. Explore Specialists - ID: doctors */}
      <section id="doctors" className="max-w-7xl mx-auto px-6 py-12 scroll-mt-40">
        {/* ... (Same as previous, abbreviated for brevity) ... */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Explore Specialists</h2>
        </div>
        {/* ... (Grid code remains) ... */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {/* ... (Doctor cards loop - keeping existing logic) ... */}
             {[
                { name: "Dr. Khoo Eng Huei", role: "Nephrology", img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400", time: "Mon, Wed, Fri" },
                { name: "Dr. Tan Wei Ching", role: "Cardiology", img: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400", time: "Tue, Thu" },
                { name: "Dr. Lim Chee Yeong", role: "Oncology", img: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400", time: "Mon-Fri" },
                { name: "Dr. Sarah Lee", role: "Pediatrics", img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400", time: "Sat" }
            ].map((doc, i) => (
                <div key={i} className="group border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all">
                    <div className="bg-gray-50 aspect-[4/3] relative">
                        <img src={doc.img} alt="Doctor" className="w-full h-full object-cover object-top mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-5">
                        <h3 className="text-base font-semibold text-gray-900 mb-1">{doc.name}</h3>
                        <div className="flex items-center text-xs text-gray-500 mb-3">
                            <span className="w-2 h-2 rounded-full bg-red-50 mr-2"></span>
                            {hospital.name}, {hospital.country}
                        </div>
                        <p className="text-xs font-medium text-gray-900 mb-1">{doc.role}</p>
                        <p className="text-xs text-gray-400 mb-4 line-clamp-1">{doc.role}, Internal Medicine, Surgery</p>
                        
                        <div className="flex gap-2 text-xs text-gray-500 mb-2">
                            <Clock className="w-3 h-3 mt-0.5" /> {doc.time} (09:00 - 16:00)
                        </div>
                        <div className="flex gap-2 text-xs text-gray-500 mb-4">
                            <Languages className="w-3 h-3 mt-0.5" /> English, Local
                        </div>

                        <button className="w-full py-2.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">Overview</button>
                    </div>
                </div>
            ))}
         </div>
      </section>

      {/* 3. Facilities - ID: facilities */}
      <section id="facilities" className="max-w-7xl mx-auto px-6 py-16 bg-white scroll-mt-40">
        <h2 className="text-2xl font-semibold text-center tracking-tight mb-12">Facilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
             {/* ... (Keeping facilities grid logic) ... */}
             {[
                { title: "Medical & Treatment Centres", img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400", items: ["Accident & Emergency (A&E)", "Intensive Care Unit (ICU)", "Blood/Stem Cell Bio", "Cardiology Clinic"] },
                { title: "Treatment Technology", img: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=400", items: ["Robotic Surgery System", "Varian TrueBeam Linear", "3T MRI Scan", "1024-Slice CT Scan"] },
                { title: "Patient Care & Recovery", img: "https://images.unsplash.com/photo-1596541223130-5d31a73fb6c6?auto=format&fit=crop&q=80&w=400", items: ["Inpatient Rooms", "Maternity Rooms", "Paediatric Care Services", "Rehabilitation & Physio"] },
                { title: "Amenities & Support Services", img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=400", items: ["Pharmacy", "Food & Beverage", "Laboratory Services", "Billing & Insurance"] }
            ].map((fac, idx) => (
                <div key={idx}>
                    <div className="aspect-video rounded-lg overflow-hidden mb-4 bg-gray-100 relative group">
                        <img src={fac.img} alt={fac.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <h3 className="text-sm font-semibold mb-3">{fac.title}</h3>
                    <ul className="space-y-2">
                        {fac.items.map((item, i) => (
                            <li key={i} className="flex items-start text-xs text-gray-500">
                                <CheckCircle className="w-3 h-3 text-gray-400 mr-2 mt-0.5" /> {item}
                            </li>
                        ))}
                        <li className="flex items-start text-xs text-gray-400 ml-5">+{Math.floor(Math.random() * 10) + 5} More</li>
                    </ul>
                </div>
            ))}
        </div>
        {/* ... */}
      </section>

      {/* 4. Treatment Package - ID: packages */}
      <section id="packages" className="max-w-7xl mx-auto px-6 py-16 bg-gray-50/50 scroll-mt-40">
          {/* ... (Packages grid - abbreviated) ... */}
           <div className="text-center max-w-2xl mx-auto mb-12">
             <h2 className="text-2xl font-semibold tracking-tight text-gray-900 mb-3">Treatment Package</h2>
             <p className="text-sm text-gray-500">Discover our curated medical packages with world-class supervision, advanced technology, and personalized treatments.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
                "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400",
                "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=400",
                "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=400",
                "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=400"
            ].map((img, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 group">
                    <div className="h-40 overflow-hidden relative">
                        <img src={img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-5">
                        <h3 className="text-sm font-semibold mb-1">Basic Medical Check-Up</h3>
                        <p className="text-xs text-gray-500 mb-3">Medical Check-Up</p>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-4 h-4 rounded-full bg-lime-400 flex items-center justify-center text-[8px] text-white">✓</div>
                            <span className="text-[10px] text-gray-500 uppercase tracking-wide truncate">{hospital.name}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900 mb-4">$450</p>
                        <button className="w-full py-2 rounded border border-gray-200 text-xs font-medium hover:bg-gray-50 transition-colors">View Detail</button>
                    </div>
                </div>
            ))}
        </div>
      </section>

      {/* 5. Backed by experts */}
      <section className="max-w-7xl mx-auto px-6 py-20">
          {/* ... (Experts section - abbreviated) ... */}
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="col-span-1 py-4">
                <h2 className="text-3xl font-semibold tracking-tight text-gray-900 mb-6 leading-tight">Backed by the country's leading health experts</h2>
                <p className="text-base text-gray-500 leading-relaxed mb-6">
                    At {hospital.name}, our mission is to provide the best of clinical care. Top medical experts across disciplines are part of our extensive health network. With their broad range of achievements, clinical efficiency, and caring touch, rest assured, you are in the right hands.
                </p>
            </div>
            <div className="col-span-1 lg:col-span-2 overflow-hidden">
                <div className="flex gap-6 overflow-x-auto no-scrollbar pb-6">
                    {[
                        { name: "Rachel Yew", role: "Chief Executive Officer", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400", uni: "University of Malaysia", exp: "15 Years" },
                        { name: "Dr. Kelvin Ching", role: "Chief Medical Officer", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400", uni: "University of Glasgow", exp: "20 Years" },
                        { name: "Dr. Kamal Amzan", role: "Chief Operations Officer", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400", uni: "University of Malaya", exp: "MBA Healthcare" }
                    ].map((exec, i) => (
                        <div key={i} className="min-w-[280px] md:min-w-[320px]">
                            <div className="h-48 overflow-hidden rounded-t-xl bg-gray-100">
                                <img src={exec.img} className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="bg-gray-50 p-6 rounded-b-xl border-x border-b border-gray-100">
                                <h3 className="font-semibold text-gray-900">{exec.name}</h3>
                                <p className="text-xs text-gray-500 mb-4">{exec.role}</p>
                                <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-3">Leading with extensive experience to ensure the highest operational and clinical standards.</p>
                                <div className="flex flex-col gap-1 text-[10px] text-gray-500">
                                    <span className="flex items-center"><GraduationCap className="w-3 h-3 mr-1" /> {exec.uni}</span>
                                    <span className="flex items-center"><Award className="w-3 h-3 mr-1" /> {exec.exp}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </section>

      {/* 6. FAQ */}
      <section className="max-w-7xl mx-auto px-6 py-12 border-t border-gray-100">
        {/* ... (FAQ section - abbreviated) ... */}
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900 mb-8">Frequently Asked Question</h2>
        <div className="space-y-4">
            {[
                "Is this hospital provider decent standard?",
                "How does Medifly AI works?",
                "Can Medifly AI help me to hire medical trip?",
                "How do I book a for treatment?"
            ].map((q, i) => (
                <div key={i} className="border-b border-gray-100 pb-4">
                    <button 
                        onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                        className="flex items-center justify-between w-full text-left focus:outline-none group"
                    >
                        <span className={`text-sm font-medium ${openFaqIndex === i ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900'}`}>{q}</span>
                        {openFaqIndex === i ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </button>
                    {openFaqIndex === i && (
                        <div className="mt-3 animate-in slide-in-from-top-1 duration-200">
                             <p className="text-sm text-gray-500 leading-relaxed pr-8">Absolutely. Medifly AI assists you through every step of your medical journey — from finding the right hospital and doctor to estimating costs, planning your stay, and arranging travel details. We create medical trips around, smarten, and stress-free.</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
      </section>

      {/* 7. Related Hospitals */}
      <section className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-semibold text-center tracking-tight mb-12">Hospitals in the Area</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedHospitals.map((related, i) => (
                <div key={i} className="border border-gray-200 rounded-xl bg-white overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 group cursor-pointer" onClick={() => onNavigateToHospital?.(related)}>
                    <div className="h-40 bg-gray-200 relative">
                        <img src={related.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm">{related.rating} ★ ({related.reviewCount})</div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                        <h3 className="font-semibold text-sm mb-1 truncate">{related.name}</h3>
                        <p className="text-xs text-gray-500 mb-3 flex items-center"><MapPin className="w-3 h-3 mr-1" /> {related.location}, {related.country}</p>
                        {related.accreditation && related.accreditation.length > 0 && (
                            <div className="flex items-center gap-1 text-[10px] text-lime-600 bg-lime-50 px-2 py-1 rounded w-fit mb-3 border border-lime-100">
                                <CheckCircle className="w-3 h-3" /> {related.accreditation[0]} Accredited
                            </div>
                        )}
                        <p className="text-xs text-gray-400 line-clamp-2 mb-4">{related.description}</p>
                        <div className="mt-auto pt-3 border-t border-gray-100 flex gap-2 text-[10px] text-gray-500">
                            <span className="flex items-center"><Languages className="w-3 h-3 mr-1" /> English, Local</span>
                            <span className="flex items-center ml-auto"><Bed className="w-3 h-3 mr-1" /> 200+ Beds</span>
                        </div>
                        <button className="mt-4 w-full py-2 border border-gray-200 rounded text-xs font-medium hover:bg-gray-50 transition-colors">Hospital Overview</button>
                    </div>
                </div>
            ))}
        </div>
        <div className="flex justify-center mt-8">
            <button 
                onClick={onNavigateToHospitals}
                className="border border-gray-200 bg-white text-slate-900 px-8 py-3 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors"
            >
                Discover More Hospitals
            </button>
        </div>
      </section>

      {/* 8. Explore More Hospitals (New Section) */}
      <section className="max-w-7xl mx-auto px-6 py-16 border-t border-gray-100">
        <h2 className="text-2xl font-semibold text-center tracking-tight mb-12">Explore More Hospital</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {exploreMoreHospitals.map((h, i) => (
               <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group cursor-pointer flex flex-col h-full" onClick={() => onNavigateToHospital?.(h)}>
                    {/* Image Header */}
                    <div className="h-48 relative bg-gray-200 overflow-hidden">
                        <img src={h.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={h.name} />
                        {/* Google Rating Badge Overlay - Bottom Left */}
                        <div className="absolute bottom-2 left-2 bg-[#1A1A1A]/90 backdrop-blur px-2 py-1 rounded flex items-center gap-1 text-white text-[10px]">
                            <span className="font-bold">G</span>
                            <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                            <span className="font-bold">{h.rating}/5</span>
                            <span className="text-gray-400">({h.reviewCount} reviews)</span>
                        </div>
                    </div>
                    
                    <div className="p-4 flex flex-col flex-1">
                        {/* Title & Price */}
                        <div className="flex justify-between items-start mb-1">
                            <h3 className="font-bold text-slate-900 text-base line-clamp-1 leading-tight" title={h.name}>{h.name}</h3>
                            <span className="text-slate-400 text-sm font-medium flex shrink-0 ml-2">
                                <span className="text-slate-900">{h.priceRange}</span>
                                <span className="opacity-30">{Array(Math.max(0, 3 - h.priceRange.length)).fill('$').join('')}</span>
                            </span>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                             <span>
                                {h.country === 'Malaysia' ? '🇲🇾' : 
                                 h.country === 'Singapore' ? '🇸🇬' : 
                                 h.country === 'Thailand' ? '🇹🇭' : '🏳️'}
                             </span>
                             <span className="truncate">{h.location}, {h.country}</span>
                        </div>

                        {/* Travel Time */}
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700 mb-4">
                            <div className="w-5 h-5 rounded-full bg-[#E4F28A] flex items-center justify-center shrink-0">
                                <Plane className="w-3 h-3 rotate-[-45deg]" />
                            </div>
                            <span>Less than 3 hour Away</span>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-3 min-h-[3.5em]">
                            Committed to patient-centered care, {h.name} ensures high-quality treatments tailored to individual needs.
                        </p>

                        {/* Language */}
                        <div className="flex items-center gap-2 text-xs text-slate-600 mb-2">
                            <Languages className="w-3.5 h-3.5 text-slate-400" />
                            <span className="truncate">{h.languages?.slice(0,3).join(', ') || 'English, Local'}</span>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-between text-[10px] text-slate-500 mb-4 mt-auto pt-3">
                             <div className="flex items-center gap-1.5">
                                 <Stethoscope className="w-3.5 h-3.5 text-slate-400" /> 170 specialists
                             </div>
                             <div className="flex items-center gap-1.5">
                                 <BriefcaseMedical className="w-3.5 h-3.5 text-slate-400" /> {h.specialties.length}+ specialization
                             </div>
                        </div>

                        {/* Button */}
                        <button className="w-full py-2.5 rounded-lg border border-gray-200 text-xs font-bold text-slate-900 hover:bg-slate-50 transition-colors">
                            Learn More
                        </button>
                    </div>
                </div>
           ))}
        </div>
        <div className="flex justify-center mt-8">
            <button 
                onClick={onNavigateToHospitals}
                className="border border-gray-200 bg-white text-slate-900 px-8 py-3 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors"
            >
                Discover More Hospitals
            </button>
        </div>
      </section>

      {/* Floating Action Button (Concierge) */}
      {/* <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-10 fade-in duration-500">
        <button 
            onClick={() => onAskAria(`Start a concierge session for ${hospital.name}. I need help with...`)}
            className="group flex items-center gap-3 bg-[#1C1C1C] text-white p-2 pr-6 rounded-full shadow-2xl hover:scale-105 transition-all border border-gray-800"
        >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-[#1C1C1C]">
                 <img src={hospital.imageUrl} alt="Logo" className="w-full h-full object-cover opacity-80" />
            </div>
            <div className="text-left">
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Concierge</p>
                <p className="text-sm font-bold leading-none">Ask Aria</p>
            </div>
        </button>
      </div> */}
      
    </div>
  );
};