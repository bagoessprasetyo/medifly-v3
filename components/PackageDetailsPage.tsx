import React, { useState, useEffect } from 'react';

import { motion } from 'framer-motion';

import { MedicalPackage, Hospital } from '../types';

import { HOSPITALS } from '../constants';

import { ArrowLeft, ChevronRight, ChevronDown, ChevronUp, MapPin, Building2, Calendar, Info, FileText, Check, Smile, HelpCircle, ClipboardList } from 'lucide-react';

import { InquiryFormModal } from './ui/InquiryFormModal';

 

interface PackageDetailsPageProps {

  medicalPackage: MedicalPackage;

  onBack: () => void;

  onNavigateToHospital: (hospital: Hospital) => void;

}

 

export const PackageDetailsPage: React.FC<PackageDetailsPageProps> = ({ medicalPackage, onBack, onNavigateToHospital }) => {

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

  }, [medicalPackage.id]);

 

  // Find associated hospital with case-insensitive robust matching

  const hospital = HOSPITALS.find(h =>

    h.name.toLowerCase() === medicalPackage.hospitalName.toLowerCase() ||

    medicalPackage.hospitalName.toLowerCase().includes(h.name.toLowerCase())

  ) || HOSPITALS[0];

 

  // Mock detailed content generator

  const content = {

    description: `A ${medicalPackage.title} is a comprehensive series of examinations performed to detect chronic diseases and health disorders as early as possible. Routine health checks can increase the chances of longer life and help maintain overall well-being. Regardless of whether symptoms are present, doctors still recommend doing a medical check-up annually.`,

    terms: [

      "This package includes a physical exam, visual assessment, chest X-ray, complete blood count, complete urinalysis, liver function test, total cholesterol, and fasting blood glucose.",

      "Arrange your visit time according to your convenience! Your voucher is valid for 14 days."

    ],

    included: [

      "General Practitioner Consultation.",

      "Visual Assessment.",

      "Radiology: Chest X-ray with Radiologist Interpretation.",

      "Complete Blood Count",

      "Complete Urinalysis.",

      "Liver Function Test: SGOT & SGPT.",

      "Lipid Profile: Total Cholesterol.",

      "Blood Glucose Test: Fasting Blood Sugar"

    ],

    benefits: [

      "Detects early whether any disease is present in the body.",

      "Helps determine the next steps if any condition is identified.",

      "Provides peace of mind regarding your current health status."

    ],

    howTo: [

      "Generally, a women's medical check-up consists of a series of laboratory tests using blood and urine samples.",

      "If the package includes a doctor's procedure, the doctor will take a cervical tissue sample to check for abnormal cells, then send it for further laboratory analysis."

    ],

    preparation: [

      "Make sure you get enough sleep, at least 6–8 hours.",

      "Some packages include tests that require fasting. Before purchasing the package, please contact our customer service to confirm whether fasting is required. If fasting is needed, patients must not eat or drink (except water) for 10–12 hours before the test.",

      "Avoid consuming alcoholic beverages 24 hours before the test.",

      "Show your medical records (including suspected pregnancy) or your daily medications list."

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

          <span className="cursor-pointer hover:text-slate-900 transition-colors" onClick={onBack}>Packages</span>

          <ChevronRight className="w-4 h-4 text-slate-300" />

          <span className="cursor-pointer hover:text-slate-900 transition-colors">{medicalPackage.category}</span>

          <ChevronRight className="w-4 h-4 text-slate-300" />

          <span className="font-medium text-slate-900 truncate max-w-[200px]">{medicalPackage.title}</span>

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

                src={medicalPackage.imageUrl}

                alt={medicalPackage.title}

                className="w-full h-full object-cover"

              />

              {medicalPackage.discount && (

                <motion.div

                  initial={{ opacity: 0, x: -20 }}

                  animate={{ opacity: 1, x: 0 }}

                  transition={{ duration: 0.4, delay: 0.3 }}

                  className="absolute bottom-6 left-6 bg-[#FF6666] text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm"

                >

                  {medicalPackage.discount}

                </motion.div>

              )}

            </motion.div>

 

            {/* Title & Header Info */}

            <motion.h1

              initial={{ opacity: 0, y: 10 }}

              animate={{ opacity: 1, y: 0 }}

              transition={{ duration: 0.4, delay: 0.1 }}

              className="text-3xl md:text-4xl font-semibold text-slate-900 mb-2 tracking-tight leading-tight"

            >

              {medicalPackage.title}

            </motion.h1>

            <motion.p

              initial={{ opacity: 0, y: 10 }}

              animate={{ opacity: 1, y: 0 }}

              transition={{ duration: 0.4, delay: 0.15 }}

              className="text-base font-medium text-slate-600 mb-4"

            >

              {medicalPackage.category}

            </motion.p>

 

            <motion.div

              initial={{ opacity: 0, y: 10 }}

              animate={{ opacity: 1, y: 0 }}

              transition={{ duration: 0.4, delay: 0.2 }}

              className="flex items-center gap-2 text-sm text-slate-500 mb-6"

            >

              <span className="text-lg mr-1">

                {hospital?.country === 'Thailand' ? '🇹🇭' :

                 hospital?.country === 'Singapore' ? '🇸🇬' :

                 hospital?.country === 'Malaysia' ? '🇲🇾' : '🏳️'}

              </span>

              <span>{hospital?.name}, {hospital?.location}, {hospital?.country}</span>

            </motion.div>

 

            {/* Pricing Block */}

            <motion.div

              initial={{ opacity: 0, y: 10 }}

              animate={{ opacity: 1, y: 0 }}

              transition={{ duration: 0.4, delay: 0.25 }}

              className="flex flex-wrap items-center gap-4 mb-8"

            >

              <span className="text-2xl font-medium text-slate-900">{medicalPackage.price}</span>

              {medicalPackage.originalPrice && (

                <span className="text-sm text-slate-400 line-through">{medicalPackage.originalPrice}</span>

              )}

              {medicalPackage.validUntil && (

                <span className="bg-[#FF6666] text-white text-xs font-semibold px-2.5 py-1 rounded flex items-center gap-1.5">

                  <Calendar className="w-3 h-3" /> {medicalPackage.validUntil}

                </span>

              )}

            </motion.div>

 

            <motion.button

              initial={{ opacity: 0, y: 10 }}

              animate={{ opacity: 1, y: 0 }}

              transition={{ duration: 0.4, delay: 0.3 }}

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

 

            {/* Terms & Conditions */}

            <motion.section

              initial={{ opacity: 0, y: 20 }}

              animate={{ opacity: 1, y: 0 }}

              transition={{ duration: 0.5, delay: 0.35 }}

              className="mb-10 pb-10 border-b border-slate-100"

            >

              <h3 className="flex items-center gap-2 text-lg font-medium text-slate-900 mb-4">

                <Info className="w-5 h-5 text-slate-400" /> Terms & Conditions

              </h3>

              <div className="space-y-4">

                {content.terms.map((term, idx) => (

                  <motion.div

                    key={idx}

                    initial={{ opacity: 0, x: -10 }}

                    animate={{ opacity: 1, x: 0 }}

                    transition={{ delay: 0.4 + idx * 0.1 }}

                    className="flex gap-4"

                  >

                    <span className="flex-shrink-0 w-6 h-6 bg-[#F1FCA7] rounded flex items-center justify-center text-xs font-medium text-slate-900 mt-0.5">

                      {idx + 1}

                    </span>

                    <p className="text-sm text-slate-600 leading-relaxed">{term}</p>

                  </motion.div>

                ))}

              </div>

            </motion.section>

 

            {/* Package Included */}

            <motion.section

              initial={{ opacity: 0, y: 20 }}

              animate={{ opacity: 1, y: 0 }}

              transition={{ duration: 0.5, delay: 0.4 }}

              className="mb-10 pb-10 border-b border-slate-100"

            >

              <h3 className="flex items-center gap-2 text-lg font-medium text-slate-900 mb-4">

                <FileText className="w-5 h-5 text-slate-400" /> Package Included

              </h3>

              <ul className="space-y-3">

                {content.included.map((item, idx) => (

                  <motion.li

                    key={idx}

                    initial={{ opacity: 0, x: -10 }}

                    animate={{ opacity: 1, x: 0 }}

                    transition={{ delay: 0.45 + idx * 0.05 }}

                    className="flex items-start gap-3 text-sm text-slate-600"

                  >

                    <Check className="w-4 h-4 text-slate-900 mt-0.5 flex-shrink-0" />

                    <span className="leading-relaxed">{item}</span>

                  </motion.li>

                ))}

              </ul>

            </motion.section>

 

            {/* Benefits */}

            <motion.section

              initial={{ opacity: 0, y: 20 }}

              animate={{ opacity: 1, y: 0 }}

              transition={{ duration: 0.5, delay: 0.45 }}

              className="mb-10 pb-10 border-b border-slate-100"

            >

              <h3 className="flex items-center gap-2 text-lg font-medium text-slate-900 mb-4">

                <Smile className="w-5 h-5 text-slate-400" /> Benefits

              </h3>

              <ul className="space-y-3">

                {content.benefits.map((item, idx) => (

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

 

            {/* How to do it */}

            <motion.section

              initial={{ opacity: 0, y: 20 }}

              animate={{ opacity: 1, y: 0 }}

              transition={{ duration: 0.5, delay: 0.5 }}

              className="mb-10 pb-10 border-b border-slate-100"

            >

              <h3 className="flex items-center gap-2 text-lg font-medium text-slate-900 mb-4">

                <HelpCircle className="w-5 h-5 text-slate-400" /> How to do it?

              </h3>

              <ul className="space-y-3">

                {content.howTo.map((item, idx) => (

                  <motion.li

                    key={idx}

                    initial={{ opacity: 0, x: -10 }}

                    animate={{ opacity: 1, x: 0 }}

                    transition={{ delay: 0.55 + idx * 0.05 }}

                    className="flex items-start gap-3 text-sm text-slate-600"

                  >

                    <span className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-2 flex-shrink-0" />

                    <span className="leading-relaxed">{item}</span>

                  </motion.li>

                ))}

              </ul>

            </motion.section>

 

            {/* Preparation */}

            <motion.section

              initial={{ opacity: 0, y: 20 }}

              animate={{ opacity: 1, y: 0 }}

              transition={{ duration: 0.5, delay: 0.55 }}

              className="mb-16"

            >

              <h3 className="flex items-center gap-2 text-lg font-medium text-slate-900 mb-4">

                <ClipboardList className="w-5 h-5 text-slate-400" /> Preparation

              </h3>

              <ul className="space-y-3">

                {content.preparation.map((item, idx) => (

                  <motion.li

                    key={idx}

                    initial={{ opacity: 0, x: -10 }}

                    animate={{ opacity: 1, x: 0 }}

                    transition={{ delay: 0.6 + idx * 0.05 }}

                    className="flex items-start gap-3 text-sm text-slate-600"

                  >

                    <span className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-2 flex-shrink-0" />

                    <span className="leading-relaxed">{item}</span>

                  </motion.li>

                ))}

              </ul>

            </motion.section>

 

            {/* FAQ */}

            <motion.section

              initial={{ opacity: 0, y: 20 }}

              animate={{ opacity: 1, y: 0 }}

              transition={{ duration: 0.5, delay: 0.6 }}

            >

              <h2 className="text-3xl font-medium text-slate-900 mb-8">Frequently Asked Question</h2>

              <div className="space-y-4 border-t border-slate-100 pt-4">

                {content.faqs.map((q, i) => (

                  <motion.div

                    key={i}

                    initial={{ opacity: 0, y: 10 }}

                    animate={{ opacity: 1, y: 0 }}

                    transition={{ delay: 0.65 + i * 0.05 }}

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

                <h3 className="text-lg font-medium text-slate-900">Hospital</h3>

              </div>

 

              <motion.div

                initial={{ opacity: 0, scale: 0.95 }}

                animate={{ opacity: 1, scale: 1 }}

                transition={{ delay: 0.4 }}

                className="rounded-xl overflow-hidden mb-4 relative h-32 bg-slate-100"

              >

                {hospital?.imageUrl && (

                  <img src={hospital.imageUrl} alt={hospital.name} className="w-full h-full object-cover" />

                )}

              </motion.div>

 

              <div className="flex items-start gap-3 mb-4">

                <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">

                  <span className="text-[10px] font-medium text-slate-600">{hospital?.name.substring(0,2).toUpperCase()}</span>

                </div>

                <div>

                  <h4 className="font-semibold text-slate-900 text-sm leading-tight mb-1">{hospital?.name}</h4>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500">

                    <span className="text-base">{hospital?.country === 'Thailand' ? '🇹🇭' : hospital?.country === 'Malaysia' ? '🇲🇾' : '🏳️'}</span>

                    <span className="truncate max-w-[150px]">{hospital?.location}, {hospital?.country}</span>

                  </div>

                </div>

              </div>

 

              <p className="text-xs text-slate-500 leading-relaxed mb-6 border-b border-slate-100 pb-6">

                Committed to patient-centered care, {hospital?.name} ensures high-quality treatments tailored to individual needs.

              </p>

 

              <motion.button

                whileHover={{ scale: 1.02 }}

                whileTap={{ scale: 0.98 }}

                onClick={() => onNavigateToHospital(hospital)}

                className="w-full py-3 rounded-lg border border-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors"

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

        defaultProcedure={`${medicalPackage.title} - ${medicalPackage.category}`}

      />

    </div>

  );

};