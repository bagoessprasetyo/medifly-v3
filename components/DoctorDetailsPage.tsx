

import React, { useState, useEffect } from 'react';
import { Doctor } from '../types';
import { User, Stethoscope, GraduationCap, Calendar, Building2, MapPin, ChevronDown, ChevronUp, Languages, MessageSquare, Info, Check } from 'lucide-react';
import { DoctorCard } from './DoctorCard';
import { DOCTORS, HOSPITALS } from '../constants';

interface DoctorDetailsPageProps {
  doctor: Doctor;
  onBack: () => void;
  onNavigateToHospital: (hospitalId: string) => void;
  onViewDoctor: (doctor: Doctor) => void;
}

export const DoctorDetailsPage: React.FC<DoctorDetailsPageProps> = ({ doctor, onBack, onNavigateToHospital, onViewDoctor }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [showStickyHeader, setShowStickyHeader] = useState(false);

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
    "What is Medifly?",
    "How Does Medifly.ai works?",
    "Can Medifly ai Help me to on a medical trip?",
    "How do I book a for treatment?"
  ];

  const relatedDoctors = DOCTORS.filter(d => d.id !== doctor.id && d.specialty === doctor.specialty).slice(0, 4);
  
  // Find linked hospital object for image/data
  const hospitalData = HOSPITALS.find(h => h.id === doctor.hospitalId || h.name === doctor.hospitalName);

  return (
    <div className="bg-white min-h-screen font-sans text-[#1C1C1C] relative">
        
        {/* Sticky Header - Slides down on scroll */}
        <div 
            className={`fixed top-20 left-0 right-0 z-[40] bg-white border-b border-slate-100 shadow-sm transition-transform duration-300 ease-in-out px-6 py-3 flex items-center justify-between
            ${showStickyHeader ? 'translate-y-0' : '-translate-y-full'}`}
        >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200">
                    <img src={doctor.imageUrl} alt={doctor.name} className="w-full h-full object-cover" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-tight">{doctor.name}</h3>
                    <p className="text-xs text-slate-500">{doctor.specialty}</p>
                </div>
            </div>
            <button className="bg-[#1C1C1C] text-white px-4 py-2 rounded-lg font-medium text-xs hover:bg-black transition-colors">
                Request Treatment Info
            </button>
        </div>

        {/* Top Navbar Placeholder (Handled by Layout) */}
        <div className="h-8"></div>

        <div className="max-w-[1400px] mx-auto px-6 py-8">
            
            {/* Header Profile */}
            <div className="flex flex-col md:flex-row gap-8 mb-12">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-xl overflow-hidden shrink-0 border border-slate-100 bg-slate-50">
                    <img src={doctor.imageUrl} alt={doctor.name} className="w-full h-full object-cover object-top" />
                </div>
                
                <div className="flex-1">
                    <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#1C1C1C] mb-4">{doctor.name}</h1>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-12 mb-6 max-w-2xl">
                        <div>
                            <span className="block text-sm text-zinc-500 mb-1">Specialization</span>
                            <span className="font-medium underline decoration-zinc-300 underline-offset-4">{doctor.specialty}</span>
                            <Info className="w-3.5 h-3.5 text-zinc-400 inline ml-2" />
                        </div>
                        <div>
                            <span className="block text-sm text-zinc-500 mb-1">Sub Specialization</span>
                            <span className="font-medium">{doctor.procedures[0]}, {doctor.procedures[1] || 'General'}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#F1FCA7] flex items-center justify-center shrink-0">
                            <Languages className="w-4 h-4 text-[#1C1C1C]" />
                        </div>
                        <span className="font-medium text-sm">{doctor.languages.join(', ')}</span>
                    </div>
                </div>

                <div className="self-start md:self-center">
                    <button className="bg-[#1C1C1C] text-white px-6 py-3 rounded-lg font-medium text-sm hover:bg-black transition-colors shadow-lg shadow-black/5">
                        Request Treatment Info
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* Left Content */}
                <div className="lg:col-span-8 space-y-12">
                    
                    {/* About */}
                    <section>
                        <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
                            <User className="w-5 h-5 text-zinc-400" /> About
                        </h2>
                        <div className="text-zinc-600 leading-relaxed text-sm space-y-4 whitespace-pre-line">
                            {aboutText}
                        </div>
                    </section>

                    {/* Condition Treated */}
                    <section>
                        <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
                            <Stethoscope className="w-5 h-5 text-zinc-400" /> Condition Treated
                        </h2>
                        <div className="border-t border-zinc-100 pt-4">
                            <ul className="space-y-3">
                                {conditions.map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-zinc-600">
                                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    {/* Fellowship */}
                    <section>
                        <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
                            <GraduationCap className="w-5 h-5 text-zinc-400" /> Fellowship and Accreditation
                        </h2>
                        <div className="border-t border-zinc-100 pt-4">
                            <ul className="space-y-3">
                                {fellowships.map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-zinc-600">
                                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-2 shrink-0"></span>
                                        <span className="leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    {/* FAQ */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-6">Frequently Asked Question</h2>
                        <div className="space-y-4 border-t border-zinc-100 pt-4">
                            {faqs.map((q, i) => (
                                <div key={i} className="border-b border-zinc-100 pb-4">
                                    <button 
                                        onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                                        className="flex items-center justify-between w-full text-left focus:outline-none group"
                                    >
                                        <span className="font-medium text-sm text-[#1C1C1C]">{q}</span>
                                        {openFaqIndex === i ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                                    </button>
                                    {openFaqIndex === i && (
                                        <div className="mt-3 text-sm text-zinc-500 leading-relaxed pr-8 animate-in slide-in-from-top-1">
                                            Absolutely. Medifly AI assists you through every step of your medical journey — from finding the right hospital and doctor to estimating costs, planning your stay, and arranging travel details.
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                </div>

                {/* Right Sidebar */}
                <div className="lg:col-span-4 space-y-8">
                    
                    {/* Hospital Widget */}
                    <div className="border border-zinc-200 rounded-xl bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-2 font-semibold text-[#1C1C1C] mb-6">
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
                                <h3 className="font-semibold text-sm text-[#1C1C1C]">{doctor.hospitalName}</h3>
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

                        <button 
                            onClick={() => onNavigateToHospital(doctor.hospitalId)}
                            className="w-full py-2.5 border border-zinc-200 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
                        >
                            View Hospital
                        </button>
                    </div>

                    {/* Schedule Widget */}
                    <div className="border border-zinc-200 rounded-xl bg-white overflow-hidden shadow-sm">
                        <div className="p-6 pb-4">
                            <div className="flex items-center gap-2 font-semibold text-[#1C1C1C]">
                                <div className="p-1.5 bg-zinc-100 rounded-md"><Calendar className="w-4 h-4" /></div> Schedule
                            </div>
                        </div>
                        
                        <div className="text-sm">
                            <div className="grid grid-cols-2 bg-[#FAF8F7] font-medium p-3 border-y border-zinc-100">
                                <div className="pl-3">Day</div>
                                <div>Clinic Hour</div>
                            </div>
                            {schedule.map((slot, i) => (
                                <div key={i} className={`grid grid-cols-2 p-3 border-b border-zinc-50 last:border-0 ${i % 2 === 0 ? 'bg-[#FDFDE8]' : 'bg-white'}`}>
                                    <div className="pl-3 text-[#1C1C1C]">{slot.day}</div>
                                    <div className="text-zinc-600">{slot.time}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* More Doctors */}
            <div className="mt-20 border-t border-zinc-100 pt-16">
                <h2 className="text-3xl font-medium text-center mb-12">More Doctors That Match Your Needs</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {relatedDoctors.length > 0 ? relatedDoctors.map(doc => (
                        <DoctorCard key={doc.id} doctor={doc} onViewDetails={onViewDoctor} />
                    )) : (
                        <div className="col-span-full text-center text-zinc-400 py-8">No other doctors found in this category.</div>
                    )}
                </div>
                <div className="flex justify-center mt-12">
                    <button className="bg-[#1C1C1C] text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-black transition-colors">
                        View More
                    </button>
                </div>
            </div>

        </div>
    </div>
  );
};