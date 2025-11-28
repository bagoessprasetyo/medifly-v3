
import React, { useState } from 'react';
import { Building2, Stethoscope, Package, Users, Menu, X, ArrowRight } from 'lucide-react';
import { LanguageSelector } from './ui/Languageselector';
// import { LanguageSelector } from './ui/LanguageSelector';

interface NavbarProps {
  onNavigateToHome: () => void;
  onNavigateToMarketplace: () => void;
  onNavigateToDoctors: () => void;
  onNavigateToPackages?: () => void;
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onNavigateToHome, 
  onNavigateToMarketplace, 
  onNavigateToDoctors,
  onNavigateToPackages,
  selectedLanguage,
  onLanguageChange
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileNav = (action: () => void) => {
    action();
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 h-20 w-full">
        <div className="max-w-[1760px] mx-auto px-6 md:px-12 h-full flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-1 lg:flex-none cursor-pointer z-50" onClick={onNavigateToHome}>
             <div className="w-6 h-6 bg-black rounded-tr-lg rounded-bl-lg rounded-br-sm"></div>
             <span className="font-bold text-xl text-slate-900 tracking-tight">Medifly</span>
          </div>

          {/* Desktop Center Nav */}
          <div className="hidden lg:flex items-center justify-center gap-8 text-sm font-medium text-gray-600 absolute left-1/2 -translate-x-1/2">
             <button 
                onClick={onNavigateToMarketplace}
                className="flex items-center gap-2 hover:text-black transition-colors"
             >
                <Building2 className="w-4 h-4" /> Hospitals
             </button>
             <button 
                onClick={onNavigateToDoctors}
                className="flex items-center gap-2 hover:text-black transition-colors"
             >
                <Stethoscope className="w-4 h-4" /> Doctors
             </button>
             <button 
                onClick={onNavigateToPackages}
                className="flex items-center gap-2 hover:text-black transition-colors"
             >
                <Package className="w-4 h-4" /> Packages
             </button>
             <button 
                className="flex items-center gap-2 hover:text-black transition-colors"
             >
                <Users className="w-4 h-4" /> About Us
             </button>
          </div>

          {/* Right Actions - User Pill (Desktop) */}
          <div className="hidden lg:flex flex-1 justify-end gap-3">
             <div className="hidden md:block">
                  <LanguageSelector selectedLanguage={selectedLanguage} onLanguageChange={onLanguageChange} />
             </div>
             <button className="bg-[#111] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-black/90 transition shadow-sm">
                Get Started
             </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center gap-4">
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
            <div className="fixed inset-0 bg-white z-40 lg:hidden flex flex-col pt-24 px-6 animate-in slide-in-from-top-10 duration-200">
                <div className="space-y-6">
                    <button 
                        onClick={() => handleMobileNav(onNavigateToMarketplace)}
                        className="flex items-center justify-between w-full text-lg font-semibold text-slate-900 border-b border-slate-100 pb-4"
                    >
                        <span className="flex items-center gap-3"><Building2 className="w-5 h-5 text-slate-500" /> Hospitals</span>
                        <ArrowRight className="w-5 h-5 text-slate-300" />
                    </button>
                    <button 
                        onClick={() => handleMobileNav(onNavigateToDoctors)}
                        className="flex items-center justify-between w-full text-lg font-semibold text-slate-900 border-b border-slate-100 pb-4"
                    >
                        <span className="flex items-center gap-3"><Stethoscope className="w-5 h-5 text-slate-500" /> Doctors</span>
                        <ArrowRight className="w-5 h-5 text-slate-300" />
                    </button>
                    <button 
                        onClick={() => handleMobileNav(onNavigateToPackages || (() => {}))}
                        className="flex items-center justify-between w-full text-lg font-semibold text-slate-900 border-b border-slate-100 pb-4"
                    >
                        <span className="flex items-center gap-3"><Package className="w-5 h-5 text-slate-500" /> Packages</span>
                        <ArrowRight className="w-5 h-5 text-slate-300" />
                    </button>
                    <button 
                        className="flex items-center justify-between w-full text-lg font-semibold text-slate-900 border-b border-slate-100 pb-4"
                    >
                        <span className="flex items-center gap-3"><Users className="w-5 h-5 text-slate-500" /> About Us</span>
                        <ArrowRight className="w-5 h-5 text-slate-300" />
                    </button>
                </div>

                <div className="mt-8 space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-500">Language</span>
                        <LanguageSelector selectedLanguage={selectedLanguage} onLanguageChange={onLanguageChange} />
                    </div>
                    <button className="w-full bg-[#111] text-white text-base font-semibold py-4 rounded-xl hover:bg-black/90 transition shadow-sm mt-4">
                        Get Started
                    </button>
                </div>
            </div>
        )}
    </nav>
  );
};
