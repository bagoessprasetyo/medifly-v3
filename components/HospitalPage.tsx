
import React, { useEffect } from 'react';
import { 
  Activity, Building2, Stethoscope, Package, Users, MapPin, Languages, 
  Award, Bed, Trophy, ChevronDown, ChevronRight, Navigation, Plane, 
  Bus, Flag, Wind, Heart, Link, Brain, Droplet, HeartPulse, Bone, Dna, 
  BrainCircuit, Baby, Utensils, Eye, Ear, ChevronUp, Star, LayoutGrid,
  CheckCircle2, ArrowLeft, ArrowRight
} from 'lucide-react';
import { Hospital } from '../types';
import { HOSPITALS } from '../constants';

interface HospitalPageProps {
  hospital: Hospital;
  onBack: () => void;
  onNavigateToHospitals: () => void;
  onNavigateToDoctors: () => void;
}

export const HospitalPage: React.FC<HospitalPageProps> = ({ hospital, onBack, onNavigateToHospitals, onNavigateToDoctors }) => {
  
  // Scroll to top on mount
  useEffect(() => {
    const scrollContainer = document.getElementById('main-content-area');
    if (scrollContainer) {
        scrollContainer.scrollTo(0, 0);
    } else {
        window.scrollTo(0, 0);
    }
  }, [hospital.id]);

  const relatedHospitals = HOSPITALS.filter(h => h.id !== hospital.id && h.country === hospital.country).slice(0, 4);

  // Helper to safely get images or fallback
  const getImages = (count: number) => {
      const imgs = (hospital.images && hospital.images.length > 0) ? [...hospital.images] : [hospital.imageUrl];
      // Pad with main image if not enough
      while (imgs.length < count) {
          imgs.push(imgs[0] || hospital.imageUrl); // Fallback to first available or main imageUrl
      }
      return imgs.slice(0, count);
  };

  const galleryImages = getImages(5); // 1 main + 4 side

  return (
    <div className="bg-white text-[#1C1C1C] font-sans antialiased w-full min-h-full">

      {/* Navbar */}
      <nav className="border-b border-[#FAF8F7] sticky top-0 z-[50] bg-white/90 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
              <div className="flex items-center gap-4">
                  <button 
                      onClick={onBack}
                      className="p-1 hover:bg-zinc-100 rounded-full transition-colors md:hidden"
                  >
                      <ArrowLeft className="w-5 h-5 text-[#1C1C1C]" />
                  </button>
                  <div className="flex items-center gap-2 cursor-pointer" onClick={onBack}>
                      <div className="w-6 h-6 bg-black rounded-tr-lg rounded-bl-lg rounded-br-sm"></div>
                      <span className="font-semibold text-lg tracking-tight text-[#1C1C1C]">Medifly</span>
                  </div>
              </div>
              
              <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
                  <button onClick={onNavigateToHospitals} className="flex items-center gap-2 hover:text-[#1C1C1C] transition-colors"><Building2 className="w-4 h-4" /> Hospitals</button>
                  <button onClick={onNavigateToDoctors} className="flex items-center gap-2 hover:text-[#1C1C1C] transition-colors"><Stethoscope className="w-4 h-4" /> Doctors</button>
                  <button className="flex items-center gap-2 hover:text-[#1C1C1C] transition-colors"><Package className="w-4 h-4" /> Packages</button>
                  <button className="flex items-center gap-2 hover:text-[#1C1C1C] transition-colors"><Users className="w-4 h-4" /> About Us</button>
              </div>

              <div className="flex items-center gap-3">
                 <button className="bg-[#1C1C1C] text-white text-sm px-4 py-2 rounded-md font-medium hover:bg-zinc-800 transition-colors shadow-sm">Get Started</button>
              </div>
          </div>
      </nav>

      {/* Sub Nav */}
      <div className="border-b border-[#FAF8F7] bg-white sticky top-16 z-40 hidden md:block">
          <div className="max-w-7xl mx-auto px-6">
              <div className="flex gap-8 text-sm overflow-x-auto no-scrollbar">
                  <button className="py-4 text-[#1C1C1C] border-b-2 border-[#1C1C1C] font-medium">Overview</button>
                  <button className="py-4 text-zinc-500 hover:text-[#1C1C1C] transition-colors">Specialization</button>
                  <button className="py-4 text-zinc-500 hover:text-[#1C1C1C] transition-colors">Facilities</button>
                  <button className="py-4 text-zinc-500 hover:text-[#1C1C1C] transition-colors">Treatment Package</button>
                  <button className="py-4 text-zinc-500 hover:text-[#1C1C1C] transition-colors">List of Doctor</button>
              </div>
          </div>
      </div>

      {/* Hero Gallery */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[400px] md:h-[500px]">
              {/* Main Image */}
              <div className="md:col-span-2 relative rounded-2xl overflow-hidden group h-full">
                  <img src={galleryImages[0]} alt={hospital.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute bottom-4 right-4 bg-[#1C1C1C]/90 backdrop-blur text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium">
                      <Star className="w-3 h-3 fill-[#F1FCA7] text-[#F1FCA7]" />
                      {hospital.rating}/5 ({hospital.reviewCount} reviews)
                  </div>
              </div>
              {/* Side Images Grid */}
              <div className="grid grid-cols-2 gap-4 h-full">
                  {galleryImages.slice(1, 5).map((img, idx) => (
                      <div key={idx} className="rounded-2xl overflow-hidden relative h-full">
                          <img src={img} alt={`Facility ${idx}`} className="w-full h-full object-cover" />
                          {idx === 3 && (
                              <button className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-[#1C1C1C] text-xs font-medium px-3 py-1.5 rounded-md shadow-sm flex items-center gap-1.5 transition-colors">
                                  <LayoutGrid className="w-3.5 h-3.5" /> Show All
                              </button>
                          )}
                      </div>
                  ))}
              </div>
          </div>
      </div>

      {/* Main Content Split */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
          
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
                      <button className="w-full md:w-auto bg-[#1C1C1C] hover:bg-zinc-800 text-white px-6 py-3 rounded-lg text-sm font-medium transition-all shadow-lg shadow-[#1C1C1C]/10 shrink-0">Request Info</button>
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
      
    </div>
  );
};
