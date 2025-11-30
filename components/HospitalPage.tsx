
import React, { useEffect, useState } from 'react';
import { 
  Activity, Building2, Stethoscope, Package, Users, MapPin, Languages, 
  Award, Bed, Trophy, ChevronDown, ChevronRight, Navigation, Plane, 
  Bus, Flag, Wind, Heart, Link, Brain, Droplet, HeartPulse, Bone, Dna, 
  BrainCircuit, Baby, Utensils, Eye, Ear, ChevronUp, Star, LayoutGrid,
  CheckCircle2, ArrowLeft, ArrowRight, Microscope, Filter, Clock, ChevronLeft,
  GraduationCap, Scan, CheckCircle, Scissors
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
}

export const HospitalPage: React.FC<HospitalPageProps> = ({ hospital, onBack, onNavigateToHospitals, onNavigateToDoctors, onViewGallery, onViewFacilities }) => {
  
  const [activeTab, setActiveTab] = useState('overview');

  // Scroll to top on mount
  useEffect(() => {
    const scrollContainer = document.getElementById('main-content-area');
    if (scrollContainer) {
        scrollContainer.scrollTo(0, 0);
    } else {
        window.scrollTo(0, 0);
    }
  }, [hospital.id]);

  // Scroll Spy Logic to update active tab on scroll
  useEffect(() => {
    const handleScrollSpy = () => {
        const mainContainer = document.getElementById('main-content-area');
        if (!mainContainer) return;

        // Offset for header (Navbar 80px + Sticky Header ~72px + spacing)
        const headerOffset = 180; 
        const scrollPosition = mainContainer.scrollTop + headerOffset;

        const sections = ['overview', 'specialization', 'doctors', 'facilities', 'packages'];
        
        for (const sectionId of sections) {
            const element = document.getElementById(sectionId);
            if (element) {
                // offsetTop is relative to the scroll container since it has position: relative
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
        // Initial check
        handleScrollSpy();
    }

    return () => {
        if (mainContainer) {
            mainContainer.removeEventListener('scroll', handleScrollSpy);
        }
    };
  }, []);

  const scrollToSection = (id: string) => {
    // Optimistic update
    setActiveTab(id);
    
    const element = document.getElementById(id);
    // Navbar (80px) + Sticky Header (72px) + visual breathing room (~30px)
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

  const relatedHospitals = HOSPITALS.filter(h => h.id !== hospital.id && h.country === hospital.country).slice(0, 4);
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

  return (
    <div className="bg-white text-[#1C1C1C] font-sans antialiased w-full min-h-full">

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

      {/* Sticky Info Header - Correctly placed after Hero */}
      <div className="sticky top-20 z-40 bg-white border-b border-gray-100 hidden md:block transition-shadow duration-300">
          <div className="max-w-7xl mx-auto px-6 h-[72px] relative flex items-center justify-center">
              {/* Left: Identity - Absolute Position */}
              <div className="absolute left-6 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 shadow-sm flex items-center justify-center bg-gray-50 text-lg">
                      {hospital.country === 'Thailand' ? '🇹🇭' : 
                       hospital.country === 'Singapore' ? '🇸🇬' : 
                       hospital.country === 'Malaysia' ? '🇲🇾' : '🏳️'}
                  </div>
                  <span className="font-semibold text-slate-900">{hospital.name}</span>
              </div>
              
              {/* Center: Tabs - Centered in Flex container */}
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

              {/* Right: CTA - Absolute Position */}
              <div className="absolute right-6">
                  <button className="bg-[#1C1C1C] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-black transition-colors shadow-sm">
                      Request Treatment Info
                  </button>
              </div>
          </div>
      </div>

      {/* Main Content Split - ID: overview */}
      <div id="overview" className="max-w-7xl mx-auto px-4 md:px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-12 scroll-mt-20">
          
          {/* Left Column: Hospital Info */}
          <div className="lg:col-span-2 space-y-10">
              {/* Header Info */}
              <div className="space-y-6">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div className="space-y-2">
                          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#1C1C1C]">{hospital.name}</h1>
                          <div className="flex items-center gap-2 text-zinc-500 text-sm">
                              <MapPin className="w-4 h-4" />
                              <span>{hospital.location}, {hospital.country}</span>
                          </div>
                          <div className="flex flex-wrap gap-2 pt-1">
                              <span className="bg-[#F1FCA7] text-[#1C1C1C] text-xs px-2.5 py-1 rounded-md font-medium flex items-center gap-1 border border-black/5">
                                  <Languages className="w-3 h-3" /> Language Support
                              </span>
                              <span className="text-xs text-zinc-500 border border-zinc-200 px-2.5 py-1 rounded-md bg-[#FAF8F7]">English, Local, Mandarin</span>
                          </div>
                      </div>
                      <button className="w-full md:w-auto bg-[#1C1C1C] hover:bg-zinc-800 text-white px-6 py-3 rounded-lg text-sm font-medium transition-all shadow-lg shadow-[#1C1C1C]/10 shrink-0 md:hidden">Request Info</button>
                  </div>

                  {hospital.accreditation && hospital.accreditation.length > 0 && (
                  <div className="flex items-start gap-4 p-4 bg-[#FAF8F7] border border-zinc-100 rounded-xl">
                      <div className="w-10 h-10 rounded-full bg-[#F1FCA7] flex items-center justify-center shrink-0">
                          <Award className="w-5 h-5 text-[#1C1C1C]" />
                      </div>
                      <div>
                          <h3 className="font-medium text-[#1C1C1C]">{hospital.accreditation[0]} Accredited</h3>
                          <p className="text-zinc-500 text-sm">International healthcare standards</p>
                      </div>
                  </div>
                  )}

                  <div className="text-zinc-600 text-base leading-relaxed space-y-4">
                      <p>{hospital.description}</p>
                      <p>Recognized globally for its commitment to patient care, advanced medical technology, and a comprehensive range of specialties, ensuring that every patient receives world-class treatment.</p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-6 border-y border-[#FAF8F7] py-8">
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#FAF8F7] flex items-center justify-center text-zinc-600"><Stethoscope className="w-5 h-5" /></div>
                          <div><div className="font-semibold text-[#1C1C1C]">170 specialist</div></div>
                      </div>
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#FAF8F7] flex items-center justify-center text-zinc-600"><Building2 className="w-5 h-5" /></div>
                          <div><div className="font-semibold text-[#1C1C1C]">{hospital.specialties.length} Specialties</div></div>
                      </div>
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#FAF8F7] flex items-center justify-center text-zinc-600"><Bed className="w-5 h-5" /></div>
                          <div><div className="font-semibold text-[#1C1C1C]">200+ beds</div></div>
                      </div>
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#FAF8F7] flex items-center justify-center text-zinc-600"><Users className="w-5 h-5" /></div>
                          <div><div className="font-semibold text-[#1C1C1C]">50k+ patients/yr</div></div>
                      </div>
                  </div>

                  {/* Awards */}
                  <div className="space-y-4">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                          <Trophy className="w-5 h-5" /> Awards & Accreditations
                      </h3>
                      <div className="space-y-4 pl-2">
                          <div className="flex gap-4 text-sm">
                              <span className="font-medium text-[#1C1C1C] w-12 shrink-0">2023</span>
                              <span className="text-zinc-600"><span className="underline decoration-zinc-300 underline-offset-4">Best Medical Tourism Hospital</span> — APAC Healthcare Awards</span>
                          </div>
                          <div className="flex gap-4 text-sm">
                              <span className="font-medium text-[#1C1C1C] w-12 shrink-0">2022</span>
                              <span className="text-zinc-600"><span className="underline decoration-zinc-300 underline-offset-4">Patient Care Excellence</span> — Global Health Asia</span>
                          </div>
                          <button className="text-zinc-500 text-xs font-medium flex items-center gap-1 bg-[#FAF8F7] px-3 py-1.5 rounded-full border border-zinc-200 mt-2 hover:bg-zinc-100">
                              View More <ChevronDown className="w-3 h-3" />
                          </button>
                      </div>
                  </div>
              </div>
          </div>

          {/* Right Column: Widgets */}
          <div className="space-y-6">
              
              {/* Getting Here */}
              <div className="border border-zinc-200 rounded-xl p-6 shadow-sm bg-white">
                  <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2 font-semibold text-[#1C1C1C]">
                          <LayoutGrid className="w-5 h-5" /> Getting Here
                      </div>
                      <div className="text-xs text-zinc-400 text-right">From your Location<br/><span className="text-[#1C1C1C] font-medium flex items-center justify-end gap-1"><Navigation className="w-3 h-3" /> Detected</span></div>
                  </div>
                  
                  <div className="bg-[#FAF8F7] rounded-lg p-4 flex items-center justify-between border border-zinc-100">
                      <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#F1FCA7] rounded-full flex items-center justify-center text-[#1C1C1C]">
                              <Plane className="w-4 h-4" />
                          </div>
                          <div>
                              <div className="text-xs text-zinc-500">By Air</div>
                              <div className="text-sm font-medium text-[#1C1C1C]">Intl Airport Nearby</div>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Surrounding */}
              <div className="border border-zinc-200 rounded-xl p-6 shadow-sm bg-white space-y-6">
                  <div className="flex items-center gap-2 font-semibold text-[#1C1C1C]">
                      <LayoutGrid className="w-5 h-5" /> Surrounding
                  </div>

                  <div className="space-y-4">
                      <div>
                          <div className="flex items-center gap-2 text-sm font-medium text-[#1C1C1C] mb-2">
                              <Plane className="w-4 h-4 text-zinc-400" /> Airports
                          </div>
                          <ul className="pl-6 space-y-2 text-sm text-zinc-600">
                              <li className="flex items-start gap-2"><span className="block w-1.5 h-1.5 bg-zinc-300 rounded-full mt-1.5 shrink-0"></span> International Airport (15km)</li>
                          </ul>
                      </div>
                      <div>
                          <div className="flex items-center gap-2 text-sm font-medium text-[#1C1C1C] mb-2">
                              <Bus className="w-4 h-4 text-zinc-400" /> Transportations
                          </div>
                          <ul className="pl-6 space-y-2 text-sm text-zinc-600">
                              <li className="flex items-start gap-2"><span className="block w-1.5 h-1.5 bg-zinc-300 rounded-full mt-1.5 shrink-0"></span> City Center Bus Line</li>
                          </ul>
                      </div>
                      <div>
                          <div className="flex items-center gap-2 text-sm font-medium text-[#1C1C1C] mb-2">
                              <Flag className="w-4 h-4 text-zinc-400" /> Landmarks
                          </div>
                          <ul className="pl-6 space-y-2 text-sm text-zinc-600">
                              <li className="flex items-start gap-2"><span className="block w-1.5 h-1.5 bg-zinc-300 rounded-full mt-1.5 shrink-0"></span> 5-Star Hotels & Shopping</li>
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
                <div key={idx} className="group p-6 rounded-xl border border-gray-100 bg-white hover:shadow-lg hover:border-gray-200 transition-all duration-300">
                    <div className="w-10 h-10 rounded-full bg-lime-100 flex items-center justify-center mb-4 text-lime-700">
                        <item.icon strokeWidth={1.5} className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-medium mb-2 tracking-tight">{item.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
            ))}
        </div>

        {/* Specialization Tags */}
        <div className="mt-16">
            <h4 className="text-center text-sm font-medium text-gray-900 mb-6">Specialization Available in Our Hospital</h4>
            <div className="flex flex-wrap justify-center gap-3 px-4 max-w-4xl mx-auto">
                {[
                    { icon: Heart, label: "Cardiology" },
                    { icon: Bone, label: "Orthopedics" },
                    { icon: Activity, label: "Oncology" },
                    { icon: Brain, label: "Neurology" },
                    { icon: Baby, label: "Fertility & IVF" },
                    { icon: Stethoscope, label: "Gastroenterology" },
                    { icon: Eye, label: "Ophthalmology" },
                    { icon: Ear, label: "ENT" },
                    { icon: Scissors, label: "General Surgery" },
                    { icon: Microscope, label: "Pathology" },
                    { icon: Scan, label: "Radiology" }
                ].map((tag, i) => (
                    <span key={i} className="inline-flex items-center px-4 py-2 rounded-full border border-gray-200 text-xs text-gray-600 bg-white hover:bg-gray-50 cursor-default transition-colors">
                        <tag.icon className="w-3 h-3 mr-2" /> {tag.label}
                    </span>
                ))}
            </div>
        </div>
      </section>

      {/* Gradient Divider */}
      <div className="w-full h-px bg-gray-100 mb-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 h-full w-32 bg-gradient-to-r from-purple-500 to-blue-500"></div>
      </div>

      {/* 2. Explore Specialists - ID: doctors */}
      <section id="doctors" className="max-w-7xl mx-auto px-6 py-12 scroll-mt-40">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Explore Specialists</h2>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-6">
            <button 
                onClick={onNavigateToDoctors}
                className="px-5 py-2.5 bg-gray-100 text-gray-900 text-sm font-medium rounded-lg border border-transparent whitespace-nowrap hover:bg-gray-200 transition-colors"
            >
                All Doctors
            </button>
            {[
                { icon: Heart, label: "Cardiologist" },
                { icon: Bone, label: "Orthopedics" },
                { icon: Activity, label: "Oncology" },
                { icon: Brain, label: "Neurology" },
                { icon: Baby, label: "Fertility & IVF" },
            ].map((tab, i) => (
                <button key={i} onClick={onNavigateToDoctors} className="px-5 py-2.5 bg-white text-gray-600 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 whitespace-nowrap flex items-center">
                    <tab.icon className="w-4 h-4 mr-2 text-gray-400" />{tab.label}
                </button>
            ))}
             <button onClick={onNavigateToDoctors} className="px-5 py-2.5 bg-white text-gray-600 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 whitespace-nowrap flex items-center">
                <Filter className="w-4 h-4 mr-2" /> +10 More
            </button>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                            <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
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

        <div className="flex justify-center gap-2 mt-8">
            <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"><ChevronLeft className="w-4 h-4 text-gray-500" /></button>
            <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"><ChevronRight className="w-4 h-4 text-gray-500" /></button>
        </div>
      </section>

      {/* 3. Facilities - ID: facilities */}
      <section id="facilities" className="max-w-7xl mx-auto px-6 py-16 bg-white scroll-mt-40">
        <h2 className="text-2xl font-semibold text-center tracking-tight mb-12">Facilities</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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

        <div className="flex justify-center mt-10">
            <button 
                onClick={onViewFacilities}
                className="inline-flex items-center px-6 py-2.5 border border-gray-200 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
            >
                View All Facilities
                <ChevronRight className="w-4 h-4 ml-2" />
            </button>
        </div>
      </section>

      {/* 4. Treatment Package - ID: packages */}
      <section id="packages" className="max-w-7xl mx-auto px-6 py-16 bg-gray-50/50 scroll-mt-40">
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

        <div className="flex justify-center mt-12">
            <button className="px-8 py-3 bg-gray-900 text-white rounded-lg text-xs font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/10">View All Packages</button>
        </div>
      </section>

      {/* 5. Backed by experts */}
      <section className="max-w-7xl mx-auto px-6 py-20">
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
                 <div className="flex justify-end gap-2 mt-4">
                    <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"><ChevronLeft className="w-4 h-4 text-gray-500" /></button>
                    <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"><ChevronRight className="w-4 h-4 text-gray-500" /></button>
                </div>
            </div>
        </div>
      </section>

      {/* 6. FAQ */}
      <section className="max-w-7xl mx-auto px-6 py-12 border-t border-gray-100">
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
        <h2 className="text-2xl font-semibold text-center tracking-tight mb-12">Hospitals You May Also Like</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedHospitals.map((related, i) => (
                <div key={i} className="border border-gray-200 rounded-xl bg-white overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 group cursor-pointer">
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
            {relatedHospitals.length === 0 && (
                <div className="col-span-full text-center text-gray-400 py-10">No other hospitals in this region available yet.</div>
            )}
        </div>
      </section>
      
    </div>
  );
};
