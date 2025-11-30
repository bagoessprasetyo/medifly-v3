
import React, { useState } from 'react';
import { Menu, X, Plane, ArrowRight, Compass } from 'lucide-react';
// import { LanguageSelector } from './ui/LanguageSelector';

interface NavbarProps {
  onNavigateToHome: () => void;
  onNavigateToMarketplace: () => void;
  onNavigateToDoctors: () => void;
  onNavigateToPackages?: () => void;
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
  onStartTour?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onNavigateToHome, 
  onNavigateToMarketplace, 
  onNavigateToDoctors,
  onNavigateToPackages,
  selectedLanguage,
  onLanguageChange,
  onStartTour
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileNav = (action: () => void) => {
    action();
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 h-20 w-full transition-all">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          
          {/* Logo Section */}
          <div className="flex items-center gap-2 group cursor-pointer" onClick={onNavigateToHome}>
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-teal-600/20 group-hover:scale-105 transition-transform duration-300">
                <Plane className="w-4 h-4 rotate-[-45deg]" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-semibold tracking-tight text-slate-900">Medifly</span>
          </div>

          {/* Desktop Center Nav */}
          <div className="hidden md:flex items-center gap-8">
             <button 
                onClick={onNavigateToHome}
                className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
             >
                How it works
             </button>
             <button 
                onClick={onNavigateToMarketplace}
                className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
             >
                Hospitals
             </button>
             <button 
                onClick={onNavigateToDoctors}
                className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
             >
                Doctors
             </button>
             <button 
                onClick={onNavigateToPackages}
                className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
             >
                Packages
             </button>
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
             {onStartTour && (
                 <button 
                    onClick={onStartTour}
                    className="text-sm font-medium text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5"
                 >
                    <Compass className="w-4 h-4" /> Tour
                 </button>
             )}
             {/* <div className="hidden lg:block">
                  <LanguageSelector selectedLanguage={selectedLanguage} onLanguageChange={onLanguageChange} />
             </div> */}
             <button className="text-sm font-medium bg-slate-900 text-white px-5 py-2.5 rounded-full hover:bg-slate-800 transition-colors shadow-sm hover:shadow-md">
                Sign in
             </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-4">
             <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 -mr-2 text-slate-900 z-50 relative"
             >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
             </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
            <div className="fixed inset-0 bg-white z-40 md:hidden flex flex-col pt-24 px-6 animate-in slide-in-from-top-10 duration-200">
                <div className="space-y-6">
                    <button 
                        onClick={() => handleMobileNav(onNavigateToMarketplace)}
                        className="flex items-center justify-between w-full text-lg font-semibold text-slate-900 border-b border-slate-100 pb-4"
                    >
                        <span>Hospitals</span>
                        <ArrowRight className="w-5 h-5 text-slate-300" />
                    </button>
                    <button 
                        onClick={() => handleMobileNav(onNavigateToDoctors)}
                        className="flex items-center justify-between w-full text-lg font-semibold text-slate-900 border-b border-slate-100 pb-4"
                    >
                        <span>Doctors</span>
                        <ArrowRight className="w-5 h-5 text-slate-300" />
                    </button>
                    <button 
                        onClick={() => handleMobileNav(onNavigateToPackages || (() => {}))}
                        className="flex items-center justify-between w-full text-lg font-semibold text-slate-900 border-b border-slate-100 pb-4"
                    >
                        <span>Packages</span>
                        <ArrowRight className="w-5 h-5 text-slate-300" />
                    </button>
                    {onStartTour && (
                        <button 
                            onClick={() => handleMobileNav(onStartTour)}
                            className="flex items-center justify-between w-full text-lg font-semibold text-indigo-600 border-b border-indigo-100 pb-4"
                        >
                            <span className="flex items-center gap-2"><Compass className="w-5 h-5" /> Take Tour</span>
                            <ArrowRight className="w-5 h-5 text-indigo-300" />
                        </button>
                    )}
                </div>

                <div className="mt-8 space-y-4">
                    {/* <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-500">Language</span>
                        <LanguageSelector selectedLanguage={selectedLanguage} onLanguageChange={onLanguageChange} />
                    </div> */}
                    <button className="w-full bg-slate-900 text-white text-base font-semibold py-4 rounded-xl hover:bg-black transition shadow-sm mt-4">
                        Sign in
                    </button>
                </div>
            </div>
        )}
    </nav>
  );
};
