
import React, { useState, useEffect } from 'react';
import { Hospital } from '../types';
import { ArrowLeft, ChevronRight, ChevronDown, ChevronUp, MapPin, Star, ShieldCheck, Building2 } from 'lucide-react';

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
  const generateContent = (name: string) => {
    return {
      description: `${name} is a specialized medical service offered at ${hospital.name}, designed to provide state-of-the-art care using advanced technology. Our dedicated team ensures precision, safety, and comfort throughout the process.`,
      preOp: [
        `Comprehensive consultation with a specialist to review your medical history and suitability for ${name}.`,
        "Specific diagnostic tests may be required 1-2 days prior to the procedure.",
        "Detailed health education session regarding the procedure and expected outcomes.",
        "Fasting or medication adjustments as prescribed by your attending doctor."
      ],
      procedure: [
        "The procedure is performed in a sterile, internationally accredited environment.",
        "Anesthesia or sedation is administered by board-certified anesthesiologists if required.",
        `Real-time monitoring ensures patient safety during the ${name} process.`,
        "Post-procedure observation in our dedicated recovery suites."
      ],
      faqs: [
        { q: `What is ${name}?`, a: `${name} is a medical procedure/service aimed at diagnosing or treating specific conditions with high precision.` },
        { q: `How does ${hospital.name} perform this?`, a: `We utilize the latest technology and follow international protocols (JCI) to ensure the highest standard of care.` },
        { q: "Can I book a consultation online?", a: "Yes, Medifly can assist you in booking a priority consultation with our specialists." },
        { q: "What is the recovery time?", a: "Recovery time varies by patient, but our minimally invasive techniques generally allow for faster recovery." }
      ]
    };
  };

  const content = generateContent(facilityName);

  return (
    <div className="bg-white min-h-screen pb-20 font-sans text-slate-900">
      
      {/* Navbar Placeholder (handled by Layout, but we need spacing) */}
      <div className="h-6"></div>

      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <span className="cursor-pointer hover:text-slate-900 transition-colors" onClick={onNavigateToHospital}>{hospital.name}</span>
            <ChevronRight className="w-4 h-4 text-slate-300" />
            <span className="cursor-pointer hover:text-slate-900 transition-colors" onClick={onBack}>Facilities</span>
            <ChevronRight className="w-4 h-4 text-slate-300" />
            <span className="font-semibold text-slate-900">{facilityName}</span>
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

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">{facilityName}</h1>

                {/* Description */}
                <div className="prose prose-slate max-w-none mb-10 text-slate-600 leading-relaxed">
                    <p className="text-lg">{content.description}</p>
                    <p>
                        At {hospital.name}, we are dedicated to providing you and your loved ones with exceptional care for medical diagnosis and treatment. In addition to providing you with high-quality services and clinical care, we also give them access to the most advanced medical technology and the greatest diagnostic equipment available.
                    </p>
                    <p>
                        Our dedicated team and excellent facilities ensure you will receive quality care, as we treat and manage various eye conditions and diseases in both adults and children.
                    </p>
                </div>

                {/* Pre-operation Section */}
                <div className="mb-10">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Pre-operation {facilityName}</h2>
                    <p className="text-slate-600 mb-4">Before undergoing {facilityName} at {hospital.name}, your doctor will first perform a series of eye exams to determine if you are a good candidate for the procedure.</p>
                    <ul className="space-y-3">
                        {content.preOp.map((step, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-slate-600">
                                <span className="mt-2 w-1.5 h-1.5 bg-slate-400 rounded-full flex-shrink-0" />
                                <span className="leading-relaxed">{step}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Procedure Section */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">{facilityName} Procedure</h2>
                    <ul className="space-y-3">
                        {content.procedure.map((step, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-slate-600">
                                <span className="mt-2 w-1.5 h-1.5 bg-slate-400 rounded-full flex-shrink-0" />
                                <span className="leading-relaxed">{step}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* FAQ Section */}
                <div className="pt-10 border-t border-slate-100">
                    <h2 className="text-3xl font-bold text-slate-900 mb-8">Frequently Asked Question</h2>
                    <div className="space-y-4">
                        {content.faqs.map((faq, idx) => (
                            <div key={idx} className="border-b border-slate-100 pb-4">
                                <button 
                                    onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                                    className="flex items-center justify-between w-full text-left focus:outline-none group py-2"
                                >
                                    <span className="text-base font-medium text-slate-900">{faq.q}</span>
                                    {openFaqIndex === idx ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                                </button>
                                {openFaqIndex === idx && (
                                    <div className="mt-2 animate-in slide-in-from-top-1 duration-200">
                                        <p className="text-slate-600 leading-relaxed pr-8">{faq.a}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-4 relative">
                <div className="sticky top-28 bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
                    
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-slate-900" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Hospital</h3>
                    </div>

                    <div className="rounded-xl overflow-hidden mb-4 relative h-32">
                        <img src={hospital.imageUrl} alt={hospital.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                            {/* Mock Logo */}
                            <span className="text-[10px] font-bold text-slate-600">{hospital.name.substring(0,2).toUpperCase()}</span>
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-900 text-sm leading-tight mb-1">{hospital.name}</h4>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                {hospital.country === 'Thailand' ? '🇹🇭' : '🇲🇾'}
                                <span>{hospital.location}, {hospital.country}</span>
                            </div>
                        </div>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed mb-6 border-b border-slate-100 pb-6">
                        Committed to patient-centered care, {hospital.name} ensures high-quality treatments tailored to individual needs.
                    </p>

                    <div className="space-y-3">
                        <button 
                            onClick={onNavigateToHospital}
                            className="w-full py-3 rounded-lg border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
                        >
                            View Hospital
                        </button>
                        <button className="w-full py-3 rounded-lg bg-[#1C1C1C] text-white font-semibold text-sm hover:bg-black transition-colors shadow-lg shadow-slate-900/10">
                            Request Treatment Info
                        </button>
                    </div>

                </div>
            </div>

        </div>
      </div>
    </div>
  );
};
