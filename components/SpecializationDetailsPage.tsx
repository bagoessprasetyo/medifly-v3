import React, { useState, useEffect } from 'react';
import { Hospital, Doctor } from '../types';
import { DOCTORS } from '../constants';
import {
  Building2, ChevronRight, ChevronDown, ChevronUp, Languages, CheckCircle, ArrowRight,
  Briefcase, CheckCircle2, Info, FileText, Stethoscope, Activity
} from 'lucide-react';

interface SpecializationDetailsPageProps {
  hospital: Hospital;
  specializationName: string;
  onBack: () => void;
  onNavigateToHospital: () => void;
  onNavigateToDoctor: (doctor: Doctor) => void;
  onViewAllInsights?: () => void;
  onNavigateToArticle?: (title: string) => void;
  onNavigateToTreatment?: (title: string) => void;
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
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

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

  // Mock content
  const content = {
    description: `The Department of ${specializationName} at ${hospital.name} is dedicated to providing comprehensive, state-of-the-art care for patients with complex conditions. Our expert team of specialists, surgeons, and specialized nurses utilizes the latest diagnostic tools and therapeutic interventions to manage a wide spectrum of disorders. We are committed to personalized patient care, integrating advanced medical knowledge with compassionate support to achieve the best possible outcomes.`,
    conditions: [
      "Complex Cases", "Minimally Invasive", "Advanced Diagnostics",
      "Rehabilitation", "Chronic Management", "Acute Care",
      "Preventive Screening", "Surgical Interventions"
    ],
    treatments: [
      "Chemotherapy", "Radiation Therapy", "Immunotherapy",
      "Palliative Care", "Genetic Counseling", "Clinical Trials"
    ],
    facilities: [
      "Advanced Diagnostics Lab", "PET-CT Scan", "Digital Mammography",
      "Hybrid Operating Theater", "Real-time Imaging", "VIP Inpatient Rooms",
      "Holistic Support Center", "Specialized Nursing Team"
    ],
    faqs: [
      { q: "What is Medifly?", a: "Medifly is your trusted partner for medical tourism, connecting you with top hospitals globally." },
      { q: "How Does Medifly.ai works?", a: "We use AI to recommend the best care options and handle your booking process seamlessly." },
      { q: "Can Medifly ai Help me to on a medical trip?", a: "Absolutely. Medifly AI assists you through every step of your medical journey — from finding the right hospital and doctor to estimating costs, planning your stay, and arranging travel details. We make medical trips simpler, smarter, and stress-free." },
      { q: "How do I book a for treatment?", a: "Simply click 'Request Treatment Info' or start a chat with Aria to begin your booking." }
    ]
  };

