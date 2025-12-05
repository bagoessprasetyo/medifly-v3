import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft, ChevronDown, ChevronUp, Star, ShieldCheck, FileCheck,
    Plane, HeartPulse, Stethoscope, Activity, Microscope, BrainCircuit,
    Droplet, Building2, Calendar, ArrowRight, UserCheck, MapPin,
    BriefcaseMedical, Search
} from 'lucide-react';
import { Hospital, Doctor, MedicalPackage } from '../types';
import { HOSPITALS, DOCTORS, PACKAGES, COUNTRIES } from '../constants';
import { HospitalCard } from './HospitalCard';
import { DoctorCard } from './DoctorCard';

interface CountryPageProps {
    countryName: string;
    onBack: () => void;
    onNavigateToHospital: (hospital: Hospital) => void;
    onNavigateToDoctor: (doctor: Doctor) => void;
    onNavigateToPackage: (pkg: MedicalPackage) => void;
}

export const CountryPage: React.FC<CountryPageProps> = ({
    countryName,
    onBack,
    onNavigateToHospital,
    onNavigateToDoctor,
    onNavigateToPackage
}) => {
    const [activeHospitalSpec, setActiveHospitalSpec] = useState('Pulmonology');
    const [activeDoctorSpec, setActiveDoctorSpec] = useState('Pulmonology');
    const [activePackageSpec, setActivePackageSpec] = useState('Pulmonology');
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const countryData = COUNTRIES.find(c => c.name === countryName) || COUNTRIES[0];

    // Filter Data
    const filteredHospitals = HOSPITALS.filter(h => h.country === countryName);
    const filteredDoctors = DOCTORS.filter(d => d.hospitalCountry === countryName);
    const filteredPackages = PACKAGES.filter(p => p.location.includes(countryName));

    // Specialization Filters
    const specs = [
        { name: 'Pulmonology', icon: Activity },
        { name: 'Cardiology', icon: HeartPulse },
        { name: 'Oncology', icon: Microscope },
        { name: 'Neurology', icon: BrainCircuit },
        { name: 'Hematology', icon: Droplet },
    ];

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            {/* Hero Section */}
            <div className="relative h-[320px] w-full overflow-hidden">
                <img
                    src={countryData.image}
                    alt={countryName}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent"></div>
                <div className="absolute inset-0 flex flex-col justify-end pl-24 pr-6 pb-12">
                    <button
                        onClick={onBack}
                        className="mb-4 flex items-center gap-1.5 text-white/80 hover:text-white transition-colors text-xs font-medium w-fit"
                    >
                        <ChevronLeft className="w-3.5 h-3.5" /> Back to Explore
                    </button>
                    <h1 className="text-3xl md:text-4xl font-semibold text-white mb-3 tracking-tight">{countryName}</h1>
                    <p className="text-white/80 max-w-xl text-sm leading-relaxed">
                        {countryData.desc}
                        {' '}Experience world-class healthcare combined with rich cultural heritage.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="pl-24 pr-20 py-16 space-y-20">

                {/* Popular Hospitals */}
                <section>
                    <h2 className="text-2xl font-medium mb-1 text-[#1C1C1C]">Popular Hospital in {countryName}</h2>
                    <p className="text-gray-500 text-sm mb-6">Top-rated medical centers recognized for excellence in patient care.</p>

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap gap-2.5 mb-6">
                        {specs.map((spec) => (
                            <button
                                key={spec.name}
                                onClick={() => setActiveHospitalSpec(spec.name)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all
                                ${activeHospitalSpec === spec.name
                                        ? 'bg-[#F9FFA1] text-[#1C1C1C] border border-[#E8EE8A]'
                                        : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}
                            >
                                <spec.icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                                {spec.name}
                            </button>
                        ))}
                        <button className="flex items-center justify-center w-9 h-9 rounded-full bg-[#F9FFA1] text-[#1C1C1C] border border-[#E8EE8A]">
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {filteredHospitals.slice(0, 4).map((hospital) => (
                            <HospitalCard
                                key={hospital.id}
                                hospital={hospital}
                                onViewDetails={onNavigateToHospital}
                            />
                        ))}
                        {filteredHospitals.length === 0 && (
                            <div className="col-span-full text-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                No hospitals found in {countryName}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-center mt-8">
                        <button className="px-6 py-2.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-[#1C1C1C] hover:bg-gray-50 transition-colors">
                            View All Hospitals
                        </button>
                    </div>
                </section>

                {/* Doctors Section */}
                <section>
                    <h2 className="text-2xl font-medium mb-1 text-[#1C1C1C]">Doctors in {countryName}</h2>
                    <p className="text-gray-500 text-sm mb-6">Meet board-certified specialists with international expertise.</p>

                    <div className="flex flex-wrap gap-2.5 mb-6">
                        {specs.map((spec) => (
                            <button
                                key={spec.name}
                                onClick={() => setActiveDoctorSpec(spec.name)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all
                                ${activeDoctorSpec === spec.name
                                        ? 'bg-[#F9FFA1] text-[#1C1C1C] border border-[#E8EE8A]'
                                        : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}
                            >
                                <spec.icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                                {spec.name}
                            </button>
                        ))}
                        <button className="flex items-center justify-center w-9 h-9 rounded-full bg-[#F9FFA1] text-[#1C1C1C] border border-[#E8EE8A]">
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {filteredDoctors.slice(0, 4).map((doctor) => (
                            <DoctorCard
                                key={doctor.id}
                                doctor={doctor}
                                onViewDetails={onNavigateToDoctor}
                            />
                        ))}
                        {filteredDoctors.length === 0 && (
                            <div className="col-span-full text-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                No doctors found in {countryName}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-center mt-8">
                        <button className="px-6 py-2.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-[#1C1C1C] hover:bg-gray-50 transition-colors">
                            View All Doctors
                        </button>
                    </div>
                </section>

                {/* Packages Section */}
                <section>
                    <h2 className="text-2xl font-medium mb-1 text-[#1C1C1C]">Explore Medical Packages in {countryName}</h2>
                    <p className="text-gray-500 text-sm mb-6">Comprehensive care bundles tailored to your health needs.</p>

                    <div className="flex flex-wrap gap-2.5 mb-6">
                        {specs.map((spec) => (
                            <button
                                key={spec.name}
                                onClick={() => setActivePackageSpec(spec.name)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all
                                ${activePackageSpec === spec.name
                                        ? 'bg-[#F9FFA1] text-[#1C1C1C] border border-[#E8EE8A]'
                                        : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}
                            >
                                <spec.icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                                {spec.name}
                            </button>
                        ))}
                        <button className="flex items-center justify-center w-9 h-9 rounded-full bg-[#F9FFA1] text-[#1C1C1C] border border-[#E8EE8A]">
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {filteredPackages.slice(0, 4).map((pkg, i) => (
                            <div
                                key={pkg.id || i}
                                className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300 flex flex-col h-full group cursor-pointer"
                                onClick={() => onNavigateToPackage(pkg)}
                            >
                                <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                                    <img
                                        src={pkg.imageUrl || `https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400`}
                                        alt={pkg.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-4 flex flex-col flex-1">
                                    <h3 className="text-sm font-medium text-[#1C1C1C] mb-1 line-clamp-2 min-h-[2.5rem]">{pkg.title}</h3>
                                    <p className="text-[10px] text-gray-500 mb-2">{pkg.category}</p>
                                    <div className="flex items-center gap-1.5 mb-3">
                                        <div className="w-4 h-4 rounded-full bg-[#F1FCA7] flex items-center justify-center shrink-0">
                                            <Building2 className="w-2.5 h-2.5 text-[#1C1C1C]" />
                                        </div>
                                        <span className="text-[10px] text-gray-500 truncate">{pkg.hospitalName}</span>
                                    </div>
                                    <p className="text-xs font-medium text-[#1C1C1C] mb-4">{pkg.price}</p>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onNavigateToPackage(pkg);
                                        }}
                                        className="w-full py-2 hover:bg-black hover:text-white rounded-lg border border-gray-200 text-[10px] font-medium text-[#1C1C1C] transition-colors mt-auto"
                                    >
                                        Overview
                                    </button>
                                </div>
                            </div>
                        ))}
                        {filteredPackages.length === 0 && (
                            <div className="col-span-full text-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                No packages found in {countryName}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-center mt-8">
                        <button className="px-6 py-2.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-[#1C1C1C] hover:bg-gray-50 transition-colors">
                            View All Packages
                        </button>
                    </div>
                </section>

                {/* Travel Advice */}
                <section>
                    <h2 className="text-2xl font-medium mb-8 text-center text-[#1C1C1C]">Travel Advice</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { title: "Show up for your hospital", icon: Star },
                            { title: "Protect Medical Records", icon: ShieldCheck },
                            { title: "Plan Your Stay & Visa", icon: MapPin },
                            { title: "Stay Healthy & Follow-ups", icon: HeartPulse },
                        ].map((item, i) => (
                            <div key={i} className="bg-[#FAF8F7] p-5 rounded-xl flex flex-col items-center text-center hover:shadow-sm transition-all cursor-pointer group">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm group-hover:scale-105 transition-transform">
                                    <item.icon className="w-4 h-4 text-[#1C1C1C]" strokeWidth={1.5} />
                                </div>
                                <h3 className="font-medium text-slate-900 text-xs">{item.title}</h3>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Expert Guidance - Full Width */}
            <section className="bg-[#1C1C1C] py-16">
                <div className="pl-24 pr-20">
                    <h2 className="text-2xl font-medium mb-2 text-white max-w-xl leading-snug">Expertly guided access to the world's most reputable hospitals and specialists.</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mt-10">
                        {[
                            { title: "Smart Guidance", desc: "Our AI-driven platform matches you with the best hospitals based on your medical needs.", icon: UserCheck },
                            { title: "Curated Hospitals", desc: "We partner only with accredited, world-class medical centers to ensure quality care.", icon: Building2 },
                            { title: "Vetting for Your Condition", desc: "Specialists are vetted for their expertise in treating your specific condition.", icon: Search },
                            { title: "Stress-Free Planning", desc: "From appointments to travel arrangements, we handle the logistics for you.", icon: Plane },
                        ].map((item, i) => (
                            <div key={i}>
                                <div className="mb-3">
                                    <item.icon className="w-5 h-5 text-white" strokeWidth={1.5} />
                                </div>
                                <h3 className="font-medium text-white mb-1.5 text-sm">{item.title}</h3>
                                <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="pl-24 pr-20 py-16">
                <h2 className="text-2xl font-medium mb-6 text-[#1C1C1C]">Frequently Asked Questions</h2>
                <div className="max-w-3xl space-y-3">
                    {[
                        "What support does this hospital provide for international patients?",
                        "How can Medifly.Ai help me?",
                        "Does this hospital provide virtual consultations before traveling?",
                        "How do I schedule an appointment or treatment?",
                        "How much do treatments cost?",
                        "Can my insurance cover my treatment in this hospital?"
                    ].map((q, i) => (
                        <div key={i} className="border-b border-gray-100 pb-3">
                            <button
                                onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                                className="flex items-center justify-between w-full text-left focus:outline-none group py-1"
                            >
                                <span className={`text-sm font-medium ${openFaqIndex === i ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900'}`}>{q}</span>
                                {openFaqIndex === i ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                            </button>
                            <AnimatePresence>
                                {openFaqIndex === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <p className="text-xs text-gray-500 leading-relaxed pr-8 pt-2 pb-1">
                                            Absolutely. Medifly AI assists you through every step of your medical journey — from finding the right hospital and doctor to estimating costs, planning your stay, and arranging travel details. We make medical trips simpler, smarter, and stress-free.
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};
