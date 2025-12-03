import React, { useEffect } from 'react';
import { Hospital, Doctor } from '../types';
import { DOCTORS } from '../constants';
import { 
  Building2, ChevronRight, Languages, CheckCircle, ArrowRight, 
  Briefcase, CheckCircle2, Clock, MapPin 
} from 'lucide-react';

interface SpecializationDetailsPageProps {
  hospital: Hospital;
  specializationName: string;
  onBack: () => void;
  onNavigateToHospital: () => void;
  onNavigateToDoctor: (doctor: Doctor) => void;
  onViewAllInsights?: () => void;
  onNavigateToArticle?: (title: string) => void;
  onNavigateToTreatment?: (title: string) => void; // Added prop
}

export const SpecializationDetailsPage: React.FC<SpecializationDetailsPageProps> = ({ 
  hospital, 
  specializationName, 
  onBack,
  onNavigateToHospital,
  onNavigateToDoctor,
  onViewAllInsights,
  onNavigateToArticle,
  onNavigateToTreatment
}) => {
  
  // Scroll to top on mount or specialization change
  useEffect(() => {
      const mainContainer = document.getElementById('main-content-area');
      if (mainContainer) {
          mainContainer.scrollTo(0, 0);
      } else {
          window.scrollTo(0, 0);
      }
  }, [specializationName]);
  
  // Filter doctors for this specialization and hospital (or generic fallback for demo)
  const specialists = DOCTORS.filter(d => 
    (d.hospitalId === hospital.id || d.hospitalName === hospital.name) &&
    (d.specialty.toLowerCase().includes(specializationName.toLowerCase()) || specializationName.toLowerCase().includes(d.specialty.toLowerCase()))
  );

  // If no specific doctors found in mock data, show some related ones from same country for demo
  const displayDoctors = specialists.length > 0 
    ? specialists 
    : DOCTORS.filter(d => d.hospitalCountry === hospital.country).slice(0, 4);

  return (
    <div className="bg-white text-gray-900 font-sans antialiased animate-in fade-in duration-500">
        
        {/* Breadcrumb & Hero */}
        <section className="max-w-7xl mx-auto px-6 pt-8 pb-16">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
                <button onClick={onNavigateToHospital} className="hover:text-black transition-colors">{hospital.name}</button>
                <ChevronRight className="w-3 h-3" />
                <span className="text-black font-medium">{specializationName}</span>
            </div>

            <h1 className="text-5xl font-semibold tracking-tight mb-8">{specializationName}</h1>

            <div className="w-full h-[400px] lg:h-[500px] rounded-2xl overflow-hidden mb-12 relative bg-gray-100">
                <img 
                    src={`https://source.unsplash.com/1600x900/?hospital,${specializationName},doctor`} 
                    onError={(e) => (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2080&auto=format&fit=crop'}
                    alt={`${specializationName} Department`} 
                    className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-black/10"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-4">
                    <p className="text-lg text-gray-600 leading-relaxed font-light">
                        The Department of {specializationName} at {hospital.name} is dedicated to providing comprehensive, state-of-the-art care for patients with complex conditions. Our expert team of specialists, surgeons, and specialized nurses utilizes the latest diagnostic tools and therapeutic interventions to manage a wide spectrum of disorders. We are committed to personalized patient care, integrating advanced medical knowledge with compassionate support to achieve the best possible outcomes. As a leading institution, our {specializationName.toLowerCase()} department is at the forefront of medical innovation in {hospital.country}.
                    </p>
                </div>

                <div className="lg:col-span-1">
                    <div className="border border-gray-100 rounded-xl p-6 shadow-sm bg-white sticky top-28">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100">
                                <Building2 className="w-5 h-5 text-gray-700" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg tracking-tight">Hospital</h3>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100 flex-shrink-0 bg-white p-1">
                                {/* Logo Placeholder */}
                                <div className="w-full h-full bg-slate-50 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                    {hospital.name.substring(0, 2).toUpperCase()}
                                </div>
                            </div>
                            <div>
                                <h4 className="font-medium text-sm">{hospital.name}</h4>
                                <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500">
                                    <span className="text-xs">
                                        {hospital.country === 'Malaysia' ? '🇲🇾' : 
                                         hospital.country === 'Singapore' ? '🇸🇬' : 
                                         hospital.country === 'Thailand' ? '🇹🇭' : '🏳️'}
                                    </span>
                                    <span>{hospital.location}, {hospital.country}</span>
                                </div>
                            </div>
                        </div>

                        <div className="inline-flex items-center gap-1.5 bg-[#F1FCA7] px-2.5 py-1 rounded text-[11px] font-semibold tracking-wide text-green-900 mb-4">
                            <Languages className="w-3 h-3" />
                            Offers Multiple Language Support
                        </div>

                        <p className="text-xs text-gray-500 leading-relaxed mb-6">
                            Committed to patient-centered care, {hospital.name} ensures high-quality treatments tailored to individual needs.
                        </p>

                        <button 
                            onClick={onNavigateToHospital}
                            className="w-full border border-gray-200 text-gray-800 text-xs font-medium py-2.5 rounded hover:bg-gray-50 transition-colors"
                        >
                            View Hospital
                        </button>
                    </div>
                </div>
            </div>
        </section>

        {/* Conditions We Treat */}
        <section className="bg-[#FAF8F7] py-24">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                    <h2 className="text-4xl font-semibold tracking-tight mb-6">Conditions We Treat</h2>
                    <p className="text-lg text-gray-600 font-light leading-relaxed max-w-md">
                        Explore the full range of conditions treated by leading {specializationName.toLowerCase()} specialists, supported by advanced diagnostics, targeted therapies, and world-class medical expertise.
                    </p>
                </div>
                <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100/50">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                        {[
                            "Complex Cases", "Minimally Invasive", "Advanced Diagnostics", 
                            "Rehabilitation", "Chronic Management", "Acute Care", 
                            "Preventive Screening", "Surgical Interventions", "Pediatric Cases", 
                            "Genetic Counseling"
                        ].map((condition, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-emerald-600 fill-emerald-50" />
                                <span className={`text-sm font-medium ${i % 2 === 0 ? 'border-b border-black pb-0.5 leading-none' : ''}`}>{condition}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>

        {/* Treatments */}
        <section className="bg-[#F4F0EE] py-24">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3 block">Treatments</span>
                    <h2 className="text-4xl font-semibold tracking-tight text-gray-900">
                        Comprehensive care utilizing the<br/>latest medical advancements.
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                        "Chemotherapy", "Radiation Therapy", "Immunotherapy", 
                        "Palliative Care", "Genetic Counseling", "Clinical Trials"
                    ].map((treatment, i) => (
                        <div 
                            key={i} 
                            onClick={() => onNavigateToTreatment?.(treatment)}
                            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between group cursor-pointer hover:border-gray-300 transition-all"
                        >
                            <h3 className="font-medium text-sm">{treatment}</h3>
                            {i === 0 && <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />}
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Specialists */}
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-4xl font-semibold tracking-tight mb-4">Specialists Ready for<br/>Your Journey</h2>
                    <p className="text-gray-500 font-light">Access expert doctors behind hundreds of advanced procedures.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {displayDoctors.map((doctor, i) => (
                        <div key={i} className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full bg-white">
                            <div className="bg-[#F4F4F5] h-56 w-full flex items-end justify-center relative overflow-hidden">
                                <img src={doctor.imageUrl} alt={doctor.name} className="h-5/6 object-contain transform translate-y-0 mix-blend-multiply" />
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="font-semibold text-lg mb-1">{doctor.name}</h3>
                                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                                    <span className="text-xs">
                                        {doctor.hospitalCountry === 'Malaysia' ? '🇲🇾' : 
                                         doctor.hospitalCountry === 'Singapore' ? '🇸🇬' : 
                                         doctor.hospitalCountry === 'Thailand' ? '🇹🇭' : '🏳️'}
                                    </span>
                                    <span className="truncate">{doctor.hospitalName}, {doctor.hospitalCountry}</span>
                                </div>
                                <div className="text-sm font-medium text-gray-900 mb-2">{doctor.specialty}</div>
                                <div className="text-[10px] text-gray-400 mb-4 leading-tight line-clamp-2">
                                    {doctor.procedures.join(' • ')}
                                </div>
                                
                                <div className="flex items-center gap-2 text-[10px] text-gray-500 mb-1">
                                    <Briefcase className="w-3 h-3 text-gray-400" />
                                    <span>{doctor.experienceYears}+ years experience</span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-gray-500 mb-4">
                                    <Languages className="w-3 h-3 text-gray-400" />
                                    <span className="truncate">{doctor.languages.join(', ')}</span>
                                </div>

                                <button 
                                    onClick={() => onNavigateToDoctor(doctor)}
                                    className="mt-auto w-full border border-gray-200 py-2 rounded text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-black hover:border-gray-300 transition-all"
                                >
                                    Overview
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Facilities */}
        <section className="bg-[#F4F0EE] py-24">
            <div className="max-w-4xl mx-auto px-6">
                <h2 className="text-4xl font-semibold tracking-tight text-center mb-12">Facilities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Column 1 */}
                    <div className="bg-white p-10 rounded-lg shadow-sm">
                        <ul className="space-y-6">
                            {[
                                "Advanced Diagnostics Lab", "PET-CT Scan", 
                                "Digital Mammography", "Hybrid Operating Theater", "Real-time Imaging"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-black" />
                                    <span className="text-sm text-gray-700">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* Column 2 */}
                    <div className="bg-white p-10 rounded-lg shadow-sm">
                        <ul className="space-y-6">
                            {[
                                "VIP Inpatient Rooms", "Holistic Support Center", 
                                "Specialized Nursing Team", "On-site Pharmacy", "International Patient Lounge"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-black" />
                                    <span className="text-sm text-gray-700">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        {/* Insights */}
        <section className="bg-white py-24">
            <div className="max-w-7xl mx-auto px-6">
                <div className="max-w-2xl mb-12">
                    <h2 className="text-4xl font-semibold tracking-tight mb-4">Insights That Advance<br/>Your Care</h2>
                    <p className="text-gray-500 font-light text-sm">Learn about the newest discoveries, clinical progress, and supportive care programs designed to improve patient outcomes.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {[
                        { title: `Explore world-class ${specializationName} care in ${hospital.country}`, img: "https://images.unsplash.com/photo-1449824913929-4bddafe26825?q=80&w=1974&auto=format&fit=crop" },
                        { title: `Latest advancements in ${specializationName} treatments`, img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop" },
                        { title: "Understanding your recovery journey", img: "https://images.unsplash.com/photo-1516549655169-df83a0833860?q=80&w=2015&auto=format&fit=crop" }
                    ].map((article, i) => (
                        <div 
                            key={i} 
                            onClick={() => onNavigateToArticle?.(article.title)} 
                            className="group cursor-pointer"
                        >
                            <div className="relative h-64 w-full rounded-t-lg overflow-hidden">
                                <img src={article.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={article.title} />
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <span className="bg-white text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-wide">Article</span>
                                    <span className="bg-white text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-wide">{specializationName}</span>
                                </div>
                            </div>
                            <div className="bg-[#F4F0EE] p-6 rounded-b-lg">
                                <h3 className="font-semibold text-sm leading-snug mb-8 min-h-[40px] text-gray-900">{article.title}</h3>
                                <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium">
                                    <span>5 min reading</span>
                                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center">
                    <button 
                        onClick={onViewAllInsights}
                        className="border border-gray-200 text-sm font-medium px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        See More Articles
                    </button>
                </div>
            </div>
        </section>

    </div>
  );
};