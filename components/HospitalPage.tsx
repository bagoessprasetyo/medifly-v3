
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
}

export const HospitalPage: React.FC<HospitalPageProps> = ({ hospital, onBack }) => {
  
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
      <nav className="border-b border-[#FAF8F7] sticky top-0 z-[60] bg-white/90 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
              <div className="flex items-center gap-4">
                  <button 
                      onClick={onBack}
                      className="p-1 hover:bg-zinc-100 rounded-full transition-colors md:hidden"
                  >
                      <ArrowLeft className="w-5 h-5 text-[#1C1C1C]" />
                  </button>
                  <div className="flex items-center gap-2 cursor-pointer" onClick={onBack}>
                      <div className="w-8 h-8 bg-[#1C1C1C] rounded-lg flex items-center justify-center text-white">
                          <Activity className="w-5 h-5" />
                      </div>
                      <span className="font-semibold text-lg tracking-tight text-[#1C1C1C]">Medifly</span>
                  </div>
              </div>
              
              <div className="hidden md:flex items-center gap-8 text-sm text-zinc-500">
                  <button className="flex items-center gap-2 hover:text-[#1C1C1C] transition-colors"><Building2 className="w-4 h-4" /> Hospitals</button>
                  <button className="flex items-center gap-2 hover:text-[#1C1C1C] transition-colors"><Stethoscope className="w-4 h-4" /> Doctors</button>
                  <button className="flex items-center gap-2 hover:text-[#1C1C1C] transition-colors"><Package className="w-4 h-4" /> Packages</button>
                  <button className="flex items-center gap-2 hover:text-[#1C1C1C] transition-colors"><Users className="w-4 h-4" /> About Us</button>
              </div>

              <div className="flex items-center gap-3">
                 <button className="bg-[#1C1C1C] text-white text-sm px-4 py-2 rounded-md font-medium hover:bg-zinc-800 transition-colors">Get Started</button>
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

      {/* Top Expertise */}
      <div className="bg-[#FAF8F7] py-16 border-t border-zinc-100">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
              <h2 className="text-3xl font-semibold tracking-tight text-center mb-12 text-[#1C1C1C]">Our Top Expertise</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-100 hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 bg-[#F1FCA7] text-[#1C1C1C] rounded-full flex items-center justify-center mb-4"><Wind className="w-5 h-5" /></div>
                      <h3 className="font-semibold text-[#1C1C1C] mb-2">Pulmonology</h3>
                      <p className="text-sm text-zinc-500 leading-relaxed">Advanced cancer care with leading specialists.</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-100 hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 bg-[#F1FCA7] text-[#1C1C1C] rounded-full flex items-center justify-center mb-4"><Heart className="w-5 h-5" /></div>
                      <h3 className="font-semibold text-[#1C1C1C] mb-2">Cardiology</h3>
                      <p className="text-sm text-zinc-500 leading-relaxed">Trusted heart specialists offering precise tests.</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-100 hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 bg-[#F1FCA7] text-[#1C1C1C] rounded-full flex items-center justify-center mb-4"><Link className="w-5 h-5" /></div>
                      <h3 className="font-semibold text-[#1C1C1C] mb-2">Oncology</h3>
                      <p className="text-sm text-zinc-500 leading-relaxed">Expert joint and bone care supported by tech.</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-100 hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 bg-[#F1FCA7] text-[#1C1C1C] rounded-full flex items-center justify-center mb-4"><Brain className="w-5 h-5" /></div>
                      <h3 className="font-semibold text-[#1C1C1C] mb-2">Neurology</h3>
                      <p className="text-sm text-zinc-500 leading-relaxed">Specialized brain and nerve care with modern diagnostics.</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-100 hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 bg-[#F1FCA7] text-[#1C1C1C] rounded-full flex items-center justify-center mb-4"><Droplet className="w-5 h-5" /></div>
                      <h3 className="font-semibold text-[#1C1C1C] mb-2">Hematology</h3>
                      <p className="text-sm text-zinc-500 leading-relaxed">Known for accurate diagnosis and treatment.</p>
                  </div>
              </div>

              {/* Specialization Tags */}
              <div className="mt-12 text-center">
                  <h3 className="text-xl font-medium mb-6 text-[#1C1C1C]">Specialization Available in Our Hospital</h3>
                  <div className="flex flex-wrap justify-center gap-3">
                      {[
                        {icon: HeartPulse, label: 'Cardiology'},
                        {icon: Bone, label: 'Orthopedics'},
                        {icon: Dna, label: 'Oncology'},
                        {icon: BrainCircuit, label: 'Neurology'},
                        {icon: Baby, label: 'Fertility & IVF'},
                        {icon: Utensils, label: 'Gastroenterology'},
                        {icon: Eye, label: 'Opthalmology'},
                        {icon: Ear, label: 'ENT'},
                        {icon: Wind, label: 'Pulmonology'}
                      ].map((spec, i) => (
                        <button key={i} className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-full text-sm text-zinc-600 hover:border-[#1C1C1C] hover:text-[#1C1C1C] transition-colors">
                           <spec.icon className="w-4 h-4" /> {spec.label}
                        </button>
                      ))}
                  </div>
              </div>
          </div>
      </div>

      {/* Explore Specialists */}
      <div className="py-16 max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-semibold tracking-tight text-center mb-12 text-[#1C1C1C]">Explore Specialists</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Doctor 1 */}
              <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition-all group">
                  <div className="aspect-[4/3] bg-[#FAF8F7] overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" alt="Doctor" />
                  </div>
                  <div className="p-5 space-y-3">
                      <div>
                          <h3 className="font-semibold text-[#1C1C1C]">Dr. Khoo Eng Hooi</h3>
                          <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-1">
                              {hospital.name}
                          </div>
                      </div>
                      <div className="border-t border-zinc-100 pt-3 space-y-2">
                          <p className="text-sm font-medium text-[#1C1C1C]">Orthopedic</p>
                          <p className="text-xs text-zinc-500 truncate">Sub: Spinal Surgery • Trauma <span className="bg-[#FAF8F7] px-1 rounded">+3</span></p>
                      </div>
                      <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-xs text-zinc-500"><Award className="w-3.5 h-3.5" /> 20+ years of experience</div>
                          <div className="flex items-center gap-2 text-xs text-zinc-500"><Languages className="w-3.5 h-3.5" /> English, Bahasa</div>
                      </div>
                      <button className="w-full border border-zinc-200 rounded-lg py-2 text-xs font-medium hover:bg-[#FAF8F7] hover:border-[#1C1C1C] transition-colors">Overview</button>
                  </div>
              </div>

              {/* Doctor 2 */}
              <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition-all group">
                  <div className="aspect-[4/3] bg-[#FAF8F7] overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" alt="Doctor" />
                  </div>
                  <div className="p-5 space-y-3">
                      <div>
                          <h3 className="font-semibold text-[#1C1C1C]">Dr. Lim Sue Ann</h3>
                          <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-1">
                               {hospital.name}
                          </div>
                      </div>
                      <div className="border-t border-zinc-100 pt-3 space-y-2">
                          <p className="text-sm font-medium text-[#1C1C1C]">Neurology</p>
                          <p className="text-xs text-zinc-500 truncate">Sub: Brain Surgery • Stroke <span className="bg-[#FAF8F7] px-1 rounded">+3</span></p>
                      </div>
                      <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-xs text-zinc-500"><Award className="w-3.5 h-3.5" /> 15+ years of experience</div>
                          <div className="flex items-center gap-2 text-xs text-zinc-500"><Languages className="w-3.5 h-3.5" /> English, Mandarin</div>
                      </div>
                      <button className="w-full border border-zinc-200 rounded-lg py-2 text-xs font-medium hover:bg-[#FAF8F7] hover:border-[#1C1C1C] transition-colors">Overview</button>
                  </div>
              </div>

               {/* Doctor 3 - Featured */}
               <div className="border border-[#1C1C1C] rounded-xl overflow-hidden bg-white shadow-lg relative group transform scale-[1.02] transition-all hidden md:block">
                  <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-full bg-[#1C1C1C] text-white text-[10px] px-2 py-1 rounded mb-2 z-10 whitespace-nowrap">Top Rated Specialist</div>
                  <div className="aspect-[4/3] bg-[#FAF8F7] overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover object-top" alt="Doctor" />
                  </div>
                  <div className="p-5 space-y-3">
                      <div>
                          <h3 className="font-semibold text-[#1C1C1C]">Dr. Wong Chee Ming</h3>
                          <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-1">
                               {hospital.name}
                          </div>
                      </div>
                      <div className="border-t border-zinc-100 pt-3 space-y-2">
                          <p className="text-sm font-medium text-[#1C1C1C]">Cardiology</p>
                          <p className="text-xs text-zinc-500 truncate">Sub: Interventional Cardiology <span className="bg-[#FAF8F7] px-1 rounded">+3</span></p>
                      </div>
                      <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-xs text-zinc-500"><Award className="w-3.5 h-3.5" /> 20+ years of experience</div>
                          <div className="flex items-center gap-2 text-xs text-zinc-500"><Languages className="w-3.5 h-3.5" /> English, Bahasa</div>
                      </div>
                      <button className="w-full bg-[#1C1C1C] text-white rounded-lg py-2 text-xs font-medium hover:bg-zinc-800 transition-colors">Overview</button>
                  </div>
              </div>

               {/* Doctor 4 */}
               <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition-all group hidden lg:block">
                  <div className="aspect-[4/3] bg-[#FAF8F7] overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" alt="Doctor" />
                  </div>
                  <div className="p-5 space-y-3">
                      <div>
                          <h3 className="font-semibold text-[#1C1C1C]">Dr. Tan Mei Ling</h3>
                          <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-1">
                               {hospital.name}
                          </div>
                      </div>
                      <div className="border-t border-zinc-100 pt-3 space-y-2">
                          <p className="text-sm font-medium text-[#1C1C1C]">Pulmonology</p>
                          <p className="text-xs text-zinc-500 truncate">Sub: Asthma • Lung Cancer <span className="bg-[#FAF8F7] px-1 rounded">+3</span></p>
                      </div>
                      <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-xs text-zinc-500"><Award className="w-3.5 h-3.5" /> 20+ years of experience</div>
                          <div className="flex items-center gap-2 text-xs text-zinc-500"><Languages className="w-3.5 h-3.5" /> English, Bahasa</div>
                      </div>
                      <button className="w-full border border-zinc-200 rounded-lg py-2 text-xs font-medium hover:bg-[#FAF8F7] hover:border-[#1C1C1C] transition-colors">Overview</button>
                  </div>
              </div>

          </div>
          <div className="flex justify-center mt-10">
              <button className="bg-[#1C1C1C] text-white px-8 py-2.5 rounded-md text-sm font-medium hover:bg-zinc-800 transition-colors">View More</button>
          </div>
      </div>

      {/* Facilities */}
      <div className="py-16 border-t border-[#FAF8F7] bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
              <h2 className="text-3xl font-semibold tracking-tight text-center mb-12 text-[#1C1C1C]">Facilities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    {title: 'Medical & Treatment Centres', items: ['Accident & Emergency (A&E)', 'Intensive Care Unit (ICU)', 'Breast Care Centre', 'Cardiology Clinic'], img: galleryImages[0]},
                    {title: 'Treatment Technology', items: ['Robotic Surgery System', 'Mako SmartRobotics', 'Ultrasound', 'Endoscopy Suite'], img: galleryImages[1]},
                    {title: 'Patient Care & Recovery', items: ['Inpatient Rooms', 'Maternity Rooms', 'Postnatal Care Services', 'Rehabilitation'], img: galleryImages[2]},
                    {title: 'Amenities & Support Services', items: ['Pharmacy', 'Hospitality Lounge', 'Laboratory Services', 'Billing & Insurance'], img: galleryImages[3]}
                  ].map((facility, i) => (
                    <div key={i} className="space-y-4">
                        <div className="rounded-xl overflow-hidden aspect-video bg-[#FAF8F7]">
                            <img src={facility.img} className="w-full h-full object-cover" alt={facility.title} />
                        </div>
                        <h3 className="font-semibold text-[#1C1C1C]">{facility.title}</h3>
                        <ul className="space-y-3">
                            {facility.items.map((item, j) => (
                                <li key={j} className="flex items-center gap-2 text-sm text-zinc-600"><CheckCircle2 className="w-4 h-4 text-zinc-400" /> {item}</li>
                            ))}
                        </ul>
                        <span className="inline-block px-3 py-1 rounded-full bg-[#FAF8F7] border border-zinc-200 text-xs font-medium text-zinc-500">+10 More</span>
                    </div>
                  ))}
              </div>
              
              <div className="flex justify-center mt-10">
                  <button className="border border-zinc-200 bg-white px-6 py-2.5 rounded-full text-sm font-medium text-zinc-600 hover:border-[#1C1C1C] hover:text-[#1C1C1C] transition-colors flex items-center gap-2">View All Facilities <ChevronRight className="w-4 h-4" /></button>
              </div>
          </div>
      </div>

      {/* Treatment Package */}
      <div className="py-16 bg-[#FAF8F7] border-t border-zinc-100">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
              <div className="text-center mb-12 space-y-2">
                  <h2 className="text-3xl font-semibold tracking-tight text-[#1C1C1C]">Treatment Package</h2>
                  <p className="text-zinc-500 max-w-2xl mx-auto">Discover our carefully designed medical packages that combine expert care, advanced technology, and personalized attention</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {['Basic Medical Check-Up', 'Heart Screening Basic', 'Women Wellness', 'Executive Screening'].map((pkg, i) => (
                      <div key={i} className="bg-white rounded-xl border border-zinc-200 overflow-hidden hover:shadow-md transition-all">
                          <div className="aspect-video overflow-hidden">
                              <img src={getImages(4)[i]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" alt={pkg} />
                          </div>
                          <div className="p-5 space-y-3">
                              <h3 className="font-semibold text-[#1C1C1C]">{pkg}</h3>
                              <p className="text-xs text-zinc-500">Medical Check-Up</p>
                              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                                  <Building2 className="w-3 h-3 text-[#1C1C1C]" /> {hospital.name}
                              </div>
                              <div className="pt-3 mt-3 border-t border-zinc-100">
                                  <p className="font-semibold text-[#1C1C1C]">{hospital.priceRange === '$$' ? '$200 - $500' : '$500 - $1000'}</p>
                              </div>
                              <button className="w-full border border-zinc-200 rounded-lg py-2 text-xs font-medium hover:bg-[#FAF8F7] transition-colors mt-2">Overview</button>
                          </div>
                      </div>
                  ))}
              </div>
              <div className="flex justify-center mt-10">
                  <button className="bg-[#1C1C1C] text-white px-8 py-2.5 rounded-md text-sm font-medium hover:bg-zinc-800 transition-colors">View More</button>
              </div>
          </div>
      </div>

      {/* Backed by Experts */}
      <div className="py-20 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
              <div className="flex flex-col lg:flex-row gap-12">
                  <div className="lg:w-1/3 space-y-6">
                      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#1C1C1C]">Backed by the country's leading health experts</h2>
                      <p className="text-zinc-500 leading-relaxed">At {hospital.name}, every patient is supported by a team of {hospital.country}'s top medical specialists. With decades of clinical excellence, advanced technology, and a strong track record of successful outcomes, our experts provide world-class care you can trust.</p>
                      <div className="flex gap-4 pt-4">
                          <button className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-[#FAF8F7]"><ArrowLeft className="w-5 h-5" /></button>
                          <button className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-[#FAF8F7]"><ArrowRight className="w-5 h-5" /></button>
                      </div>
                  </div>
                  
                  <div className="lg:w-2/3 overflow-hidden relative">
                      <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4">
                          {[1,2,3].map(i => (
                            <div key={i} className="min-w-[280px] border border-zinc-100 rounded-xl p-4 bg-[#FAF8F7]/50">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-zinc-200 overflow-hidden">
                                        <img src={`https://picsum.photos/100?random=${i+10}`} className="w-full h-full object-cover" alt="Doctor" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-sm text-[#1C1C1C]">Dr. Specialist Name</h4>
                                        <p className="text-xs text-zinc-500">Expertise</p>
                                    </div>
                                </div>
                                <div className="space-y-2 text-xs text-zinc-500">
                                    <p>Sub: Surgery • Trauma • Robotics +3</p>
                                    <div className="flex items-center gap-2"><Languages className="w-3 h-3" /> English, Local</div>
                                    <div className="flex items-center gap-2"><Building2 className="w-3 h-2" /> {hospital.name}</div>
                                </div>
                            </div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* FAQ */}
      <div className="py-16 max-w-3xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-semibold tracking-tight mb-8 text-[#1C1C1C]">Frequently Asked Question</h2>
          <div className="space-y-2">
              {['What is Medifly?', 'How Does Medifly.ai works?', 'Can Medifly ai Help me to on a medical trip?', 'How do I book a for treatment?'].map((q, i) => (
                  <div key={i} className={`border-b border-zinc-100 ${i === 2 ? 'pb-6' : 'pb-4'}`}>
                      <button className="w-full flex justify-between items-center py-2 text-left font-medium text-[#1C1C1C] hover:text-zinc-600">
                          {q}
                          {i === 2 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      {i === 2 && <p className="text-sm text-zinc-500 leading-relaxed mt-2">Absolutely. Medifly AI assists you through every step of your medical journey — from finding the right hospital and doctor to estimating costs, planning your stay, and arranging travel details. We make medical trips simpler, smarter, and stress-free.</p>}
                  </div>
              ))}
          </div>
      </div>

      {/* Hospitals May Also Like */}
      <div className="py-16 border-t border-[#FAF8F7] bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
              <h2 className="text-2xl font-semibold tracking-tight text-center mb-12 text-[#1C1C1C]">Hospitals You May Also Like</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedHospitals.map(h => (
                      <div key={h.id} className="border border-zinc-200 rounded-xl overflow-hidden group cursor-pointer" onClick={() => window.location.href = `/hospitals/${h.name.toLowerCase().replace(/ /g, '-')}`}>
                          <div className="relative aspect-[4/3] overflow-hidden">
                              <img src={h.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={h.name} />
                              <div className="absolute bottom-2 left-2 bg-[#F1FCA7] text-[#1C1C1C] text-[10px] px-2 py-0.5 rounded flex items-center gap-1 font-medium">
                                  <Star className="w-2 h-2 fill-current" /> {h.rating}/5
                              </div>
                          </div>
                          <div className="p-4 space-y-3">
                              <div className="flex justify-between items-start">
                                  <h3 className="font-semibold text-[#1C1C1C] text-sm truncate">{h.name}</h3>
                                  <span className="text-xs font-semibold text-[#1C1C1C]">{h.priceRange}</span>
                              </div>
                              <p className="text-xs text-zinc-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> {h.location}, {h.country}</p>
                              <p className="text-xs font-medium text-[#1C1C1C] flex items-center gap-1"><Plane className="w-3 h-3" /> Int'l Travel Ready</p>
                              <p className="text-xs text-zinc-500 line-clamp-2">{h.description}</p>
                              <div className="flex items-center gap-4 text-[10px] text-zinc-500 pt-2 border-t border-zinc-100">
                                  <span className="flex items-center gap-1"><Languages className="w-3 h-3" /> English, Local</span>
                                  <span className="flex items-center gap-1"><Stethoscope className="w-3 h-3" /> {h.specialties.length} specialities</span>
                              </div>
                              <button className="w-full border border-zinc-200 rounded-lg py-2 text-xs font-medium hover:bg-[#FAF8F7] transition-colors">Hospital Overview</button>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#1C1C1C] text-white py-12">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[#1C1C1C]">
                      <Activity className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-lg tracking-tight">Medifly</span>
              </div>
              <div className="text-sm text-zinc-400 text-center md:text-right">
                  <p>&copy; 2025 Medifly - All rights reserved</p>
                  <div className="flex justify-center md:justify-end gap-6 mt-2">
                      <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                      <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
                  </div>
              </div>
              <button className="bg-zinc-800 border border-zinc-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-zinc-700 transition-colors">Get Started</button>
          </div>
      </footer>
    </div>
  );
};
