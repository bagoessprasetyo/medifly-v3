import React, { useEffect, useState, useMemo } from 'react';
import {
    Activity, Building2, Stethoscope, Package, Users, MapPin, Languages,
    Award, Bed, Trophy, ChevronDown, ChevronRight, Navigation, Plane,
    Bus, Flag, Wind, Heart, Link, Brain, Droplet, HeartPulse, Bone, Dna,
    BrainCircuit, Baby, Utensils, Eye, Ear, ChevronUp, Star, LayoutGrid,
    CheckCircle2, ArrowLeft, ArrowRight, Microscope, Filter, Clock, ChevronLeft,
    GraduationCap, Scan, CheckCircle, Scissors, Sparkles, Bot, MessageSquare,
    Crown, Globe, Target, Car, Mountain, BriefcaseMedical, Smile, Stethoscope as StethIcon,
    ShieldCheck, FileCheck, Loader2, BookOpen, Calendar
} from 'lucide-react';
import { Hospital, Doctor, MedicalPackage } from '../types';
import { HOSPITALS, DOCTORS, PACKAGES } from '../constants';
import { generateLocationInfo, LocationInfo } from '../services/geminiService';
import { HealthPotential } from './HealthPotential';
import { InquiryFormModal } from './ui/InquiryFormModal';
import GettingHere from './GettingHere';

interface HospitalPageProps {
    hospital: Hospital;
    onBack: () => void;
    onNavigateToHospitals: () => void;
    onNavigateToDoctors: () => void;
    onNavigateToPackages?: () => void;
    onNavigateToPackage?: (pkg: MedicalPackage) => void;
    onViewGallery: () => void;
    onViewFacilities: () => void;
    onAskAria: (query: string) => void;
    onViewSpecialization?: (spec: string) => void;
    onNavigateToHospital?: (hospital: Hospital) => void;
    onNavigateToDoctor?: (doctor: Doctor) => void;
    onNavigateToInsights?: () => void;
    onNavigateToFacilityDetails?: (facilityName: string) => void;
    isChatOpen?: boolean;
}

