
import React from 'react';
import { Building2, Stethoscope, Package, Users } from 'lucide-react';
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
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100 h-20 w-full">
        <div className="max-w-[1760px] mx-auto px-6 md:px-12 h-full flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-1 lg:flex-none cursor-pointer" onClick={onNavigateToHome}>
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

          {/* Right Actions - User Pill */}
          <div className="flex-1 flex justify-end gap-3">
             <div className="hidden md:block">
                  <LanguageSelector selectedLanguage={selectedLanguage} onLanguageChange={onLanguageChange} />
             </div>
             <button className="bg-[#111] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-black/90 transition shadow-sm">
                Get Started
             </button>
          </div>
        </div>
    </nav>
  );
};