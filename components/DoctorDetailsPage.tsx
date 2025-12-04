import React, { useState, useEffect } from 'react';

import { motion } from 'framer-motion';

import { Doctor } from '../types';

import { User, Stethoscope, GraduationCap, Calendar, Building2, MapPin, ChevronDown, ChevronUp, Languages, MessageSquare, Info, Check, ArrowLeft, ChevronRight } from 'lucide-react';

import { DoctorCard } from './DoctorCard';

import { DOCTORS, HOSPITALS } from '../constants';

import { InquiryFormModal } from './ui/InquiryFormModal';

 

interface DoctorDetailsPageProps {

  doctor: Doctor;

  onBack: () => void;

  onNavigateToHospital: (hospitalId: string) => void;

  onViewDoctor: (doctor: Doctor) => void;

}

 

// Animation variants

const fadeInUp = {

  initial: { opacity: 0, y: 20 },

  animate: { opacity: 1, y: 0 },

  transition: { duration: 0.5 }

};

 

const staggerContainer = {

  animate: {

    transition: {

      staggerChildren: 0.1

    }

  }

};

 

const fadeIn = {

  initial: { opacity: 0 },

  animate: { opacity: 1 },

  transition: { duration: 0.4 }

};

 

export const DoctorDetailsPage: React.FC<DoctorDetailsPageProps> = ({ doctor, onBack, onNavigateToHospital, onViewDoctor }) => {

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const [showStickyHeader, setShowStickyHeader] = useState(false);

  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);

 

  // Scroll to top on mount or doctor change

  useEffect(() => {

    const mainContainer = document.getElementById('main-content-area');

    if (mainContainer) {

        mainContainer.scrollTo(0, 0);

    } else {

        window.scrollTo(0, 0);

    }

  }, [doctor.id]);

 

  useEffect(() => {

    const handleScroll = () => {

        // Adjust threshold as needed

        const mainContent = document.getElementById('main-content-area');

        if (mainContent) {

            setShowStickyHeader(mainContent.scrollTop > 200);

        } else {

            setShowStickyHeader(window.scrollY > 200);

        }

    };

 

    const mainContent = document.getElementById('main-content-area');

    if (mainContent) {

        mainContent.addEventListener('scroll', handleScroll);

    }

    window.addEventListener('scroll', handleScroll);

 

    return () => {

        if (mainContent) mainContent.removeEventListener('scroll', handleScroll);

        window.removeEventListener('scroll', handleScroll);

    };

  }, []);

 

  // Mock extended data

  const aboutText = `Dr. ${doctor.name} is a senior specialist in ${doctor.specialty}. He is one of the most experienced and professional doctors in his fields of interest. He has gained more than ${doctor.experienceYears} years of experience working with various leading national and international hospitals. He has deep knowledge about his specialties. He works with integrity and never compromises on his services.

 

Dr. ${doctor.name.split(' ').pop()} is the most amiable doctor who always greets others in the best possible manner. He also deals with his patients in the friendliest way. He has successfully administered the best treatment to thousands of patients who suffered from complex conditions. Currently, he delivers his remarkable services in the famous ${doctor.hospitalName}.

 

He also received advanced specialization training in modern technologies. He is also a fellow of multiple medical institutes where he provides his services as a researcher and competent trainer.`;

 

  const conditions = [

    "Hepatobiliary Pancreatic Surgery",

    "Whipple Procedure",

    "Laparoscopic Surgery",

    "Colorectal Cancer Surgery",

    "Advanced Trauma Care"

  ];

 

  const fellowships = [

    "MRCP (UK) — Member of the Royal College of Physicians, UK.",

    "FRCP (Edinburgh) — Fellow of the Royal College of Physicians of Edinburgh.",

    "Fellowship in Gastroenterology (Malaysia).",

    "MD from Universiti Sains Malaysia (USM)."

  ];

 

  const schedule = [

    { day: "Monday", time: "14:00 - 16:00" },

    { day: "Tuesday", time: "14:00 - 16:00" },

    { day: "Thursday", time: "14:00 - 16:00" },

    { day: "Wednesday", time: "14:00 - 16:00" },

    { day: "Friday", time: "14:00 - 16:00" },

    { day: "Saturday", time: "14:00 - 16:00" },

  ];

 

  const faqs = [

    "How do I find the right doctor for my condition?",

    "How can Medifly.Ai help me?",

    "How do I schedule an appointment or treatment?",

    "Are virtual consultations available before traveling?",

    "Are consultations available in multiple languages?"

  ];

 

  // Get related doctors - prioritize same specialty, then same hospital, then fill with other doctors

  const relatedDoctors = (() => {

    const sameSpecialty = DOCTORS.filter(d => d.id !== doctor.id && d.specialty === doctor.specialty);

    if (sameSpecialty.length >= 4) return sameSpecialty.slice(0, 4);

 

    // If not enough, add doctors from the same hospital

    const sameHospital = DOCTORS.filter(d =>

      d.id !== doctor.id &&

      d.specialty !== doctor.specialty &&

      d.hospitalName === doctor.hospitalName

    );

    const combined = [...sameSpecialty, ...sameHospital];

    if (combined.length >= 4) return combined.slice(0, 4);

 

    // If still not enough, add other doctors

    const others = DOCTORS.filter(d =>

      d.id !== doctor.id &&

      d.specialty !== doctor.specialty &&

      d.hospitalName !== doctor.hospitalName

    );

    return [...combined, ...others].slice(0, 4);

  })();

 

  // Find linked hospital object for image/data

  const hospitalData = HOSPITALS.find(h => h.id === doctor.hospitalId || h.name === doctor.hospitalName);

 

  return (

    <div className="bg-white min-h-screen font-sans text-[#1C1C1C] relative ">

 

        {/* Sticky Header - Slides down on scroll */}

        <div

            className={`fixed top-20 left-0 right-0 z-[40] bg-white border-b border-slate-100 shadow-sm transition-transform duration-300 ease-in-out py-3

            ${showStickyHeader ? 'translate-y-0' : '-translate-y-full'}`}

        >

            <div className="flex items-center justify-between max-w-7xl mx-auto px-6">

                <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200">

                        <img src={doctor.imageUrl} alt={doctor.name} className="w-full h-full object-cover" />

                    </div>

                    <div>

                        <h3 className="text-sm font-bold text-slate-900 leading-tight">{doctor.name}</h3>

                        <p className="text-xs text-slate-500">{doctor.specialty}</p>

                    </div>

                </div>

                <motion.button

                    whileHover={{ scale: 1.02 }}

                    whileTap={{ scale: 0.98 }}

                    onClick={() => setIsInquiryModalOpen(true)}

                    className="bg-[#1C1C1C] text-white px-4 py-2 rounded-lg font-medium text-xs hover:bg-black transition-colors"

                >

                    Request Treatment Info

                </motion.button>

            </div>

        </div>

 

        {/* Top Navbar Placeholder (Handled by Layout) */}

        <div className="h-8"></div>

 

        <div className="max-w-7xl mx-auto px-6 py-8">

 

            {/* Breadcrumb - Added for Navigation */}

            <motion.div

                initial={{ opacity: 0, y: -10 }}

                animate={{ opacity: 1, y: 0 }}

                transition={{ duration: 0.4 }}

                className="mb-8 hidden md:block"

            >

                <div className="flex items-center gap-2 text-sm text-slate-500">

                    <button onClick={onBack} className="hover:text-slate-900 transition-colors flex items-center gap-1">

                        <ArrowLeft className="w-4 h-4" /> Back

                    </button>

                    <span className="text-slate-300">|</span>

                    <span className="cursor-pointer hover:text-slate-900 transition-colors" onClick={onBack}>Doctors</span>

                    <ChevronRight className="w-4 h-4 text-slate-300" />

                    <span className="font-medium text-slate-900">{doctor.name}</span>

                </div>

            </motion.div>

 

            {/* Mobile Back Button */}

            <div className="md:hidden mb-6">

                 <button onClick={onBack} className="flex items-center gap-2 text-slate-900 font-medium p-2 -ml-2 rounded-full hover:bg-slate-50">

                    <ArrowLeft className="w-5 h-5" /> Back

                 </button>

            </div>

 

            {/* Header Profile */}

            <motion.div

                initial={{ opacity: 0, y: 20 }}

                animate={{ opacity: 1, y: 0 }}

                transition={{ duration: 0.5 }}

                className="flex flex-col md:flex-row gap-8 mb-12"

            >

                <motion.div

                    initial={{ opacity: 0, scale: 0.9 }}

                    animate={{ opacity: 1, scale: 1 }}

                    transition={{ duration: 0.5, delay: 0.1 }}

                    className="w-32 h-32 md:w-40 md:h-40 rounded-xl overflow-hidden shrink-0 border border-slate-100 bg-slate-50"

                >

                    <img src={doctor.imageUrl} alt={doctor.name} className="w-full h-full object-cover object-top" />

                </motion.div>

 

                <div className="flex-1">

                    <motion.h1

                        initial={{ opacity: 0, y: 10 }}

                        animate={{ opacity: 1, y: 0 }}

                        transition={{ duration: 0.4, delay: 0.2 }}

                        className="text-3xl md:text-4xl font-medium tracking-tight text-[#1C1C1C] mb-4"

                    >

                        {doctor.name}

                    </motion.h1>

 

                    <motion.div

                        initial={{ opacity: 0, y: 10 }}

                        animate={{ opacity: 1, y: 0 }}

                        transition={{ duration: 0.4, delay: 0.3 }}

                        className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-12 mb-6 max-w-2xl"

                    >

                        <div>

                            <span className="block text-sm text-zinc-500 mb-1">Specialization</span>

                            <span className="font-medium underline decoration-zinc-300 underline-offset-4">{doctor.specialty}</span>

                            <Info className="w-3.5 h-3.5 text-zinc-400 inline ml-2" />

                        </div>

                        <div>

                            <span className="block text-sm text-zinc-500 mb-1">Sub Specialization</span>

                            <span className="font-medium">{doctor.procedures[0]}, {doctor.procedures[1] || 'General'}</span>

                        </div>

                    </motion.div>

 

                    <motion.div

                        initial={{ opacity: 0, y: 10 }}

                        animate={{ opacity: 1, y: 0 }}

                        transition={{ duration: 0.4, delay: 0.4 }}

                        className="flex items-center gap-2"

                    >

                        <div className="w-8 h-8 rounded-full bg-[#F1FCA7] flex items-center justify-center shrink-0">

                            <Languages className="w-4 h-4 text-[#1C1C1C]" />

                        </div>

                        <span className="font-medium text-sm">{doctor.languages.join(', ')}</span>

                    </motion.div>

                </div>

 

                <motion.div

                    initial={{ opacity: 0, x: 20 }}

                    animate={{ opacity: 1, x: 0 }}

                    transition={{ duration: 0.4, delay: 0.3 }}

                    className="self-start md:self-center"

                >

                    <motion.button

                        whileHover={{ scale: 1.02 }}

                        whileTap={{ scale: 0.98 }}

                        onClick={() => setIsInquiryModalOpen(true)}

                        className="bg-[#1C1C1C] text-white px-6 py-3 rounded-lg font-medium text-sm hover:bg-black transition-colors shadow-lg shadow-black/5"

                    >

                        Request Treatment Info

                    </motion.button>

                </motion.div>

            </motion.div>

 

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

 

                {/* Left Content */}

                <div className="lg:col-span-8 space-y-12">

 

                    {/* About */}

                    <motion.section

                        initial={{ opacity: 0, y: 20 }}

                        animate={{ opacity: 1, y: 0 }}

                        transition={{ duration: 0.5, delay: 0.2 }}

                    >

                        <h2 className="flex items-center gap-2 text-lg font-medium mb-4">

                            <User className="w-5 h-5 text-zinc-400" /> Key Experience

                        </h2>

                        <div className="text-zinc-600 leading-relaxed text-sm space-y-4 whitespace-pre-line">

                            {aboutText}

                        </div>

                    </motion.section>

 

                    {/* Condition Treated */}

                    <motion.section

                        initial={{ opacity: 0, y: 20 }}

                        animate={{ opacity: 1, y: 0 }}

                        transition={{ duration: 0.5, delay: 0.3 }}

                    >

                        <h2 className="flex items-center gap-2 text-lg font-medium mb-4">

                            <Stethoscope className="w-5 h-5 text-zinc-400" /> Conditions Treated

                        </h2>

                        <div className="border-t border-zinc-100 pt-4">

                            <motion.ul

                                className="space-y-3"

                                variants={staggerContainer}

                                initial="initial"

                                animate="animate"

                            >

                                {conditions.map((item, i) => (

                                    <motion.li

                                        key={i}

                                        variants={fadeIn}

                                        transition={{ delay: 0.3 + i * 0.05 }}

                                        className="flex items-center gap-3 text-sm text-zinc-600"

                                    >

                                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>

                                        {item}

                                    </motion.li>

                                ))}

                            </motion.ul>

                        </div>

                    </motion.section>

 

                    {/* Fellowship */}

                    <motion.section

                        initial={{ opacity: 0, y: 20 }}

                        animate={{ opacity: 1, y: 0 }}

                        transition={{ duration: 0.5, delay: 0.4 }}

                    >

                        <h2 className="flex items-center gap-2 text-lg font-medium mb-4">

                            <GraduationCap className="w-5 h-5 text-zinc-400" /> Fellowship and Accreditation

                        </h2>

                        <div className="border-t border-zinc-100 pt-4">

                            <motion.ul

                                className="space-y-3"

                                variants={staggerContainer}

                                initial="initial"

                                animate="animate"

                            >

                                {fellowships.map((item, i) => (

                                    <motion.li

                                        key={i}

                                        variants={fadeIn}

                                        transition={{ delay: 0.4 + i * 0.05 }}

                                        className="flex items-start gap-3 text-sm text-zinc-600"

                                    >

                                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-2 shrink-0"></span>

                                        <span className="leading-relaxed">{item}</span>

                                    </motion.li>

                                ))}

                            </motion.ul>

                        </div>

                    </motion.section>

 

                    {/* FAQ */}

                    <motion.section

                        initial={{ opacity: 0, y: 20 }}

                        animate={{ opacity: 1, y: 0 }}

                        transition={{ duration: 0.5, delay: 0.5 }}

                    >

                        <h2 className="text-2xl font-medium mb-6">Frequently Asked Question</h2>

                        <div className="space-y-4 border-t border-zinc-100 pt-4">

                            {faqs.map((q, i) => (

                                <motion.div

                                    key={i}

                                    initial={{ opacity: 0, y: 10 }}

                                    animate={{ opacity: 1, y: 0 }}

                                    transition={{ delay: 0.5 + i * 0.05 }}

                                    className="border-b border-zinc-100 pb-4"

                                >

                                    <button

                                        onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}

                                        className="flex items-center justify-between w-full text-left focus:outline-none group"

                                    >

                                        <span className="font-medium text-sm text-[#1C1C1C]">{q}</span>

                                        {openFaqIndex === i ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}

                                    </button>

                                    {openFaqIndex === i && (

                                        <motion.div

                                            initial={{ opacity: 0, height: 0 }}

                                            animate={{ opacity: 1, height: 'auto' }}

                                            exit={{ opacity: 0, height: 0 }}

                                            transition={{ duration: 0.3 }}

                                            className="mt-3 text-sm text-zinc-500 leading-relaxed pr-8"

                                        >

                                            Absolutely. Medifly AI assists you through every step of your medical journey — from finding the right hospital and doctor to estimating costs, planning your stay, and arranging travel details. We make medical trips simpler, smarter, and stress-free.

                                        </motion.div>

                                    )}

                                </motion.div>

                            ))}

                        </div>

                    </motion.section>

 

                </div>

 

                {/* Right Sidebar */}

                <div className="lg:col-span-4 space-y-8">

 

                    {/* Hospital Widget */}

                    <motion.div

                        initial={{ opacity: 0, x: 20 }}

                        animate={{ opacity: 1, x: 0 }}

                        transition={{ duration: 0.5, delay: 0.3 }}

                        className="border border-zinc-200 rounded-xl bg-white p-6 shadow-sm"

                    >

                        <div className="flex items-center gap-2 font-medium text-[#1C1C1C] mb-6">

                            <div className="p-1.5 bg-zinc-100 rounded-md"><Building2 className="w-4 h-4" /></div> Hospital

                        </div>

 

                        <div className="flex items-start gap-4 mb-4">

                            <div className="w-12 h-12 rounded-full border border-zinc-100 p-1 bg-white shrink-0">

                                {/* Logo placeholder */}

                                <div className="w-full h-full rounded-full bg-blue-50 flex items-center justify-center text-[10px] font-bold text-blue-600">

                                    {doctor.hospitalName.substring(0, 2).toUpperCase()}

                                </div>

                            </div>

                            <div>

                                <h3 className="font-medium text-sm text-[#1C1C1C]">{doctor.hospitalName}</h3>

                                <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-1">

                                    <span>{doctor.hospitalCountry === 'Malaysia' ? '🇲🇾' : '🏳️'}</span>

                                    <span>{doctor.hospitalCountry}</span>

                                </div>

                            </div>

                        </div>

 

                        <div className="bg-[#F1FCA7] px-3 py-1.5 rounded-md text-xs font-medium text-[#1C1C1C] inline-flex items-center gap-1.5 mb-4">

                            <Languages className="w-3.5 h-3.5" /> Offers Multiple Language Support

                        </div>

 

                        <p className="text-xs text-zinc-500 leading-relaxed mb-6 border-b border-zinc-100 pb-6">

                            Committed to patient-centered care, {doctor.hospitalName} ensures high-quality treatments tailored to individual needs.

                        </p>

 

                        <motion.button

                            whileHover={{ scale: 1.02 }}

                            whileTap={{ scale: 0.98 }}

                            onClick={() => onNavigateToHospital(doctor.hospitalId)}

                            className="w-full py-2.5 border border-zinc-200 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"

                        >

                            View Hospital

                        </motion.button>

                    </motion.div>

 

                    {/* Schedule Widget */}

                    <motion.div

                        initial={{ opacity: 0, x: 20 }}

                        animate={{ opacity: 1, x: 0 }}

                        transition={{ duration: 0.5, delay: 0.4 }}

                        className="border border-zinc-200 rounded-xl bg-white overflow-hidden shadow-sm"

                    >

                        <div className="p-6 pb-4">

                            <div className="flex items-center gap-2 font-medium text-[#1C1C1C]">

                                <div className="p-1.5 bg-zinc-100 rounded-md"><Calendar className="w-4 h-4" /></div> Schedule

                            </div>

                        </div>

 

                        <div className="text-sm">

                            <div className="grid grid-cols-2 bg-[#FAF8F7] font-medium p-3 border-y border-zinc-100">

                                <div className="pl-3">Day</div>

                                <div>Clinic Hour</div>

                            </div>

                            {schedule.map((slot, i) => (

                                <motion.div

                                    key={i}

                                    initial={{ opacity: 0, x: 10 }}

                                    animate={{ opacity: 1, x: 0 }}

                                    transition={{ delay: 0.4 + i * 0.05 }}

                                    className={`grid grid-cols-2 p-3 border-b border-zinc-50 last:border-0 ${i % 2 === 0 ? 'bg-[#FDFDE8]' : 'bg-white'}`}

                                >

                                    <div className="pl-3 text-[#1C1C1C]">{slot.day}</div>

                                    <div className="text-zinc-600">{slot.time}</div>

                                </motion.div>

                            ))}

                        </div>

                    </motion.div>

 

                </div>

            </div>

 

            {/* More Doctors */}

            <motion.div

                initial={{ opacity: 0, y: 30 }}

                animate={{ opacity: 1, y: 0 }}

                transition={{ duration: 0.6, delay: 0.5 }}

                className="mt-20 border-t border-zinc-100 pt-16"

            >

                <h2 className="text-3xl font-medium text-center mb-12">More Doctors That Match Your Needs</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                    {relatedDoctors.length > 0 ? relatedDoctors.map((doc, i) => (

                        <motion.div

                            key={doc.id}

                            initial={{ opacity: 0, y: 20 }}

                            animate={{ opacity: 1, y: 0 }}

                            transition={{ delay: 0.5 + i * 0.1 }}

                        >

                            <DoctorCard doctor={doc} onViewDetails={onViewDoctor} />

                        </motion.div>

                    )) : (

                        <div className="col-span-full text-center text-zinc-400 py-8">No other doctors found in this category.</div>

                    )}

                </div>

                <div className="flex justify-center mt-12">

                    <motion.button

                        whileHover={{ scale: 1.02 }}

                        whileTap={{ scale: 0.98 }}

                        className="bg-[#1C1C1C] text-white px-8 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors"

                    >

                        View More

                    </motion.button>

                </div>

            </motion.div>

 

        </div>

 

        {/* Inquiry Form Modal */}

        <InquiryFormModal

            isOpen={isInquiryModalOpen}

            onClose={() => setIsInquiryModalOpen(false)}

            defaultProcedure={`Consultation with ${doctor.name} - ${doctor.specialty}`}

        />

    </div>

  );

};