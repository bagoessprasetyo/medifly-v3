import React, { useState, useEffect } from 'react';

import { motion } from 'framer-motion';

import { Hospital } from '../types';

import { ChevronRight, ChevronDown, ChevronUp, Building2, Info, FileText, Check, HelpCircle, ClipboardList } from 'lucide-react';

import { InquiryFormModal } from './ui/InquiryFormModal';

 

interface FacilityDetailsPageProps {

  hospital: Hospital;

  facilityName: string;

  onBack: () => void;

  onNavigateToHospital: () => void;

}

 

export const FacilityDetailsPage: React.FC<FacilityDetailsPageProps> = ({ hospital, facilityName, onBack, onNavigateToHospital }) => {

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);

 

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

        <motion.div

          initial={{ opacity: 0, y: -10 }}

          animate={{ opacity: 1, y: 0 }}

          transition={{ duration: 0.4 }}

          className="flex items-center gap-2 text-sm text-slate-500 mb-6"

        >

          <span className="cursor-pointer hover:text-slate-900 transition-colors" onClick={onNavigateToHospital}>{hospital.name}</span>

          <ChevronRight className="w-4 h-4 text-slate-300" />

          <span className="cursor-pointer hover:text-slate-900 transition-colors" onClick={onBack}>Facilities</span>

          <ChevronRight className="w-4 h-4 text-slate-300" />

          <span className="font-semibold text-slate-900 truncate max-w-[200px]">{facilityName}</span>

        </motion.div>

 

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

 

          {/* Left Content Column */}

          <div className="lg:col-span-8">

 

            {/* Hero Image */}

            <motion.div

              initial={{ opacity: 0, y: 20 }}

              animate={{ opacity: 1, y: 0 }}

              transition={{ duration: 0.5 }}

              className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 mb-8 relative group"

            >

              <img

                src={`https://source.unsplash.com/1600x900/?hospital,medical,${facilityName.split(' ')[0]}`}

                onError={(e) => {

                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1600';

                }}

                alt={facilityName}

                className="w-full h-full object-cover"

              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

            </motion.div>

 

            {/* Title & Header Info */}

            <motion.h1

              initial={{ opacity: 0, y: 10 }}

              animate={{ opacity: 1, y: 0 }}

              transition={{ duration: 0.4, delay: 0.1 }}

              className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 tracking-tight leading-tight"

            >

              {facilityName}

            </motion.h1>

            <motion.p

              initial={{ opacity: 0, y: 10 }}

              animate={{ opacity: 1, y: 0 }}

              transition={{ duration: 0.4, delay: 0.15 }}

              className="text-base font-medium text-slate-600 mb-4"

            >

              Medical Facility

            </motion.p>

 

            <motion.div

              initial={{ opacity: 0, y: 10 }}

              animate={{ opacity: 1, y: 0 }}

              transition={{ duration: 0.4, delay: 0.2 }}

              className="flex items-center gap-2 text-sm text-slate-500 mb-8"

            >

              <span className="text-lg mr-1">

                {hospital.country === 'Thailand' ? '🇹🇭' :

                 hospital.country === 'Singapore' ? '🇸🇬' :

                 hospital.country === 'Malaysia' ? '🇲🇾' : '🏳️'}

              </span>

              <span>{hospital.name}, {hospital.location}, {hospital.country}</span>

            </motion.div>

 

            <motion.button

              initial={{ opacity: 0, y: 10 }}

              animate={{ opacity: 1, y: 0 }}

              transition={{ duration: 0.4, delay: 0.25 }}

              whileHover={{ scale: 1.02 }}

              whileTap={{ scale: 0.98 }}

              onClick={() => setIsInquiryModalOpen(true)}

              className="bg-[#1C1C1C] text-white px-8 py-3.5 rounded-xl font-semibold text-sm hover:bg-black transition-colors shadow-lg shadow-slate-900/10 mb-12"

            >

              Request Treatment Info

            </motion.button>

 

            {/* Description */}

            <motion.p

              initial={{ opacity: 0 }}

              animate={{ opacity: 1 }}

              transition={{ duration: 0.5, delay: 0.3 }}

              className="text-slate-600 leading-relaxed mb-10 text-[15px]"

            >

              {content.description}

            </motion.p>

 

            {/* Overview */}

            <motion.section

              initial={{ opacity: 0, y: 20 }}

              animate={{ opacity: 1, y: 0 }}

              transition={{ duration: 0.5, delay: 0.35 }}

              className="mb-10 pb-10 border-b border-slate-100"

            >

              <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-4">

                <Info className="w-5 h-5 text-slate-400" /> Overview

              </h3>

              <div className="space-y-4">

                {content.overview.map((item, idx) => (

                  <motion.div

                    key={idx}

                    initial={{ opacity: 0, x: -10 }}

                    animate={{ opacity: 1, x: 0 }}

                    transition={{ delay: 0.4 + idx * 0.1 }}

                    className="flex gap-4"

                  >

                    <span className="flex-shrink-0 w-6 h-6 bg-[#F1FCA7] rounded flex items-center justify-center text-xs font-bold text-slate-900 mt-0.5">

                      {idx + 1}

                    </span>

                    <p className="text-sm text-slate-600 leading-relaxed">{item}</p>

                  </motion.div>

                ))}

              </div>

            </motion.section>

 

            {/* Pre-operation */}

            <motion.section

              initial={{ opacity: 0, y: 20 }}

              animate={{ opacity: 1, y: 0 }}

              transition={{ duration: 0.5, delay: 0.4 }}

              className="mb-10 pb-10 border-b border-slate-100"

            >

              <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-4">

                <ClipboardList className="w-5 h-5 text-slate-400" /> Pre-operation {facilityName}

              </h3>

              <ul className="space-y-3">

                {content.preOp.map((item, idx) => (

                  <motion.li

                    key={idx}

                    initial={{ opacity: 0, x: -10 }}

                    animate={{ opacity: 1, x: 0 }}

                    transition={{ delay: 0.45 + idx * 0.05 }}

                    className="flex items-start gap-3 text-sm text-slate-600"

                  >

                    <span className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-2 flex-shrink-0" />

                    <span className="leading-relaxed">{item}</span>

                  </motion.li>

                ))}

              </ul>

            </motion.section>

 

            {/* Procedure */}

            <motion.section

              initial={{ opacity: 0, y: 20 }}

              animate={{ opacity: 1, y: 0 }}

              transition={{ duration: 0.5, delay: 0.45 }}

              className="mb-10 pb-10 border-b border-slate-100"

            >

              <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-4">

                <FileText className="w-5 h-5 text-slate-400" /> {facilityName} Procedure

              </h3>

              <ul className="space-y-3">

                {content.procedure.map((item, idx) => (

                  <motion.li

                    key={idx}

                    initial={{ opacity: 0, x: -10 }}

                    animate={{ opacity: 1, x: 0 }}

                    transition={{ delay: 0.5 + idx * 0.05 }}

                    className="flex items-start gap-3 text-sm text-slate-600"

                  >

                    <span className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-2 flex-shrink-0" />

                    <span className="leading-relaxed">{item}</span>

                  </motion.li>

                ))}

              </ul>

            </motion.section>

 

            {/* Benefits */}

            <motion.section

              initial={{ opacity: 0, y: 20 }}

              animate={{ opacity: 1, y: 0 }}

              transition={{ duration: 0.5, delay: 0.5 }}

              className="mb-16"

            >

              <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-4">

                <HelpCircle className="w-5 h-5 text-slate-400" /> Benefits

              </h3>

              <ul className="space-y-3">

                {content.benefits.map((item, idx) => (

                  <motion.li

                    key={idx}

                    initial={{ opacity: 0, x: -10 }}

                    animate={{ opacity: 1, x: 0 }}

                    transition={{ delay: 0.55 + idx * 0.05 }}

                    className="flex items-start gap-3 text-sm text-slate-600"

                  >

                    <Check className="w-4 h-4 text-slate-900 mt-0.5 flex-shrink-0" />

                    <span className="leading-relaxed">{item}</span>

                  </motion.li>

                ))}

              </ul>

            </motion.section>

 

            {/* FAQ */}

            <motion.section

              initial={{ opacity: 0, y: 20 }}

              animate={{ opacity: 1, y: 0 }}

              transition={{ duration: 0.5, delay: 0.55 }}

            >

              <h2 className="text-3xl font-bold text-slate-900 mb-8">Frequently Asked Question</h2>

              <div className="space-y-4 border-t border-slate-100 pt-4">

                {content.faqs.map((q, i) => (

                  <motion.div

                    key={i}

                    initial={{ opacity: 0, y: 10 }}

                    animate={{ opacity: 1, y: 0 }}

                    transition={{ delay: 0.6 + i * 0.05 }}

                    className="border-b border-slate-100 pb-4"

                  >

                    <button

                      onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}

                      className="flex items-center justify-between w-full text-left focus:outline-none group py-2"

                    >

                      <span className="font-medium text-sm text-[#1C1C1C]">{q.q}</span>

                      {openFaqIndex === i ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}

                    </button>

                    {openFaqIndex === i && (

                      <motion.div

                        initial={{ opacity: 0, height: 0 }}

                        animate={{ opacity: 1, height: 'auto' }}

                        exit={{ opacity: 0, height: 0 }}

                        transition={{ duration: 0.3 }}

                        className="mt-3 text-sm text-slate-500 leading-relaxed pr-8"

                      >

                        {q.a}

                      </motion.div>

                    )}

                  </motion.div>

                ))}

              </div>

            </motion.section>

 

          </div>

 

          {/* Right Sidebar - Sticky Hospital Card */}

          <div className="lg:col-span-4 relative">

            <motion.div

              initial={{ opacity: 0, x: 20 }}

              animate={{ opacity: 1, x: 0 }}

              transition={{ duration: 0.5, delay: 0.3 }}

              className="sticky top-28 bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]"

            >

 

              <div className="flex items-center gap-3 mb-6">

                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">

                  <Building2 className="w-5 h-5 text-slate-900" />

                </div>

                <h3 className="text-lg font-bold text-slate-900">Hospital</h3>

              </div>

 

              <motion.div

                initial={{ opacity: 0, scale: 0.95 }}

                animate={{ opacity: 1, scale: 1 }}

                transition={{ delay: 0.4 }}

                className="rounded-xl overflow-hidden mb-4 relative h-32 bg-slate-100"

              >

                {hospital.imageUrl && (

                  <img src={hospital.imageUrl} alt={hospital.name} className="w-full h-full object-cover" />

                )}

              </motion.div>

 

              <div className="flex items-start gap-3 mb-4">

                <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">

                  <span className="text-[10px] font-bold text-slate-600">{hospital.name.substring(0,2).toUpperCase()}</span>

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

 

              <motion.button

                whileHover={{ scale: 1.02 }}

                whileTap={{ scale: 0.98 }}

                onClick={onNavigateToHospital}

                className="w-full py-3 rounded-lg border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"

              >

                View Hospital

              </motion.button>

            </motion.div>

          </div>

 

        </div>

      </div>

 

      {/* Inquiry Form Modal */}

      <InquiryFormModal

        isOpen={isInquiryModalOpen}

        onClose={() => setIsInquiryModalOpen(false)}

        defaultProcedure={`${facilityName} at ${hospital.name}`}

      />

    </div>

  );

};