import React, { useState, useEffect } from 'react';
import { Hospital } from '../types';
import { ChevronRight, ChevronDown, ChevronUp, Building2, Info, FileText, Check, HelpCircle, ClipboardList } from 'lucide-react';

interface FacilityDetailsPageProps {
  hospital: Hospital;
  facilityName: string;
  onBack: () => void;
  onNavigateToHospital: () => void;
}

export const FacilityDetailsPage: React.FC<FacilityDetailsPageProps> = ({ hospital, facilityName, onBack, onNavigateToHospital }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Scroll to top on mount
  useEffect(() => {
    const scrollContainer = document.getElementById('main-content-area');
    if (scrollContainer) {
      scrollContainer.scrollTo(0, 0);
    } else {
      window.scrollTo(0, 0);
    }
  }, [facilityName]);

  // Mock content generation based on facility name
  const content = {
    description: `${facilityName} is a specialized medical service offered at ${hospital.name}, designed to provide state-of-the-art care using advanced technology. Our dedicated team ensures precision, safety, and comfort throughout the process.`,
    overview: [
      `At ${hospital.name}, we are dedicated to providing you and your loved ones with exceptional care for medical diagnosis and treatment.`,
      "In addition to providing you with high-quality services and clinical care, we also give access to the most advanced medical technology and the greatest diagnostic equipment available.",
      "Our dedicated team and excellent facilities ensure you will receive quality care, as we treat and manage various conditions in both adults and children."
    ],
    preOp: [
      `Comprehensive consultation with a specialist to review your medical history and suitability for ${facilityName}.`,
      "Specific diagnostic tests may be required 1-2 days prior to the procedure.",
      "Detailed health education session regarding the procedure and expected outcomes.",
      "Fasting or medication adjustments as prescribed by your attending doctor."
    ],
    procedure: [
      "The procedure is performed in a sterile, internationally accredited environment.",
      "Anesthesia or sedation is administered by board-certified anesthesiologists if required.",
      `Real-time monitoring ensures patient safety during the ${facilityName} process.`,
      "Post-procedure observation in our dedicated recovery suites."
    ],
    benefits: [
      "State-of-the-art equipment and technology",
      "Highly trained medical professionals",
      "Internationally accredited facilities",
      "Personalized care tailored to your needs"
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
          <span className="cursor-pointer hover:text-slate-900 transition-colors" onClick={onBack}>Facilities</span>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <span className="font-medium text-slate-900 truncate max-w-[200px]">{facilityName}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left Content Column */}
          <div className="lg:col-span-8">

            {/* Hero Image */}
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 mb-8 relative group">
              <img
                src={`https://source.unsplash.com/1600x900/?hospital,medical,${facilityName.split(' ')[0]}`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1600';
                }}
                alt={facilityName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>

            {/* Title & Header Info */}
            <h1 className="text-3xl md:text-4xl font-medium text-slate-900 mb-2 tracking-tight leading-tight">{facilityName}</h1>
            <p className="text-base font-medium text-slate-600 mb-4">Medical Facility</p>

            <div className="flex items-center gap-2 text-sm text-slate-900 mb-8">
              <span className="text-lg mr-1">
                {hospital.country === 'Thailand' ? '🇹🇭' :
                 hospital.country === 'Singapore' ? '🇸🇬' :
                 hospital.country === 'Malaysia' ? '🇲🇾' : '🏳️'}
              </span>
              <span>{hospital.name}, {hospital.location}, {hospital.country}</span>
            </div>

            <button className="bg-[#1C1C1C] text-white px-8 py-3.5 rounded-xl font-semibold text-sm hover:bg-black transition-colors shadow-lg shadow-slate-900/10 mb-12">
              Request Treatment Info
            </button>

            {/* Description */}
            <p className="text-slate-600 leading-relaxed mb-10 text-[15px]">
              {content.description}
            </p>

            {/* Overview */}
            <section className="mb-10 pb-10 border-b border-slate-100">
              <h3 className="flex items-center gap-2 text-lg font-medium text-slate-900 mb-4">
                <Info className="w-5 h-5 text-slate-400" /> Overview
              </h3>
              <div className="space-y-4">
                {content.overview.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <span className="flex-shrink-0 w-6 h-6 bg-[#F1FCA7] rounded flex items-center justify-center text-xs font-medium text-slate-900 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-sm text-slate-600 leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Pre-operation */}
            <section className="mb-10 pb-10 border-b border-slate-100">
              <h3 className="flex items-center gap-2 text-lg font-medium text-slate-900 mb-4">
                <ClipboardList className="w-5 h-5 text-slate-400" /> Pre-operation {facilityName}
              </h3>
              <ul className="space-y-3">
                {content.preOp.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-2 flex-shrink-0" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Procedure */}
            <section className="mb-10 pb-10 border-b border-slate-100">
              <h3 className="flex items-center gap-2 text-lg font-medium text-slate-900 mb-4">
                <FileText className="w-5 h-5 text-slate-400" /> {facilityName} Procedure
              </h3>
              <ul className="space-y-3">
                {content.procedure.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-2 flex-shrink-0" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Benefits */}
            <section className="mb-16">
              <h3 className="flex items-center gap-2 text-lg font-medium text-slate-900 mb-4">
                <HelpCircle className="w-5 h-5 text-slate-400" /> Benefits
              </h3>
              <ul className="space-y-3">
                {content.benefits.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                    <Check className="w-4 h-4 text-slate-900 mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
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
                  <h4 className="font-semibold text-slate-900 text-sm leading-tight mb-1">{hospital.name}</h4>
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
                className="w-full py-3 rounded-lg border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
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