  return (
    <div className="bg-white min-h-screen pb-20 font-sans text-slate-900">

      {/* Navbar Placeholder */}
      <div className="h-6"></div>

      <div className="max-w-[1400px] mx-auto px-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <span className="cursor-pointer hover:text-slate-900 transition-colors" onClick={onNavigateToHospital}>{hospital.name}</span>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <span className="cursor-pointer hover:text-slate-900 transition-colors" onClick={onBack}>Specializations</span>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <span className="font-medium text-slate-900">{specializationName}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left Content Column */}
          <div className="lg:col-span-8">

            {/* Hero Image */}
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 mb-8 relative group">
              <img
                src={`https://source.unsplash.com/1600x900/?hospital,${specializationName},doctor`}
                onError={(e) => (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2080&auto=format&fit=crop'}
                alt={`${specializationName} Department`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>

            {/* Title & Header Info */}
            <h1 className="text-3xl md:text-4xl font-medium text-slate-900 mb-2 tracking-tight leading-tight">{specializationName}</h1>
            <p className="text-base font-medium text-slate-600 mb-4">Department of {specializationName}</p>

            <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
              <span className="text-lg mr-1">
                {hospital.country === 'Thailand' ? '🇹🇭' :
                 hospital.country === 'Singapore' ? '🇸🇬' :
                 hospital.country === 'Malaysia' ? '🇲🇾' : '🏳️'}
              </span>
              <span>{hospital.name}, {hospital.location}, {hospital.country}</span>
            </div>

            <button className="bg-[#1C1C1C] text-white px-8 py-3.5 rounded-xl font-medium text-sm hover:bg-black transition-colors shadow-lg shadow-slate-900/10 mb-12">
              Request Treatment Info
            </button>

            {/* Description */}
            <p className="text-slate-600 leading-relaxed mb-10 text-[15px]">
              {content.description}
            </p>

            {/* Conditions We Treat */}
            <section className="mb-10 pb-10 border-b border-slate-100">
              <h3 className="flex items-center gap-2 text-lg font-medium text-slate-900 mb-4">
                <Stethoscope className="w-5 h-5 text-slate-400" /> Conditions We Treat
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {content.conditions.map((condition, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span className="text-sm text-slate-600">{condition}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Treatments */}
            <section className="mb-10 pb-10 border-b border-slate-100">
              <h3 className="flex items-center gap-2 text-lg font-medium text-slate-900 mb-4">
                <Activity className="w-5 h-5 text-slate-400" /> Treatments
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {content.treatments.map((treatment, idx) => (
                  <div
                    key={idx}
                    onClick={() => onNavigateToTreatment?.(treatment)}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors group"
                  >
                    <span className="text-sm font-medium text-slate-700">{treatment}</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
                  </div>
                ))}
              </div>
            </section>

            {/* Facilities */}
            <section className="mb-10 pb-10 border-b border-slate-100">
              <h3 className="flex items-center gap-2 text-lg font-medium text-slate-900 mb-4">
                <FileText className="w-5 h-5 text-slate-400" /> Facilities
              </h3>
              <ul className="space-y-3">
                {content.facilities.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-slate-900 mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Specialists */}
            <section className="mb-16">
              <h3 className="flex items-center gap-2 text-lg font-medium text-slate-900 mb-6">
                <Info className="w-5 h-5 text-slate-400" /> Our Specialists
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayDoctors.slice(0, 4).map((doctor, i) => (
                  <div key={i} className="border border-slate-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300 flex bg-white">
                    <div className="bg-[#F4F4F5] w-24 h-full flex items-end justify-center relative overflow-hidden flex-shrink-0">
                      <img src={doctor.imageUrl} alt={doctor.name} className="h-full object-contain mix-blend-multiply" />
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h4 className="font-medium text-sm mb-1">{doctor.name}</h4>
                      <div className="text-xs text-slate-500 mb-2">{doctor.specialty}</div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 mb-1">
                        <Briefcase className="w-3 h-3 text-slate-400" />
                        <span>{doctor.experienceYears}+ years</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 mb-3">
                        <Languages className="w-3 h-3 text-slate-400" />
                        <span className="truncate">{doctor.languages.join(', ')}</span>
                      </div>
                      <button
                        onClick={() => onNavigateToDoctor(doctor)}
                        className="mt-auto w-full border border-slate-200 py-1.5 rounded text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ */}
            <section>
              <h2 className="text-3xl font-medium text-slate-900 mb-8">Frequently Asked Question</h2>
              <div className="space-y-4 border-t border-slate-100 pt-4">
                {content.faqs.map((q, i) => (
                  <div key={i} className="border-b border-slate-100 pb-4">
                    <button
                      onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                      className="flex items-center justify-between w-full text-left focus:outline-none group py-2"
                    >
                      <span className="font-medium text-sm text-[#1C1C1C]">{q.q}</span>
                      {openFaqIndex === i ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>
                    {openFaqIndex === i && (
                      <div className="mt-3 text-sm text-slate-500 leading-relaxed pr-8 animate-in slide-in-from-top-1">
                        {q.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Right Sidebar - Sticky Hospital Card */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-28 bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-slate-900" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">Hospital</h3>
              </div>

              <div className="rounded-xl overflow-hidden mb-4 relative h-32 bg-slate-100">
                {hospital.imageUrl && (
                  <img src={hospital.imageUrl} alt={hospital.name} className="w-full h-full object-cover" />
                )}
              </div>

              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-medium text-slate-600">{hospital.name.substring(0,2).toUpperCase()}</span>
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 text-sm leading-tight mb-1">{hospital.name}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="text-base">
                      {hospital.country === 'Thailand' ? '🇹🇭' :
                       hospital.country === 'Singapore' ? '🇸🇬' :
                       hospital.country === 'Malaysia' ? '🇲🇾' : '🏳️'}
                    </span>
                    <span className="truncate max-w-[150px]">{hospital.location}, {hospital.country}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed mb-6 border-b border-slate-100 pb-6">
                Committed to patient-centered care, {hospital.name} ensures high-quality treatments tailored to individual needs.
              </p>

              <button
                onClick={onNavigateToHospital}
                className="w-full py-3 rounded-lg border border-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors"
              >
                View Hospital
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