export const HospitalPage: React.FC<HospitalPageProps> = ({
    hospital,
    onBack,
    onNavigateToHospitals,
    onNavigateToDoctors,
    onNavigateToPackages,
    onNavigateToPackage,
    onViewGallery,
    onViewFacilities,
    onAskAria,
    onViewSpecialization,
    onNavigateToHospital,
    onNavigateToDoctor,
    onNavigateToInsights,
    onNavigateToFacilityDetails,
    isChatOpen = false
}) => {

    const [activeTab, setActiveTab] = useState('overview');
    const [showAllAwards, setShowAllAwards] = useState(false);
    const [selectedSpecialistFilter, setSelectedSpecialistFilter] = useState('All Doctors');
    const [isScrolled, setIsScrolled] = useState(false);
    const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);
    const [isLoadingLocation, setIsLoadingLocation] = useState(true);
    const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);

    // Scroll to top on mount
    useEffect(() => {
        const scrollContainer = document.getElementById('main-content-area');
        if (scrollContainer) {
            scrollContainer.scrollTo(0, 0);
        } else {
            window.scrollTo(0, 0);
        }
    }, [hospital.id]);

    // Fetch AI-generated location info
    useEffect(() => {
        const fetchLocationInfo = async () => {
            setIsLoadingLocation(true);
            try {
                const info = await generateLocationInfo(
                    hospital.name,
                    hospital.location,
                    hospital.country,
                    hospital.coordinates,
                    'Jakarta, Indonesia' // Default user origin - could be made dynamic from user settings
                );
                setLocationInfo(info);
            } catch (error) {
                console.error('Failed to fetch location info:', error);
            } finally {
                setIsLoadingLocation(false);
            }
        };

        fetchLocationInfo();
    }, [hospital.id, hospital.name, hospital.location, hospital.country, hospital.coordinates]);

    // Scroll Spy Logic and Sticky Header
    useEffect(() => {
        const handleScrollSpy = () => {
            const mainContainer = document.getElementById('main-content-area');
            if (!mainContainer) return;

            // Detect if scrolled past the hero section (approx 500px) to show sticky header
            // We use a slightly lower threshold to trigger the transition earlier
            setIsScrolled(mainContainer.scrollTop > 450);

            const headerOffset = 180;
            const scrollPosition = mainContainer.scrollTop + headerOffset;

            const sections = ['overview', 'specialization', 'doctors', 'facilities', 'packages'];

            for (const sectionId of sections) {
                const element = document.getElementById(sectionId);
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveTab(sectionId);
                        break;
                    }
                }
            }
        };

        const mainContainer = document.getElementById('main-content-area');
        if (mainContainer) {
            mainContainer.addEventListener('scroll', handleScrollSpy);
            handleScrollSpy();
        }

        return () => {
            if (mainContainer) {
                mainContainer.removeEventListener('scroll', handleScrollSpy);
            }
        };
    }, []);

    const scrollToSection = (id: string) => {
        // Handle external navigation for Insights tab
        if (id === 'insights') {
            onNavigateToInsights?.();
            return;
        }

        setActiveTab(id);
        const element = document.getElementById(id);
        // Navbar (80px) + Sticky Header (72px) + visual breathing room (~30px)
        const offset = 180;

        if (element) {
            const mainContainer = document.getElementById('main-content-area');
            if (mainContainer) {
                const elementTop = element.offsetTop;
                mainContainer.scrollTo({
                    top: elementTop - offset,
                    behavior: 'smooth'
                });
            }
        }
    };

    const relatedHospitals = useMemo(() => {
        return HOSPITALS.filter(h => h.id !== hospital.id && h.country === hospital.country).slice(0, 4);
    }, [hospital]);

    // Explore More Hospitals Logic
    const exploreMoreHospitals = useMemo(() => {
        return HOSPITALS.filter(h => {
            if (h.id === hospital.id) return false;
            if (h.country === hospital.country) return false;

            const priceMatch = h.priceRange === hospital.priceRange ||
                (h.priceRange.length >= 2 && hospital.priceRange.length >= 2);

            const specialtyOverlap = h.specialties.some(s => hospital.specialties.includes(s));

            const isHighVolume = hospital.reviewCount > 1000;
            const targetHighVolume = h.reviewCount > 1000;
            const volumeMatch = isHighVolume === targetHighVolume;

            return priceMatch && specialtyOverlap && volumeMatch;
        })
            .sort((a, b) => b.reviewCount - a.reviewCount)
            .slice(0, 4);
    }, [hospital]);

    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(2);

    const getImages = (count: number) => {
        const sourceImages = hospital.images || [];
        const imgs = sourceImages.length > 0 ? [...sourceImages] : [hospital.imageUrl];
        while (imgs.length < count) {
            imgs.push(imgs[0] || hospital.imageUrl || 'https://via.placeholder.com/800x600');
        }
        return imgs.slice(0, count);
    };

    const galleryImages = getImages(5);

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'specialization', label: 'Specialization' },
        { id: 'doctors', label: 'Doctors' },
        { id: 'facilities', label: 'Facilities' },
        { id: 'packages', label: 'Packages' },
        { id: 'insights', label: 'Insights', isExternal: true }
    ];

    // Awards Data
    const awardsList = [
        { year: "2019", title: "Asian Hospital Management Awards 2019", org: "Gold Award (Customer Service Category)" },
        { year: "2019", title: "Asia Pacific Society of Infection Control", org: "CSSD Centre of Excellence Award" },
        { year: "2023", title: "Best Medical Tourism Hospital", org: "APAC Healthcare Awards" },
        { year: "2023", title: "Smart Hospital Initiative of the Year", org: "Healthcare Asia" },
        { year: "2022", title: "Patient Care Excellence Award", org: "Global Health Asia" },
        { year: "2021", title: "Gold Seal of Approval®", org: "Joint Commission International (JCI)" },
    ];

    const visibleAwards = showAllAwards ? awardsList : awardsList.slice(0, 6);

    // Filter configuration for Doctors section
    const specialistFilters = [
        { label: "All Doctors", icon: Users },
        { label: "Cardiology", icon: HeartPulse },
        { label: "Orthopedics", icon: Bone },
        { label: "Oncology", icon: Microscope },
        { label: "Neurology", icon: Brain },
        { label: "Fertility & IVF", icon: Baby },
        { label: "Gastroenterology", icon: StethIcon },
        { label: "Internal Medicine", icon: Activity },
        { label: "ENT", icon: Ear },
        { label: "Dermatology", icon: Scan },
        { label: "Aesthetics", icon: Sparkles },
        { label: "Dental Care", icon: Smile },
        { label: "General Surgery", icon: Scissors },
    ];

    // Get doctors relevant to this hospital
    const relevantDoctors = useMemo(() => {
        return DOCTORS.filter(d => d.hospitalId === hospital.id || d.hospitalName === hospital.name);
    }, [hospital]);

    // Filter doctors based on selection
    const filteredDoctors = useMemo(() => {
        if (selectedSpecialistFilter === 'All Doctors') {
            return relevantDoctors;
        }
        return relevantDoctors.filter(d => d.specialty.includes(selectedSpecialistFilter) || selectedSpecialistFilter.includes(d.specialty));
    }, [relevantDoctors, selectedSpecialistFilter]);

    const scrollDoctors = useMemo(() => {
        if (filteredDoctors.length === 0) return [];
        if (filteredDoctors.length < 5) {
            return [...filteredDoctors, ...filteredDoctors, ...filteredDoctors];
        }
        return [...filteredDoctors, ...filteredDoctors];
    }, [filteredDoctors]);

    const insurancePartners = [
        { name: 'AIA', domain: 'aia.com' },
        { name: 'Allianz', domain: 'allianz.com' },
        { name: 'Prudential', domain: 'prudential.com' },
        { name: 'Great Eastern', domain: 'greateasternlife.com' },
        { name: 'Cigna', domain: 'cigna.com' },
        { name: 'AXA', domain: 'axa.com' },
        { name: 'Manulife', domain: 'manulife.com' },
        { name: 'Tokio Marine', domain: 'tokiomarine.com' },
    ];

    // Get country flag
    const getCountryFlag = () => {
        if (locationInfo?.countryFlag) return locationInfo.countryFlag;
        return hospital.country === 'Thailand' ? '🇹🇭' :
            hospital.country === 'Singapore' ? '🇸🇬' :
                hospital.country === 'Malaysia' ? '🇲🇾' :
                    hospital.country === 'Indonesia' ? '🇮🇩' : '🏳️';
    };

    return (
        <div className="bg-white text-[#1C1C1C] font-sans antialiased w-full min-h-full pb-12 overflow-x-hidden">
            <style>{`@keyframes scroll-horizontal { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } } .animate-scroll-horizontal { animation: scroll-horizontal 40s linear infinite; } .animate-scroll-horizontal:hover { animation-play-state: paused; }`}</style>

            {/* Mobile Back Button */}
            <div className="md:hidden sticky top-0 z-[50] bg-white/90 backdrop-blur-sm border-b border-[#FAF8F7] px-6 h-16 flex items-center">
                <button onClick={onBack} className="p-1 hover:bg-zinc-100 rounded-full transition-colors flex items-center gap-2">
                    <ArrowLeft className="w-5 h-5 text-[#1C1C1C]" />
                    <span className="font-semibold text-[#1C1C1C]">Back</span>
                </button>
            </div>

            {/* Desktop Breadcrumb */}
            <div className="max-w-7xl mx-auto px-6 pt-6 hidden md:block">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <button onClick={onBack} className="hover:text-slate-900 transition-colors flex items-center gap-1">
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <span className="text-slate-300">|</span>
                    <span className="cursor-pointer hover:text-slate-900 transition-colors" onClick={onNavigateToHospitals}>Hospitals</span>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                    <span className="font-medium text-slate-900">{hospital.name}</span>
                </div>
            </div>

            {/* Hero Gallery - Traveloka Style */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 pt-4 pb-6">
                {/* Breadcrumb-style info bar */}


                {/* Gallery Grid */}
                <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[280px] md:h-[420px] rounded-xl overflow-hidden">
                    {/* Main large image - spans 2 columns and 2 rows */}
                    <div className="col-span-2 row-span-2 relative cursor-pointer group" onClick={onViewGallery}>
                        <img src={galleryImages[0]} alt={hospital.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>

                    {/* Top right images - 2 images */}
                    <div className="relative cursor-pointer group" onClick={onViewGallery}>
                        <img src={galleryImages[1]} alt={`${hospital.name} room`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <div className="relative cursor-pointer group" onClick={onViewGallery}>
                        <img src={galleryImages[2]} alt={`${hospital.name} facility`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>

                    {/* Bottom right images - 2 images, last one with "See All Photos" */}
                    <div className="relative cursor-pointer group" onClick={onViewGallery}>
                        <img src={galleryImages[3]} alt={`${hospital.name} exterior`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <div className="relative cursor-pointer group" onClick={onViewGallery}>
                        <img src={galleryImages[4]} alt={`${hospital.name} area`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        {/* See All Photos overlay */}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-100 group-hover:bg-black/50 transition-all">
                            <button
                                onClick={(e) => { e.stopPropagation(); onViewGallery(); }}
                                className="flex items-center gap-2 text-white text-sm font-medium"
                            >
                                <LayoutGrid className="w-4 h-4" /> See All Photos
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hospital Info Header - Below Gallery */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 ">
                <div className="flex flex-col items-end md:flex-row md:justify-between gap-4">
                    <div className="flex-1">
                        <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">{hospital.name}</h1>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 py-2 text-xs font-semibold text-slate-800">
                            <div className="flex items-center gap-1.5"><img src="/images/icons/vip-support.svg" className="w-4 h-4" /> VIP Patient Support</div>
                            <div className="flex items-center gap-1.5"><img src="/images/icons/easy-airport-access.svg" className="w-4 h-4" /> Easy Airport Access</div>
                            <div className="flex items-center gap-1.5"><img src="/images/icons/popular.svg" className="w-4 h-4" /> Popular with Foreigners</div>
                        </div>
                        {/* <div className="flex flex-wrap items-center gap-2 text-sm"> */}
                        {/* <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-medium text-xs">Hospital</span>
                            <div className="flex items-center gap-1">
                                {[...Array(Math.floor(hospital.rating))].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                ))}
                                {hospital.rating % 1 !== 0 && <Star className="w-4 h-4 fill-amber-400/50 text-amber-400" />}
                            </div> */}
                        {/* {hospital.accreditation && hospital.accreditation.length > 0 && (
                                <span className="flex items-center gap-1 text-sky-600 text-sm">
                                    <CheckCircle className="w-4 h-4" /> Preferred Partner
                                </span>
                            )} */}
                        {/* <span className="flex items-center gap-1 text-slate-600 text-sm">
                                <ShieldCheck className="w-4 h-4 text-sky-500" /> {hospital.accreditation?.[0] || 'Accredited'}
                            </span> */}
                        {/* </div> */}
                    </div>

                    {/* Price and CTA */}
                    <div className="flex flex-row items-end space-x-3 shrink-0">
                        <div className="text-right ">
                            <p className="text-xs text-slate-500">Price range</p>
                            <p className="text-xl md:text-2xl font-medium text-[#1E293B]">{hospital.priceRange}</p>
                        </div>
                        <button
                            onClick={() => setIsInquiryModalOpen(true)}
                            className="bg-black text-white px-6 py-3 rounded-lg font-semibold text-sm transition-all "
                        >
                            Book a Consultation
                        </button>
                    </div>
                </div>
            </div>

            {/* Fixed Info Header - Shows on scroll, positioned below navbar, hidden when chat is open */}
            <div
                className={`fixed top-20 left-0 right-0 z-[45] bg-white/95 backdrop-blur-md border-b transition-all duration-300 hidden md:block
        ${isChatOpen ? '!hidden' : ''}
        ${isScrolled ? 'border-gray-200 shadow-sm translate-y-0 opacity-100' : 'border-transparent -translate-y-full opacity-0 pointer-events-none'}`}
            >
                <div className="max-w-7xl mx-auto px-6 h-[56px] relative flex items-center justify-center">
                    <div className="absolute left-6 flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full overflow-hidden border border-gray-200 shadow-sm flex items-center justify-center bg-gray-50 text-base">
                            {getCountryFlag()}
                        </div>
                        <span className="font-semibold text-slate-900 line-clamp-1 max-w-[180px] text-sm">{hospital.name}</span>
                    </div>
                    <div className="flex items-center gap-6 h-full">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => scrollToSection(tab.id)}
                                className={`
                            h-full flex items-center text-sm font-medium border-b-2 transition-all px-1
                            ${activeTab === tab.id ? 'border-[#1C1C1C] text-[#1C1C1C]' : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-200'}
                        `}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    <div className="absolute right-6">
                        <button
                            onClick={() => setIsInquiryModalOpen(true)}
                            className="bg-[#1C1C1C] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-black transition-all shadow-sm shadow-slate-200 flex items-center gap-2 active:scale-95"
                        >
                            Book a Consultation
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Split - ID: overview */}
            <div id="overview" className="max-w-7xl mx-auto px-4 md:px-6 py-2 grid grid-cols-1 lg:grid-cols-3 gap-12 scroll-mt-20">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Key features */}


                    <div>
                        <span className="inline-flex items-center gap-2 bg-[#F1FCA7] px-3 py-1.5 rounded text-xs font-semibold text-slate-900">
                            <Languages className="w-3.5 h-3.5" />
                            Language Support: {hospital.languages?.join(', ') || "English, Melayu, Mandarin, Hokkien, Cantonese"}
                        </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6 p-5 bg-[#FAFAFA] rounded-xl border border-slate-100">
                        <div className="flex gap-3 items-center">
                            <img src="/images/jci.svg" alt="JCI" className="w-10 h-10 rounded-full" />
                            <div><div className="font-medium text-slate-900 text-sm">JCI Accredited</div><div className="text-xs text-slate-500">International healthcare standards</div></div>
                        </div>
                        <div className="flex gap-3 items-center">
                            <img src="/images/accme.svg" alt="ACCME" className="w-10 h-10 rounded-full" />
                            <div><div className="font-medium text-slate-900 text-sm">ACCME-Accredited</div><div className="text-xs text-slate-500">Committed in medical education</div></div>
                        </div>
                    </div>

                    <div className="text-slate-600 text-sm leading-relaxed space-y-4">
                        <p>{hospital.description}</p>
                        <p>{hospital.name} is a JCI and MSQH accredited facility and will remain one of the leading medical centres that cater to the growing number of local population in Penang, Northern region and neighbouring countries.</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-2 gap-y-6 gap-x-12 border-y border-slate-100 py-8">
                        <div className="flex items-center gap-3"><Stethoscope className="w-5 h-5 text-slate-900" strokeWidth={1.5} /><div className="font-semibold text-[#1C1C1C] text-sm">170 specialists</div></div>
                        <div className="flex items-center gap-3"><Building2 className="w-5 h-5 text-slate-900" strokeWidth={1.5} /><div className="font-semibold text-[#1C1C1C] text-sm">{hospital.specialties.length} Specialties</div></div>
                        <div className="flex items-center gap-3"><Bed className="w-5 h-5 text-slate-900" strokeWidth={1.5} /><div className="font-semibold text-[#1C1C1C] text-sm">380 beds</div></div>
                        <div className="flex items-center gap-3"><Users className="w-5 h-5 text-slate-900" strokeWidth={1.5} /><div className="font-semibold text-[#1C1C1C] text-sm">333K+ patients annually</div></div>
                    </div>

                    {/* Awards */}
                    <div className="space-y-4">
                        <h3 className="font-medium text-lg flex items-center gap-2 text-slate-900"><Trophy className="w-5 h-5" /> Awards & Accreditations</h3>
                        <div className="space-y-4 pl-2">
                            {visibleAwards.map((award, i) => (
                                <div key={i} className="flex gap-4 text-sm animate-in fade-in slide-in-from-top-1 duration-300">
                                    <span className="font-medium text-[#1C1C1C] w-12 shrink-0">{award.year}</span>
                                    <div className="flex-1 h-px bg-slate-200 my-auto max-w-[20px] hidden sm:block"></div>
                                    <span className="text-slate-600"><span className="underline decoration-slate-300 underline-offset-4 font-medium text-slate-800">{award.title}</span> — {award.org}</span>
                                </div>
                            ))}
                            <button onClick={() => setShowAllAwards(!showAllAwards)} className="text-slate-600 text-xs font-semibold flex items-center gap-1 border border-slate-200 px-4 py-2 rounded-lg mt-2 hover:bg-slate-50 transition-colors w-fit">
                                {showAllAwards ? 'View Less' : 'View More'} <ChevronDown className={`w-3 h-3 transition-transform ${showAllAwards ? 'rotate-180' : ''}`} />
                            </button>
                        </div>
                    </div>

                    {/* Insurance Support Section - Enhanced */}
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mt-8">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium text-lg flex items-center gap-2 text-slate-900">
                                <ShieldCheck className="w-5 h-5 text-emerald-600" /> Insurance Partners
                            </h3>
                            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-medium px-2 py-1 rounded uppercase tracking-wider">Direct Billing</span>
                        </div>

                        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                            {hospital.name} accepts direct billing from major international insurance providers. We handle the paperwork so you can focus on recovery.
                        </p>

                        <div className="grid grid-cols-4 gap-3 mb-6">
                            {insurancePartners.map((partner, i) => (
                                <div key={i} className="aspect-[3/2] bg-white rounded-lg border border-slate-100 flex items-center justify-center p-3 shadow-sm hover:shadow-md transition-all group cursor-pointer" title={partner.name}>
                                    <img
                                        src={`https://logo.clearbit.com/${partner.domain}`}
                                        alt={partner.name}
                                        className="max-w-full max-h-full object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            if (e.currentTarget.parentElement) {
                                                e.currentTarget.parentElement.innerText = partner.name;
                                                e.currentTarget.parentElement.classList.add('text-[10px]', 'font-medium', 'text-slate-400', 'text-center');
                                            }
                                        }}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-4 border-t border-slate-200/60">
                            <div className="flex gap-4 text-xs font-medium text-slate-600">
                                <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Cashless Admission</div>
                                <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Claims Assistance</div>
                            </div>
                            <button
                                onClick={() => onAskAria(`Check insurance coverage for ${hospital.name}. I have [Your Insurance Name].`)}
                                className="text-xs font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900 hover:text-black transition-all flex items-center gap-1"
                            >
                                <FileCheck className="w-3.5 h-3.5" /> Verify Coverage
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Concierge Widget */}
                    <div className="border border-slate-200 bg-gradient-to-br mt-10 from-white to-slate-50 rounded-xl p-6 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity"><Bot className="w-24 h-24 text-slate-900" /></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-2 bg-[#1C1C1C] rounded-lg text-[#F1FCA7] shadow-lg shadow-slate-200"><Sparkles className="w-4 h-4" /></div>
                                <div><h3 className="font-medium text-gray-900 text-sm">Hospital Concierge</h3><p className="text-[10px] text-slate-500 font-medium">Powered by Aria AI</p></div>
                            </div>
                            <p className="text-xs text-slate-600 mb-4 leading-relaxed">I can analyze <strong>{hospital.name}</strong>'s pricing, insurance coverage, and specialist availability instantly.</p>
                            <div className="grid grid-cols-2 gap-2 mb-4">
                                {["Pricing", "Insurance", "Doctors", "Booking"].map((item, i) => (
                                    <button key={i} onClick={() => onAskAria(`Tell me about ${item.toLowerCase()} at ${hospital.name}`)} className="text-xs font-medium bg-white border border-slate-200 text-slate-700 py-2 px-3 rounded-lg hover:border-slate-900 hover:text-slate-900 transition-all text-left hover:shadow-sm">
                                        {item === "Pricing" ? "💰" : item === "Insurance" ? "🛡️" : item === "Doctors" ? "👨‍⚕️" : "📅"} {item}
                                    </button>
                                ))}
                            </div>
                            <button onClick={() => onAskAria(`I have general questions about ${hospital.name}`)} className="w-full bg-white border border-slate-200 text-slate-400 text-xs py-3 px-4 rounded-xl text-left flex justify-between items-center hover:border-slate-900 hover:text-slate-600 transition-colors shadow-sm group/input"><span>Ask anything...</span><div className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center group-hover/input:bg-[#1C1C1C] transition-colors"><ArrowRight className="w-3 h-3 text-slate-400 group-hover/input:text-[#F1FCA7] transition-colors" /></div></button>
                        </div>
                    </div>

                    {/* Getting Here - Advanced Multi-Modal */}
                    <GettingHere
                        locationInfo={locationInfo}
                        isLoading={isLoadingLocation}
                        hospitalName={hospital.name}
                    />

                    {/* Around the Area - Dynamic */}
                    <div className="border border-zinc-200 rounded-xl p-6 shadow-sm bg-white">
                        <div className="flex items-center gap-2 font-medium text-[#1C1C1C] mb-4">
                            <div className="p-1.5 bg-slate-100 rounded-full"><Scan className="w-4 h-4" /></div>
                            Around the Area
                        </div>
                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${hospital.coordinates.lat},${hospital.coordinates.lng}&query_place_id=${encodeURIComponent(hospital.name)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 mb-5 cursor-pointer hover:opacity-80 transition-opacity"
                        >
                            <MapPin className="w-4 h-4 text-slate-500" />
                            <span className="font-semibold text-slate-900 text-sm">Map</span>
                            <span className="text-[10px] text-slate-400 ml-auto">Open in Google Maps</span>
                        </a>
                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${hospital.coordinates.lat},${hospital.coordinates.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full h-44 bg-slate-100 rounded-xl mb-5 overflow-hidden relative border border-slate-200 group cursor-pointer"
                        >
                            {/* Using OpenStreetMap static tiles with marker overlay */}
                            <div className="relative w-full h-full">
                                <iframe
                                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${hospital.coordinates.lng - 0.008},${hospital.coordinates.lat - 0.005},${hospital.coordinates.lng + 0.008},${hospital.coordinates.lat + 0.005}&layer=mapnik&marker=${hospital.coordinates.lat},${hospital.coordinates.lng}`}
                                    className="w-full h-full border-0 pointer-events-none"
                                    title={`Map showing ${hospital.name} location`}
                                />
                                {/* Overlay to capture clicks */}
                                <div className="absolute inset-0 bg-transparent group-hover:bg-black/5 transition-colors duration-300" />
                            </div>
                            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                                <div className="bg-white/95 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-medium text-slate-900 shadow-sm border border-slate-200 flex items-center gap-1.5">
                                    <MapPin className="w-3 h-3 text-[#1C1C1C]" />
                                    {hospital.name}
                                </div>
                                <div className="bg-[#1C1C1C] text-white px-3 py-1.5 rounded-lg text-xs font-medium shadow-sm flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <Navigation className="w-3 h-3" />
                                    Get Directions
                                </div>
                            </div>
                        </a>

                        {/* Address */}
                        <div className="flex gap-3 mb-6 text-xs text-slate-600 items-start leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <div className="w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                                <span className="text-[10px]">{getCountryFlag()}</span>
                            </div>
                            {isLoadingLocation ? (
                                <div className="animate-pulse bg-slate-200 rounded w-full h-4"></div>
                            ) : (
                                <p>{locationInfo?.address || `${hospital.location}, ${hospital.country}`}</p>
                            )}
                        </div>

                        {/* Location Details */}
                        {isLoadingLocation ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                                <span className="ml-2 text-xs text-slate-500">Loading location info...</span>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                {/* Arrival Airport (near hospital) */}
                                {locationInfo?.nearbyAirport && (
                                    <div>
                                        <div className="flex items-center gap-2 text-sm font-medium text-[#1C1C1C] mb-2">
                                            <Plane className="w-4 h-4 text-slate-400" /> Arrival Airport
                                        </div>
                                        <ul className="pl-8 space-y-2 text-xs text-slate-600 list-disc marker:text-slate-300">
                                            <li>{locationInfo.nearbyAirport.name} | {locationInfo.nearbyAirport.distance}</li>
                                        </ul>
                                    </div>
                                )}

                                {/* Transportations */}
                                {locationInfo?.transportations && locationInfo.transportations.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2 text-sm font-medium text-[#1C1C1C] mb-2">
                                            <Bus className="w-4 h-4 text-slate-400" /> Transportations
                                        </div>
                                        <ul className="pl-8 space-y-2 text-xs text-slate-600 list-disc marker:text-slate-300">
                                            {locationInfo.transportations.map((transport, idx) => (
                                                <li key={idx}>{transport.name} | {transport.distance}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Landmarks */}
                                {locationInfo?.landmarks && locationInfo.landmarks.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2 text-sm font-medium text-[#1C1C1C] mb-2">
                                            <Flag className="w-4 h-4 text-slate-400" /> Landmarks
                                        </div>
                                        <ul className="pl-8 space-y-2 text-xs text-slate-600 list-disc marker:text-slate-300">
                                            {locationInfo.landmarks.map((landmark, idx) => (
                                                <li key={idx}>{landmark.name} | {landmark.distance}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 1. Top Expertise */}
            <section id="specialization" className=" mx-auto px-24 py-16 scroll-mt-40 bg-[#FAF8F7]">
                <h2 className="text-3xl font-medium text-center tracking-tight mb-12">Our Top Expertise</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {[
                        { icon: HeartPulse, title: "Cardiology", desc: "Full-spectrum cardiovascular care with expert cardiologists, from prevention to advanced treatment options." },
                        { icon: Microscope, title: "Oncology", desc: "Comprehensive care for brain, spine, and nervous system disorders by expert neurologists." },
                        { icon: BrainCircuit, title: "Neurology", desc: "Comprehensive care for brain, spine, and nervous system disorders by expert neurologists." },
                        { icon: Wind, title: "Gastroenterology & Hepatology", desc: "Specialized care for liver and digestive diseases with advanced diagnostics and global-standard treatments." },
                        { icon: Droplet, title: "Orthopedic", desc: "Expert orthopedic care for bones, joints, and injuries, ensuring fast, effective recovery." },
                        // { icon: Droplet, title: "Pediatric", desc: "State-of-the-art care, diagnosis and concerns for blood-related issues." },
                    ].map((item, idx) => (
                        <div key={idx} className="group p-6 rounded-xl border border-gray-100 bg-white hover:shadow-lg hover:border-gray-200 transition-all duration-300 cursor-pointer" onClick={() => onViewSpecialization?.(item.title)}>
                            <div className="w-10 h-10 rounded-full bg-[#F9FFA1] flex items-center justify-center mb-4 text-lime-700"><item.icon strokeWidth={1.5} className="w-5 h-5" /></div>
                            <h3 className="text-lg font-medium mb-2 tracking-tight group-hover:text-[#1C1C1C] transition-colors">{item.title}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
                {/* <div className="mt-20 rounded-2xl ">
                    <h4 className="text-center text-2xl font-medium text-gray-900 mb-10">Other Specializations Available</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mx-auto">
                        {["Fertility & IVF", "Gastroenterology", "Internal Medicine", "Aesthetics", "Dermatology", "General Surgery", "Dental Care", "Diabetes & Chronic Diseases Care", "ENT"].map((spec, i) => (
                            <div key={i} onClick={() => onViewSpecialization?.(spec)} className="bg-white px-6 hover:bg-black hover:text-white py-4 rounded-lg border border-gray-100 text-sm font-medium text-gray-800 transition-all cursor-pointer flex justify-between items-center group">{spec}<ArrowRight className="w-4 h-4 text-white" /></div>
                        ))}
                    </div>
                </div> */}
            </section>

            {/* 2. Doctors Section */}
            <section id="doctors" className="max-w-full mx-auto px-6 py-16 scroll-mt-40 bg-white border-t border-gray-100 overflow-hidden">
                <div className="max-w-7xl mx-auto mb-12">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-slate-900">World-Class Care, Led by Top Specialists</h2>
                        </div>
                        <p className="text-slate-900 max-w-4xl text-md">
                            Access expert care from 50+ trusted specialists across multiple medical fields, all delivering global-standard treatment you can trust.
                        </p>
                    </div>
                    <div className="mt-8 flex flex-wrap gap-3">
                        {specialistFilters.map((filter, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedSpecialistFilter(filter.label)}
                                className={`
                            flex items-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-medium transition-all
                            ${selectedSpecialistFilter === filter.label
                                        ? 'bg-[#F4F0EE] border-slate-400 text-slate-900 ring-1 ring-slate-700'
                                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'}
                        `}
                            >
                                <filter.icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>
                {/* Infinite Scroll Carousel - only animates when "All Doctors" filter is active */}
                <div className={`w-full relative ${selectedSpecialistFilter === 'All Doctors' ? '' : 'max-w-7xl mx-auto'}`}>
                    <div className={`flex gap-6 ${selectedSpecialistFilter === 'All Doctors' ? 'w-max animate-scroll-horizontal hover:pause' : 'flex-wrap justify-center'}`}>
                        {scrollDoctors.map((doc, i) => (
                            <div key={i} className="w-[320px] flex-shrink-0 bg-white rounded-lg overflow-hidden hover:shadow-xl transition-all group border border-slate-200">
                                {/* Doctor Photo */}
                                <div className="h-[260px] bg-gradient-to-b from-slate-50 to-white relative overflow-hidden flex items-end justify-center">
                                    <img src={doc.imageUrl} alt={doc.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" />
                                </div>

                                <div className="p-6 flex flex-col">
                                    {/* Doctor Name */}
                                    <h3 className="text-xl font-medium text-slate-900 mb-2">{doc.name}</h3>

                                    {/* Hospital with Flag */}
                                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
                                        <span className="text-base">{getCountryFlag()}</span>
                                        <span className="truncate">{hospital.name}, {hospital.country}</span>
                                    </div>

                                    {/* Specialty */}
                                    <p className="text-base font-medium text-slate-900 mb-3">{doc.specialty}</p>

                                    {/* Subspecialties as Tags */}
                                    <div className="flex flex-wrap items-center gap-2 mb-4">
                                        {doc.procedures.slice(0, 3).map((proc, idx) => (
                                            <span key={idx} className="text-xs text-slate-600">
                                                {proc}
                                                {idx < Math.min(doc.procedures.length, 3) - 1 && <span className="ml-2 text-slate-300">•</span>}
                                            </span>
                                        ))}
                                        {doc.procedures.length > 3 && (
                                            <span className="inline-flex items-center justify-center bg-slate-100 text-xs font-medium text-slate-600 px-2 py-0.5 rounded-full">
                                                +{doc.procedures.length - 3}
                                            </span>
                                        )}
                                    </div>

                                    {/* Achievement Badge */}
                                    <div className="flex items-center gap-2 mb-4">
                                        <BriefcaseMedical className="w-4 h-4 text-slate-500" />
                                        <span className="text-sm text-slate-900">200+ robotic joint procedures</span>
                                    </div>

                                    {/* Languages */}
                                    <div className="flex items-center gap-2 text-sm text-slate-900 mb-6 pb-4 border-b border-slate-100">
                                        <Languages className="w-4 h-4 text-slate-500" />
                                        <span>{doc.languages?.join(', ') || 'English, Bahasa Indonesia'}</span>
                                    </div>

                                    {/* Overview Button */}
                                    <button
                                        onClick={() => onNavigateToDoctor?.(doc)}
                                        className="w-full py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all"
                                    >
                                        Overview
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* View All Button */}
                <div className="flex justify-center mt-10">
                    <button
                        onClick={onNavigateToDoctors}
                        className="bg-[#1C1C1C] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-black transition-all shadow-sm flex items-center gap-2 active:scale-95"
                    >
                        View All <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </section>

            {/* 3. Facilities */}
            <section id="facilities" className="max-w-7xl mx-auto px-6 py-16 bg-white scroll-mt-40 border-t border-gray-100">
                <h2 className="text-2xl font-medium text-center tracking-tight mb-12">Facilities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { title: "Medical & Treatment Centres", img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400", items: ["Accident & Emergency (A&E)", "Intensive Care Unit (ICU)", "Blood/Stem Cell Bio", "Cardiology Clinic"] },
                        { title: "Treatment Technology", img: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=400", items: ["Robotic Surgery System", "Varian TrueBeam Linear", "3T MRI Scan", "1024-Slice CT Scan"] },
                        { title: "Patient Care & Recovery", img: "https://images.unsplash.com/photo-1596541223130-5d31a73fb6c6?auto=format&fit=crop&q=80&w=400", items: ["Inpatient Rooms", "Maternity Rooms", "Paediatric Care Services", "Rehabilitation & Physio"] },
                        { title: "Amenities & Support Services", img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=400", items: ["Pharmacy", "Food & Beverage", "Laboratory Services", "Billing & Insurance"] }
                    ].map((fac, idx) => (
                        <div
                            key={idx}
                            className="cursor-pointer group"
                            onClick={onViewFacilities}
                        >
                            <div className="aspect-video rounded-lg overflow-hidden mb-4 bg-gray-100 relative">
                                <img src={fac.img} alt={fac.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <h3 className="text-md font-medium mb-3 ">{fac.title}</h3>
                            <ul className="space-y-2">
                                {fac.items.map((item, i) => (
                                    <li key={i} className="flex items-start text-sm text-slate-900">
                                        <CheckCircle className="w-3 h-3 text-gray-400 mr-2 mt-0.5" /> {item}
                                    </li>
                                ))}
                                <li className="flex items-start text-xs py-1 px-2 rounded-full w-fit border border-slate-200 text-slate-900 ml-5">+{Math.floor(Math.random() * 10) + 5} More</li>
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center mt-10">
                    <button onClick={onViewFacilities} className="border border-gray-200 bg-white text-slate-900 px-8 py-3 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors hover:bg-black hover:text-white shadow-sm hover:shadow-md">View All Facilities</button>
                </div>
            </section>

            {/* 4. Packages */}
            <section id="packages" className="w-full py-16 scroll-mt-40" style={{ backgroundColor: '#FAF8F7' }}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-[#1C1C1C] mb-4">Packages Available</h2>
                        <p className="text-sm text-slate-900 leading-relaxed">Discover our curated medical packages that combine expert care, advanced technology, and personalized attention</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {PACKAGES.slice(0, 8).map((pkg, i) => (
                            <div
                                key={pkg.id || i}
                                className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300 flex flex-col h-full group cursor-pointer"
                                onClick={() => onNavigateToPackage?.(pkg)}
                            >
                                <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                                    <img
                                        src={pkg.imageUrl || `https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400`}
                                        alt={pkg.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-5 flex flex-col flex-1">
                                    <h3 className="text-base font-medium text-[#1C1C1C] mb-1">{pkg.title}</h3>
                                    <p className="text-xs text-gray-500 mb-3">{pkg.category}</p>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-5 h-5 rounded-full bg-[#F1FCA7] flex items-center justify-center shrink-0">
                                            <Building2 className="w-3 h-3 text-[#1C1C1C]" />
                                        </div>
                                        <span className="text-xs text-gray-500 truncate">{pkg.hospitalName || hospital.name}</span>
                                    </div>
                                    <p className="text-sm font-medium text-[#1C1C1C] mb-5">{pkg.price}</p>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onNavigateToPackage?.(pkg);
                                        }}
                                        className="w-full py-2.5 hover:bg-black hover:text-white rounded-lg border border-gray-200 text-xs font-medium text-[#1C1C1C] hover:bg-gray-50 transition-colors mt-auto"
                                    >
                                        Overview
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center mt-12">
                        <button
                            onClick={onNavigateToPackages}
                            className="bg-[#1C1C1C] text-white px-8 py-3  rounded-lg font-medium text-sm hover:bg-black transition-colors shadow-lg shadow-black/10"
                        >
                            View More
                        </button>
                    </div>
                </div>
            </section>

            {/* 5. Experts */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="col-span-1 py-4">
                        <h2 className="text-3xl font-medium tracking-tight text-gray-900 mb-6 leading-tight">Backed by the country's leading health experts</h2>
                        <p className="text-base text-slate-900 leading-relaxed mb-6">
                            At {hospital.name}, our mission is to provide the best of clinical care. Top medical experts across disciplines are part of our extensive health network. With their broad range of achievements, clinical efficiency, and caring touch, rest assured, you are in the right hands.
                        </p>
                    </div>
                    <div className="col-span-1 lg:col-span-2 overflow-hidden relative">
                        <div id="experts-scroll" className="flex gap-6 overflow-x-auto no-scrollbar pb-6 scroll-smooth">
                            {[
                                { name: "Mark A. Erhart", role: "President Commissioner", desc: "Leading the hospital’s governance with extensive experience in healthcare facility management, guiding BIH toward its goal as a top medical tourism destination in Asia.", img: "/images/mark.png", uni: "University of Malaysia", exp: "15 Years" },
                                { name: "Dr. Dewi F. Fitriana, MPH", role: "President Director", desc: "Public-health leader with over a decade of hospital management experience, driving BIH’s mission for patient-centred, holistic care at international standards.", img: "https://www.hospitalmanagementasia.com/wp-content/uploads/2024/07/HMA24-Spk-Mod-Photos-8.png", uni: "University of Glasgow", exp: "20 Years" },
                                { name: "Dr. Noel Yeo, MBA, PBM", role: "Chief Commercial & Operations Officer", desc: "Former COO at major Singaporean healthcare groups, bringing strong operational and business leadership to ensure efficient, world-class service delivery at BIH.", img: "https://gov-web-sing.s3.ap-southeast-1.amazonaws.com/uploads/2019/03/WhatsApp-Image-2019-03-26-at-8.jpg", uni: "University of Malaya", exp: "MBA Healthcare" }
                            ].map((exec, i) => (
                                <div key={i} className="min-w-[280px] md:min-w-[320px]">
                                    <div className="h-48 overflow-hidden rounded-t-xl bg-gray-100">
                                        <img src={exec.img} className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-b-xl border-x border-b border-gray-100">
                                        <h3 className="font-medium text-slate-900">{exec.name}</h3>
                                        <p className="text-sm text-slate-900 mb-4">{exec.role}</p>
                                        <p className="text-sm text-slate-700 leading-relaxed mb-4 line-clamp-3">{exec.desc}</p>
                                        {/* <div className="flex flex-col gap-1 text-[14px] font-medium text-slate-900">
                                            <span className="flex items-center"><GraduationCap className="w-3 h-3 mr-1" /> {exec.uni}</span>
                                            <span className="flex items-center"><Award className="w-3 h-3 mr-1" /> {exec.exp}</span>
                                        </div> */}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Navigation Arrows */}
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => {
                                    const container = document.getElementById('experts-scroll');
                                    if (container) container.scrollBy({ left: -340, behavior: 'smooth' });
                                }}
                                className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => {
                                    const container = document.getElementById('experts-scroll');
                                    if (container) container.scrollBy({ left: 340, behavior: 'smooth' });
                                }}
                                className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. Expert Health Insights */}
            <section className="max-w-7xl mx-auto px-6 py-16 border-t border-gray-100">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-[#1C1C1C] mb-4">Expert Health Insights</h2>
                    <p className="text-sm text-slate-900 leading-relaxed">Learn about trusted insights, tips, and updates from our team of specialists.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        {
                            title: "Understanding Heart Health: Prevention Tips from Our Cardiologists",
                            category: "Cardiology",
                            date: "Nov 28, 2024",
                            readTime: "5 min read",
                            image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=400",
                            author: "Dr. Sarah Chen",
                            type: "Article"
                        },
                        {
                            title: "Advances in Robotic Surgery: What Patients Need to Know",
                            category: "Surgery",
                            date: "Nov 25, 2024",
                            readTime: "7 min read",
                            image: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?auto=format&fit=crop&q=80&w=400",
                            author: "Dr. Michael Tan",
                            type: "Research"
                        },
                        {
                            title: "Managing Diabetes: A Comprehensive Guide for International Patients",
                            category: "Endocrinology",
                            date: "Nov 20, 2024",
                            readTime: "6 min read",
                            image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400",
                            author: "Dr. Aminah Rahman",
                            type: "Article"
                        }
                    ].map((insight, i) => (
                        <div key={i} className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col h-full">
                            <div className="aspect-[16/10] bg-gray-100 relative overflow-hidden">
                                <img
                                    src={insight.image}
                                    alt={insight.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-3 left-3">
                                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${insight.type === 'Research'
                                        ? 'bg-purple-100 text-purple-700'
                                        : 'bg-emerald-100 text-emerald-700'
                                        }`}>
                                        {insight.type}
                                    </span>
                                </div>
                            </div>
                            <div className="p-5 flex flex-col flex-1">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-xs font-medium text-[#1C1C1C] bg-slate-100 px-2 py-0.5 rounded">{insight.category}</span>
                                    <span className="text-xs text-gray-400">•</span>
                                    <span className="text-xs text-slate-900">{insight.readTime}</span>
                                </div>
                                <h3 className="text-base font-medium text-[#1C1C1C] mb-3 line-clamp-2 leading-snug group-hover:text-slate-700 transition-colors">{insight.title}</h3>
                                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
                                            <Users className="w-3 h-3 text-slate-500" />
                                        </div>
                                        <span className="text-xs text-slate-900">{insight.author}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-slate-900">
                                        <Calendar className="w-3 h-3" />
                                        <span>{insight.date}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center mt-10">
                    <button
                        onClick={onNavigateToInsights}
                        className="border border-gray-200 bg-white text-slate-900 px-8 py-2 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors shadow-sm hover:shadow-md flex items-center gap-2"
                    >
                        <BookOpen className="w-4 h-4" /> View All Insights
                    </button>
                </div>
            </section>

            {/* 7. FAQ */}
            <section className="max-w-7xl mx-auto px-6 py-12 border-t border-gray-100">
                <h2 className="text-2xl font-semibold tracking-tight text-gray-900 mb-8">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {["What support does this hospital provide for international patients?", "How can Medifly.Ai help me?", "Does this hospital provide virtual consultations before traveling?", "How do I schedule an appointment or treatment?", "How much do treatments cost?", "Can my insurance cover my treatment in this hospital?"].map((q, i) => (
                        <div key={i} className="border-b border-gray-100 pb-4">
                            <button onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)} className="flex items-center justify-between w-full text-left focus:outline-none group">
                                <span className={`text-sm font-medium ${openFaqIndex === i ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900'}`}>{q}</span>
                                {openFaqIndex === i ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                            </button>
                            {openFaqIndex === i && (<div className="mt-3 animate-in slide-in-from-top-1 duration-200"><p className="text-sm text-gray-500 leading-relaxed pr-8">Absolutely. Medifly AI assists you through every step of your medical journey — from finding the right hospital and doctor to estimating costs, planning your stay, and arranging travel details. We make medical trips simpler, smarter, and stress-free.</p></div>)}
                        </div>
                    ))}
                </div>
            </section>

            {/* 7. Related Hospitals */}
            {/* <section className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-semibold text-center tracking-tight mb-12">Hospitals in the Area</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedHospitals.map((related, i) => (
                <div key={i} className="border border-gray-200 rounded-xl bg-white overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 group cursor-pointer" onClick={() => onNavigateToHospital?.(related)}>
                    <div className="h-40 bg-gray-200 relative">
                        <img src={related.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm">{related.rating} ★ ({related.reviewCount})</div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                        <h3 className="font-semibold text-sm mb-1 truncate">{related.name}</h3>
                        <p className="text-xs text-gray-500 mb-3 flex items-center"><MapPin className="w-3 h-3 mr-1" /> {related.location}, {related.country}</p>
                        {related.accreditation && related.accreditation.length > 0 && (
                            <div className="flex items-center gap-1 text-[10px] text-lime-600 bg-lime-50 px-2 py-1 rounded w-fit mb-3 border border-lime-100">
                                <CheckCircle className="w-3 h-3" /> {related.accreditation[0]} Accredited
                            </div>
                        )}
                        <p className="text-xs text-gray-400 line-clamp-2 mb-4">{related.description}</p>
                        <div className="mt-auto pt-3 border-t border-gray-100 flex gap-2 text-[10px] text-gray-500">
                            <span className="flex items-center"><Languages className="w-3 h-3 mr-1" /> English, Local</span>
                            <span className="flex items-center ml-auto"><Bed className="w-3 h-3 mr-1" /> 200+ Beds</span>
                        </div>
                        <button className="mt-4 w-full py-2 border border-gray-200 rounded text-xs font-medium hover:bg-gray-50 transition-colors">Hospital Overview</button>
                    </div>
                </div>
            ))}
        </div>
        <div className="flex justify-center mt-8">
            <button onClick={onNavigateToHospitals} className="border border-gray-200 bg-white text-slate-900 px-8 py-3 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors shadow-sm hover:shadow-md">Discover More Hospitals</button>
        </div>
      </section> */}

            {/* 8. Explore More Hospitals */}
            <section className="max-w-7xl mx-auto px-6 py-16 border-t border-gray-100">
                <h2 className="text-2xl font-medium text-center tracking-tight mb-12">Explore More Hospitals</h2>
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${isChatOpen ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}>
                    {exploreMoreHospitals.map((h, i) => (
                        <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group cursor-pointer flex flex-col h-full" onClick={() => onNavigateToHospital?.(h)}>
                            <div className="h-48 relative bg-gray-200 overflow-hidden">
                                <img src={h.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={h.name} />
                                <div className="absolute bottom-2 left-2 bg-[#1A1A1A]/90 backdrop-blur px-2 py-1 rounded flex items-center gap-1 text-white text-[10px]"><span className="font-medium">G</span><Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" /><span className="font-medium">{h.rating}/5</span><span className="text-gray-400">({h.reviewCount} reviews)</span></div>
                            </div>
                            <div className="p-4 flex flex-col flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-medium text-slate-900 text-base line-clamp-1 leading-tight" title={h.name}>{h.name}</h3>
                                    <span className="text-slate-900 text-sm font-medium flex shrink-0 ml-2"><span className="text-slate-900">{h.priceRange}</span><span className="opacity-30">{Array(Math.max(0, 3 - h.priceRange.length)).fill('$').join('')}</span></span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-slate-900 mb-3"><span>{h.country === 'Malaysia' ? '🇲🇾' : h.country === 'Singapore' ? '🇸🇬' : h.country === 'Thailand' ? '🇹🇭' : '🏳️'}</span><span className="truncate">{h.location}, {h.country}</span></div>
                                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-900 mb-4"><div className="w-5 h-5 rounded-full bg-[#E4F28A] flex items-center justify-center shrink-0"><Plane className="w-3 h-3 rotate-[-45deg]" /></div><span>Less than 3 hour Away</span></div>
                                <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-3 min-h-[3.5em]">Committed to patient-centered care, {h.name} ensures high-quality treatments tailored to individual needs.</p>
                                <div className="flex items-center gap-2 text-xs text-slate-900 mb-2"><Languages className="w-3.5 h-3.5 text-slate-400" /><span className="truncate">{h.languages?.slice(0, 3).join(', ') || 'English, Local'}</span></div>
                                <div className="flex items-center justify-between text-[12px] text-slate-900 mb-4 mt-auto pt-3"><div className="flex items-center gap-1.5"><Stethoscope className="w-3.5 h-3.5 text-slate-400" /> 170 specialists</div><div className="flex items-center gap-1.5"><BriefcaseMedical className="w-3.5 h-3.5 text-slate-400" /> {h.specialties.length}+ specialization</div></div>
                                <button className="w-full py-2.5 rounded-lg border border-gray-200 text-sm cursor-pointer hover:bg-black hover:text-white font-medium text-slate-900 hover:bg-slate-50 transition-colors">Learn More</button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center mt-8">
                    <button onClick={onNavigateToHospitals} className="border border-gray-200 bg-white text-slate-900 px-8 py-2 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors shadow-sm hover:bg-black hover:text-white hover:shadow-md">Discover More Hospitals</button>
                </div>
            </section>
            <HealthPotential />

            {/* Inquiry Form Modal */}
            <InquiryFormModal
                isOpen={isInquiryModalOpen}
                onClose={() => setIsInquiryModalOpen(false)}
                defaultProcedure={`Consultation at ${hospital.name}`}
            />
        </div>
    );
};
