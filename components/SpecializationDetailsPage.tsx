import React, { useState, useEffect } from 'react';
import { Hospital, Doctor } from '../types';
import { DOCTORS } from '../constants';
import {
  Building2, ChevronRight, ChevronDown, ChevronUp, Languages, CheckCircle, ArrowRight,
  Briefcase, CheckCircle2, Info, FileText, Stethoscope, Activity, BriefcaseMedical,
  Scan, Monitor, Clock, HeartHandshake, Pill
} from 'lucide-react';
import { InquiryFormModal } from './ui/InquiryFormModal';

interface SpecializationDetailsPageProps {
  hospital: Hospital;
  specializationName: string;
  onBack: () => void;
  onNavigateToHospital: () => void;
  onNavigateToDoctor: (doctor: Doctor) => void;
  onViewAllInsights?: () => void;
  onNavigateToArticle?: (title: string) => void;
  onNavigateToTreatment?: (title: string) => void;
  onNavigateToFacility?: (facilityName: string) => void;
}

export const SpecializationDetailsPage: React.FC<SpecializationDetailsPageProps> = ({
  hospital,
  specializationName,
  onBack,
  onNavigateToHospital,
  onNavigateToDoctor,
  onViewAllInsights,
  onNavigateToArticle,
  onNavigateToTreatment,
  onNavigateToFacility
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);

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

            <button
              onClick={() => setIsInquiryModalOpen(true)}
              className="bg-[#1C1C1C] text-white px-8 py-3.5 rounded-xl font-medium text-sm hover:bg-black transition-colors shadow-lg shadow-slate-900/10 mb-12"
            >
              Request Treatment Info
            </button>

            {/* Description */}
            <p className="text-slate-600 leading-relaxed mb-10 text-[15px]">
              {content.description}
            </p>

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

      {/* Section 1: Conditions We Treat - Full Width */}
      <section className="bg-[#FAF8F7] py-20 lg:py-32 px-6 mt-16">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h2 className="text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight leading-[1.1]">
              Conditions We Treat
            </h2>
            <p className="text-lg leading-relaxed text-gray-500 max-w-lg">
              Explore the full range of conditions treated by leading {specializationName.toLowerCase()} specialists, supported by advanced diagnostics, targeted therapies, and world-class medical expertise.
            </p>
          </div>

          {/* Right List Card */}
          <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100/50">
            <div className="grid sm:grid-cols-2 gap-x-12 gap-y-6">
              <ul className="space-y-6">
                {content.conditions.slice(0, Math.ceil(content.conditions.length / 2)).map((condition, idx) => (
                  <li
                    key={idx}
                    onClick={() => onNavigateToTreatment?.(condition)}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <CheckCircle className="text-emerald-500 w-5 h-5 flex-shrink-0" />
                    <span className="text-base font-medium text-gray-800 underline decoration-gray-300 underline-offset-4 decoration-1 group-hover:decoration-gray-500 transition-colors">
                      {condition}
                    </span>
                  </li>
                ))}
              </ul>
              <ul className="space-y-6">
                {content.conditions.slice(Math.ceil(content.conditions.length / 2)).map((condition, idx) => (
                  <li
                    key={idx}
                    onClick={() => onNavigateToTreatment?.(condition)}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <CheckCircle className="text-emerald-500 w-5 h-5 flex-shrink-0" />
                    <span className="text-base font-medium text-gray-800 underline decoration-gray-300 underline-offset-4 decoration-1 group-hover:decoration-gray-500 transition-colors">
                      {condition}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Treatments */}
      <section className="bg-[#F4F0EE] py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <span className="uppercase tracking-widest text-xs font-semibold text-gray-500">Treatments</span>
            <h2 className="text-3xl lg:text-4xl font-semibold text-gray-900 tracking-tight leading-tight max-w-2xl mx-auto">
              Comprehensive care utilizing the latest medical advancements.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {content.treatments.map((treatment, idx) => (
              <div
                key={idx}
                onClick={() => onNavigateToTreatment?.(treatment)}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center cursor-pointer"
              >
                <h3 className="text-lg font-semibold text-gray-900">{treatment}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Specialists */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl lg:text-4xl font-semibold text-gray-900 tracking-tight leading-tight">
              Specialists Ready for Your <br className="hidden sm:block" /> {specializationName} Journey
            </h2>
            <p className="text-base text-gray-500">Access expert doctors behind hundreds of advanced procedures.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayDoctors.slice(0, 8).map((doctor, i) => (
              <div
                key={i}
                onClick={() => onNavigateToDoctor(doctor)}
                className="group cursor-pointer"
              >
                <div className="bg-[#FAF8F7] rounded-t-xl aspect-[4/3] relative overflow-hidden">
                  <img
                    src={doctor.imageUrl}
                    alt={doctor.name}
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[90%] object-cover object-top mix-blend-multiply"
                  />
                </div>
                <div className="pt-5 pb-2 space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                    <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center text-[10px]">
                      {doctor.hospitalCountry === 'Malaysia' ? '🇲🇾' :
                       doctor.hospitalCountry === 'Singapore' ? '🇸🇬' :
                       doctor.hospitalCountry === 'Thailand' ? '🇹🇭' :
                       doctor.hospitalCountry === 'South Korea' ? '🇰🇷' : '🏳️'}
                    </span>
                    <span className="truncate">{doctor.hospitalName}, {doctor.hospitalCountry}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-500">{doctor.specialty}</p>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {doctor.procedures.slice(0, 3).join(' • ')}
                  </p>

                  <div className="pt-2 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <BriefcaseMedical className="w-3.5 h-3.5" />
                      <span>{doctor.experienceYears}+ years experience</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Languages className="w-3.5 h-3.5" />
                      <span className="truncate">{doctor.languages.join(', ')}</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigateToDoctor(doctor);
                    }}
                    className="w-full mt-4 py-2 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Overview
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Facilities */}
      <section className="bg-[#F4F0EE] py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-semibold text-gray-900 tracking-tight text-center mb-16">Facilities</h2>

          <div className="bg-white rounded-2xl p-12 max-w-4xl mx-auto shadow-sm">
            <div className="grid md:grid-cols-2 gap-12">
              <ul className="space-y-6">
                {content.facilities.slice(0, Math.ceil(content.facilities.length / 2)).map((item, idx) => {
                  const icons = [Scan, CheckCircle2, Monitor, Clock, Clock];
                  const Icon = icons[idx % icons.length];
                  return (
                    <li
                      key={idx}
                      onClick={() => onNavigateToFacility?.(item)}
                      className="flex items-center gap-3 cursor-pointer hover:opacity-70 transition-opacity"
                    >
                      <Icon className="text-gray-400 w-5 h-5" />
                      <span className="text-lg font-medium text-gray-700">{item}</span>
                    </li>
                  );
                })}
              </ul>
              <ul className="space-y-6">
                {content.facilities.slice(Math.ceil(content.facilities.length / 2)).map((item, idx) => {
                  const icons = [CheckCircle, HeartHandshake, Stethoscope, Pill];
                  const Icon = icons[idx % icons.length];
                  return (
                    <li
                      key={idx}
                      onClick={() => onNavigateToFacility?.(item)}
                      className="flex items-center gap-3 cursor-pointer hover:opacity-70 transition-opacity"
                    >
                      <Icon className="text-gray-400 w-5 h-5" />
                      <span className="text-lg font-medium text-gray-700">{item}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Insights */}
      <section className="bg-white py-24 px-6 pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl lg:text-4xl font-semibold text-gray-900 tracking-tight leading-tight mb-4">
              Insights That Advance <br className="hidden sm:block" /> {specializationName} Care
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl">
              Learn about the newest discoveries, clinical progress, and supportive care programs designed to improve patient outcomes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 overflow-hidden">
            {/* Blog Card 1 */}
            <div
              onClick={() => onNavigateToArticle?.(`Latest Advances in ${specializationName}`)}
              className="bg-[#F4F0EE] rounded-xl overflow-hidden group cursor-pointer h-full flex flex-col"
            >
              <div className="relative h-48">
                <img
                  src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop"
                  className="w-full h-full object-cover"
                  alt="Article"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-white/90 backdrop-blur-sm px-2 py-1 text-[10px] font-semibold rounded text-gray-900 uppercase tracking-wide">Article</span>
                  <span className="bg-white/90 backdrop-blur-sm px-2 py-1 text-[10px] font-semibold rounded text-gray-900 uppercase tracking-wide">{specializationName}</span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-base font-semibold text-gray-900 mb-8 leading-snug">
                  Latest advances in {specializationName.toLowerCase()} treatment options at leading hospitals
                </h3>
                <div className="mt-auto flex items-center justify-between text-xs font-medium text-gray-500">
                  <span>5 min reading</span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </div>

            {/* Blog Card 2 */}
            <div
              onClick={() => onNavigateToArticle?.(`Understanding ${specializationName} Procedures`)}
              className="bg-[#F4F0EE] rounded-xl overflow-hidden group cursor-pointer h-full flex flex-col"
            >
              <div className="relative h-48">
                <img
                  src="https://images.unsplash.com/photo-1516549655169-df83a25a836f?q=80&w=2070&auto=format&fit=crop"
                  className="w-full h-full object-cover"
                  alt="Article"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-white/90 backdrop-blur-sm px-2 py-1 text-[10px] font-semibold rounded text-gray-900 uppercase tracking-wide">Article</span>
                  <span className="bg-white/90 backdrop-blur-sm px-2 py-1 text-[10px] font-semibold rounded text-gray-900 uppercase tracking-wide">{specializationName}</span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-base font-semibold text-gray-900 mb-8 leading-snug">
                  Understanding {specializationName.toLowerCase()} procedures and what to expect during treatment
                </h3>
                <div className="mt-auto flex items-center justify-between text-xs font-medium text-gray-500">
                  <span>5 min reading</span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </div>

            {/* Blog Card 3 */}
            <div
              onClick={() => onNavigateToArticle?.(`Patient Success Stories in ${specializationName}`)}
              className="bg-[#F4F0EE] rounded-xl overflow-hidden group cursor-pointer h-full flex flex-col"
            >
              <div className="relative h-48">
                <img
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2080&auto=format&fit=crop"
                  className="w-full h-full object-cover"
                  alt="Article"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-white/90 backdrop-blur-sm px-2 py-1 text-[10px] font-semibold rounded text-gray-900 uppercase tracking-wide">Article</span>
                  <span className="bg-white/90 backdrop-blur-sm px-2 py-1 text-[10px] font-semibold rounded text-gray-900 uppercase tracking-wide">{specializationName}</span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-base font-semibold text-gray-900 mb-8 leading-snug">
                  Patient success stories and recovery journeys in {specializationName.toLowerCase()} care
                </h3>
                <div className="mt-auto flex items-center justify-between text-xs font-medium text-gray-500">
                  <span>5 min reading</span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-16">
            <button
              onClick={onViewAllInsights}
              className="px-6 py-3 rounded-full border border-gray-200 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors shadow-sm"
            >
              See More Articles
            </button>
          </div>
        </div>
      </section>

      {/* Inquiry Form Modal */}
      <InquiryFormModal
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
        defaultProcedure={`${specializationName} at ${hospital.name}`}
      />
    </div>
  );
};
