
import React, { useState, useEffect, useRef } from 'react';
import {
    Search, MapPin, Globe, Sparkles, ArrowRight, X, Navigation,
    Package, BadgeCheck, ShieldCheck, Smartphone, MessageSquare,
    FileText, Plus, Video, Paperclip, Database, Activity, Stethoscope, Loader2
} from 'lucide-react';
import { useTranslation } from '../contexts/TranslationContext';
import { motion } from 'framer-motion';

interface HeroProps {
    onQuickSearch: (query: string, origin?: string, location?: { lat: number; lng: number }) => void;
    onNavigateToMarketplace?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onQuickSearch }) => {
    const { t } = useTranslation();
    // Desktop State
    const [treatment, setTreatment] = useState('');
    const [origin, setOrigin] = useState('Jakarta');
    const [destination, setDestination] = useState('Anywhere');
    const [isSearching, setIsSearching] = useState(false);

    // Animation State
    const [stats, setStats] = useState({ hospitals: 0, doctors: 0, countries: 0 });
    const [loadingPhase, setLoadingPhase] = useState(0); // 0: Start, 1: Scanning, 2: Found

    // Scroll Container Ref
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Mobile Modal State
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | undefined>(undefined);

    // Auto-scroll logic
    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) return;

        let intervalId: ReturnType<typeof setInterval>;
        let isPaused = false;

        const startAutoScroll = () => {
            intervalId = setInterval(() => {
                if (isPaused) return;

                // Calculate dynamic width based on first child + gap
                const firstCard = scrollContainer.firstElementChild as HTMLElement;
                if (!firstCard) return;

                // gap-4 is 16px
                const scrollAmount = firstCard.offsetWidth + 16;
                const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;

                if (scrollContainer.scrollLeft >= maxScroll - 10) {
                    // Reset to start
                    scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                }
            }, 3000); // Scroll every 3 seconds
        };

        const stopAutoScroll = () => {
            isPaused = true;
        };

        const resumeAutoScroll = () => {
            isPaused = false;
        };

        startAutoScroll();

        // Pause on interaction
        scrollContainer.addEventListener('mouseenter', stopAutoScroll);
        scrollContainer.addEventListener('mouseleave', resumeAutoScroll);
        scrollContainer.addEventListener('touchstart', stopAutoScroll);

        // Cleanup
        return () => {
            clearInterval(intervalId);
            if (scrollContainer) {
                scrollContainer.removeEventListener('mouseenter', stopAutoScroll);
                scrollContainer.removeEventListener('mouseleave', resumeAutoScroll);
                scrollContainer.removeEventListener('touchstart', stopAutoScroll);
            }
        };
    }, []);

    // Database Scan Animation Effect
    useEffect(() => {
        if (!isSearching) {
            setStats({ hospitals: 0, doctors: 0, countries: 0 });
            setLoadingPhase(0);
            return;
        }

        // Phase 1: Rapid Counting
        const duration = 2000;
        const frameRate = 1000 / 60;
        const totalFrames = duration / frameRate;

        const targetHospitals = 3500;
        const targetDoctors = 24000;
        const targetCountries = 115;

        let frame = 0;
        const counterInterval = setInterval(() => {
            frame++;
            const progress = Math.min(frame / totalFrames, 1);
            // Ease out quart
            const ease = 1 - Math.pow(1 - progress, 4);

            setStats({
                hospitals: Math.floor(targetHospitals * ease),
                doctors: Math.floor(targetDoctors * ease),
                countries: Math.floor(targetCountries * ease)
            });

            if (frame >= totalFrames) clearInterval(counterInterval);
        }, frameRate);

        // Phase Transitions
        const phase1Timer = setTimeout(() => setLoadingPhase(1), 500);
        const phase2Timer = setTimeout(() => setLoadingPhase(2), 2000);

        return () => {
            clearInterval(counterInterval);
            clearTimeout(phase1Timer);
            clearTimeout(phase2Timer);
        };
    }, [isSearching]);

    const handleUseLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        setIsLoadingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const coords = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                setUserCoords(coords);
                setOrigin("Current Location");
                setIsLoadingLocation(false);
            },
            (error) => {
                console.error("Geolocation error:", error);
                setIsLoadingLocation(false);
            },
            { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
        );
    };

    const handleSubmit = () => {
        if (treatment.trim()) {
            setIsSearching(true);

            // Wait for animation to play out (2.5 seconds)
            setTimeout(() => {
                const parts = [];
                parts.push(`I am looking for ${treatment}`);
                if (destination && destination !== 'Anywhere') parts.push(`in ${destination}`);
                if (origin && origin !== 'Anywhere') parts.push(`traveling from ${origin}`);

                onQuickSearch(parts.join(' '), origin, userCoords);
                // We don't reset isSearching here because the component will likely unmount or navigation will happen
                // But if we stayed on page, we would: setIsSearching(false);
            }, 2500);
        }
    };

    return (
        <div className="relative bg-[#FCFCFA] min-h-[85vh] overflow-x-hidden selection:bg-lime-100 font-sans text-slate-900 flex flex-col">

            {/* Global Search Animation Overlay */}
            {isSearching && (
                <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center animate-in fade-in duration-300">
                    <div className="relative w-full max-w-lg p-8 flex flex-col items-center">

                        {/* Animated Icons / Graphics */}
                        <div className="relative mb-8">
                            <div className="w-24 h-24 rounded-full border-4 border-slate-100 flex items-center justify-center relative">
                                <div className="absolute inset-0 border-4 border-[#E4F28A] rounded-full border-t-transparent animate-spin"></div>
                                <Globe className="w-10 h-10 text-[#E4F28A]" strokeWidth={2} />
                            </div>
                            {/* Orbiting Icons */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full animate-bounce delay-100">
                                <div className="bg-white p-2 rounded-lg shadow-lg border border-slate-100 mb-2">
                                    <Database className="w-5 h-5 text-emerald-500" />
                                </div>
                            </div>
                        </div>

                        <h2 className="text-2xl font-medium text-slate-900 mb-2 text-center tracking-tight">
                            {loadingPhase === 0 && t("Accessing Global Database...")}
                            {loadingPhase === 1 && t("Analyzing Medical Network...")}
                            {loadingPhase === 2 && t("Matches Found")}
                        </h2>
                        <p className="text-slate-500 text-sm mb-10 text-center animate-pulse">
                            {t('Scanning verified JCI-accredited facilities tailored to')} "{treatment}"
                        </p>

                        {/* Counters Grid */}
                        <div className="grid grid-cols-3 gap-4 w-full mb-8">
                            <div className="flex flex-col items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <BuildingIcon className="w-6 h-6 text-slate-400 mb-2" />
                                <span className="text-xl font-bold text-slate-900 tabular-nums">{stats.hospitals.toLocaleString()}</span>
                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{t('Hospitals')}</span>
                            </div>
                            <div className="flex flex-col items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <Stethoscope className="w-6 h-6 text-slate-400 mb-2" />
                                <span className="text-xl font-bold text-slate-900 tabular-nums">{stats.doctors.toLocaleString()}+</span>
                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{t('Specialists')}</span>
                            </div>
                            <div className="flex flex-col items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <MapPin className="w-6 h-6 text-slate-400 mb-2" />
                                <span className="text-xl font-bold text-slate-900 tabular-nums">{stats.countries}</span>
                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{t('Countries')}</span>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-64 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-[#E4F28A] rounded-full animate-[loading_2s_ease-in-out_forwards] w-full origin-left"></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Subtle Grid Background */}
            <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0"></div>

            {/* Decorative Curve Line (SVG) */}
            {/* <div className="absolute top-[100px] left-0 w-full h-[400px] pointer-events-none z-0 opacity-60 hidden md:block">
            <svg width="100%" height="100%" viewBox="0 0 1440 400" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <path d="M-100 350 C 200 350, 400 100, 800 150 C 1200 200, 1400 50, 1600 50" stroke="#EADBC8" strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke"/>
            </svg>
        </div> */}

            {/* Top Feature Banner */}


            {/* Main Content */}
            <main className="relative z-10 max-w-[1400px] mx-auto px-4 pt-6 md:pt-10 pb-12 flex flex-col items-center w-full">

                {/* Hero Text */}
                <div className="text-center max-w-4xl mx-auto mb-8 md:mb-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight text-slate-900 mb-4 leading-[1.1]"
                    >
                        {t('Access world-class healthcare beyond borders.')}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                        className="text-base md:text-xl text-[#867676] font-normal max-w-2xl mx-auto leading-relaxed"
                    >
                        {t('Compare hospitals, connect with specialists, and plan treatment abroad with AI.')}
                    </motion.p>
                </div>

                {/* Cards Scroll Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    className="w-full relative mb-8 group/cards"
                >
                    {/* Fade masks for scroll */}
                    <div className="absolute left-0 top-0 bottom-0 w-8 md:w-24 bg-gradient-to-r from-[#FCFCFA] to-transparent z-20 pointer-events-none"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-8 md:w-24 bg-gradient-to-l from-[#FCFCFA] to-transparent z-20 pointer-events-none"></div>

                    <div
                        ref={scrollContainerRef}
                        className="flex overflow-x-auto gap-4 px-4 md:px-24 pb-4 pt-2 no-scrollbar snap-x snap-mandatory cursor-grab active:cursor-grabbing scroll-smooth"
                    >

                        {/* Card 1 */}
                        <div
                            onMouseEnter={() => setTreatment(t("Hospitals in Malaysia covered by my insurance?"))}
                            onMouseLeave={() => setTreatment('')}
                            className="min-w-[240px] md:min-w-[280px]  h-[200px] md:h-[240px] bg-[#F2F2F2] rounded-2xl p-4 md:p-5 flex flex-col justify-between shrink-0 snap-center snap-always hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-slate-200 cursor-pointer"
                        >
                            <div>
                                <span className="text-[10px] font-medium text-slate-500 mb-2 block uppercase tracking-wide">{t('Ask AI')}</span>
                                <h3 className="text-sm md:text-base font-medium text-slate-800 leading-snug mb-3">“{t('Hospitals in Malaysia covered by my insurance?')}”</h3>
                                <img src="/images/hero-1.svg" alt="Hospital Search Illustration" className="w-full h-16 object-contain mb-2" />
                            </div>
                            <p className="text-[10px] md:text-xs text-[#867676] leading-relaxed">{t('Compare accredited hospitals that match your policy instantly.')}</p>
                        </div>

                        {/* Card 2 */}
                        <div
                            onMouseEnter={() => setTreatment(t("What surgery options do I have for an ACL tear?"))}
                            onMouseLeave={() => setTreatment('')}
                            className="min-w-[240px] md:min-w-[280px] h-[200px] md:h-[240px] bg-[#F2F2F2] rounded-2xl p-4 md:p-5 flex flex-col justify-between shrink-0 snap-center snap-always hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-slate-200 cursor-pointer"
                        >
                            <div>
                                <span className="text-[10px] font-medium text-slate-500 mb-2 block uppercase tracking-wide">{t('Ask AI')}</span>
                                <h3 className="text-sm md:text-base font-medium text-slate-800 leading-snug mb-3">“{t('What surgery options do I have for an ACL tear?')}”</h3>

                                <img src="/images/hero-4.svg" alt="Hospital Search Illustration" className="w-full h-16 object-contain mb-2" />
                            </div>
                            <p className="text-[10px] md:text-xs text-[#867676] leading-relaxed">{t('See surgical types, cost ranges, and recovery timelines.')}</p>
                        </div>

                        {/* Card 3 */}
                        <div
                            onMouseEnter={() => setTreatment(t("Show me the top 10 wellness centers in Bali."))}
                            onMouseLeave={() => setTreatment('')}
                            className="min-w-[240px] md:min-w-[280px] h-[200px] md:h-[240px] bg-[#F2F2F2] rounded-2xl p-4 md:p-5 flex flex-col justify-between shrink-0 snap-center snap-always hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-slate-200 cursor-pointer"
                        >
                            <div>
                                <span className="text-[10px] font-medium text-slate-500 mb-2 block uppercase tracking-wide">{t('Ask AI')}</span>
                                <h3 className="text-sm md:text-base font-medium text-slate-800 leading-snug mb-3">“{t('Show me the top 10 wellness centers in Bali.')}”</h3>
                                <img src="/images/hero-2.svg" alt="Hospital Search Illustration" className="w-full h-16 object-contain mb-2" />
                            </div>
                            <p className="text-[10px] md:text-xs text-[#867676] leading-relaxed">{t('See wellness packages, ratings and reviews.')}</p>
                        </div>

                        {/* Card 4 */}
                        <div
                            onMouseEnter={() => setTreatment(t("Top 5 Medical checkup packages in Singapore?"))}
                            onMouseLeave={() => setTreatment('')}
                            className="min-w-[240px] md:min-w-[280px] h-[200px] md:h-[240px] bg-[#F2F2F2] rounded-2xl p-4 md:p-5 flex flex-col justify-between shrink-0 snap-center snap-always hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-slate-200 cursor-pointer"
                        >
                            <div>
                                <span className="text-[10px] font-medium text-slate-500 mb-2 block uppercase tracking-wide">{t('Ask AI')}</span>
                                <h3 className="text-sm md:text-base font-medium text-slate-800 leading-snug mb-3">“{t('Top 5 Medical checkup packages in Singapore?')}”</h3>
                                {/* Abstract List Visual */}
                                <img src="/images/hero-5.svg" alt="Hospital Search Illustration" className="w-full h-16 object-contain mb-2" />
                            </div>
                            <p className="text-[10px] md:text-xs text-[#867676] leading-relaxed">{t('Compare screening packages and book directly with hospitals.')}</p>
                        </div>

                        {/* Card 5 */}
                        <div
                            onMouseEnter={() => setTreatment(t("Can I talk to a doctor before planning my trip?"))}
                            onMouseLeave={() => setTreatment('')}
                            className="min-w-[240px] md:min-w-[280px] h-[200px] md:h-[240px] bg-[#F2F2F2] rounded-2xl p-4 md:p-5 flex flex-col justify-between shrink-0 snap-center snap-always hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-slate-200 cursor-pointer"
                        >
                            <div>
                                <span className="text-[10px] font-medium text-slate-500 mb-2 block uppercase tracking-wide">{t('Ask AI')}</span>
                                <h3 className="text-sm md:text-base font-medium text-slate-800 leading-snug mb-3">“{t('Can I talk to a doctor before planning my trip?')}”</h3>
                                <img src="/images/hero-3.svg" alt="Hospital Search Illustration" className="w-full h-16 object-contain mb-2" />
                            </div>
                            <p className="text-[10px] md:text-xs text-[#867676] leading-relaxed">{t('Connect directly with hospital doctors.')}</p>
                        </div>

                        {/* Card 6 */}
                        <div
                            onMouseEnter={() => setTreatment(t("Compare IVF prices in Thailand VS Singapore"))}
                            onMouseLeave={() => setTreatment('')}
                            className="min-w-[240px] md:min-w-[280px] h-[200px] md:h-[240px] bg-[#F2F2F2] rounded-2xl p-4 md:p-5 flex flex-col justify-between shrink-0 snap-center snap-always hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-slate-200 cursor-pointer"
                        >
                            <div>
                                <span className="text-[10px] font-medium text-slate-500 mb-2 block uppercase tracking-wide">{t('Ask AI')}</span>
                                <h3 className="text-sm md:text-base font-medium text-slate-800 leading-snug mb-3">“{t('Compare IVF prices in Thailand VS Singapore')}”</h3>
                                <img src="/images/hero-6.svg" alt="Hospital Search Illustration" className="w-full h-16 object-contain mb-2" />
                            </div>
                            <p className="text-[10px] md:text-xs text-[#867676] leading-relaxed">{t('Compare prices directly across borders.')}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Search / Input Section */}
                <div className="w-full max-w-3xl px-4 relative z-30">
                    <div className="bg-white rounded-[26px] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] border border-slate-100 p-2.5 md:p-3">

                        {/* Input Area */}
                        <div className="flex items-start gap-3 px-2 py-1">
                            <Search className="w-5 h-5 text-slate-400 mt-2 shrink-0" />
                            <div className="w-full">
                                <input
                                    type="text"
                                    placeholder={t('Describe your health issue...')}
                                    className="w-full text-base md:text-lg text-slate-800 placeholder-slate-300 outline-none bg-transparent font-medium mb-0.5"
                                    value={treatment}
                                    onChange={(e) => setTreatment(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                                />
                                <p className="text-slate-400 text-xs md:text-sm font-normal italic">{t('E.g. Cheapest Medical Checkups in Malaysia')}</p>
                            </div>
                        </div>

                        {/* Controls & Button */}
                        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mt-3">

                            {/* Pills */}
                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    onClick={() => { if (origin === 'Jakarta') setOrigin(''); else handleUseLocation(); }}
                                    className="flex items-center gap-2 bg-[#F9FAFB] hover:bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 transition-colors group"
                                >
                                    <MapPin className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
                                    <span className="text-slate-500 text-xs font-medium">{t('From:')}</span>
                                    {isLoadingLocation ? (
                                        <span className="text-slate-400 text-xs italic">{t('Locating...')}</span>
                                    ) : (
                                        <input
                                            value={origin}
                                            onChange={(e) => setOrigin(e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                            className="bg-transparent border-none p-0 w-20 text-xs font-medium text-slate-800 focus:ring-0"
                                            placeholder={t('City')}
                                        />
                                    )}
                                </button>

                                <button className="flex items-center gap-2 bg-[#F9FAFB] hover:bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 transition-colors group">
                                    <Globe className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
                                    <span className="text-slate-500 text-xs font-medium">{t('To:')}</span>
                                    <input
                                        value={destination}
                                        onChange={(e) => setDestination(e.target.value)}
                                        className="bg-transparent border-none p-0 w-20 text-xs font-medium text-slate-800 focus:ring-0"
                                        placeholder={t('Anywhere')}
                                    />
                                </button>

                                <button className="flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors text-slate-500 hover:text-slate-800">
                                    <Paperclip className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            {/* Generate Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={isSearching}
                                className="bg-[#D9F850] hover:bg-[#cdf034] text-slate-900 text-sm font-medium px-5 py-2 rounded-xl shadow-[0_2px_10px_rgba(217,248,80,0.4)] transition-all flex items-center justify-center gap-2 active:scale-95 active:shadow-none disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSearching ? t('Processing...') : t('Generate')}
                                {!isSearching && <Sparkles className="w-3.5 h-3.5" />}
                            </button>
                        </div>
                    </div>
                </div>

            </main>

            {/* Simple Helper Icon Component for the Animation */}
            <style>{`
            @keyframes loading {
                0% { transform: scaleX(0); }
                50% { transform: scaleX(0.7); }
                100% { transform: scaleX(1); }
            }
        `}</style>
        </div>
    );
};

// Simple icon wrapper for the stats
const BuildingIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="16" height="20" x="4" y="2" rx="2" ry="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M8 10h.01" /><path d="M16 10h.01" /><path d="M8 14h.01" /><path d="M16 14h.01" /></svg>
);
