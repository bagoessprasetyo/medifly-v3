
import React, { useState } from 'react';
import { Menu, X, Plane, ArrowRight, Compass, MessageSquare, Smartphone, BadgeCheck, ShieldCheck, Package } from 'lucide-react';
// import { LanguageSelector } from './ui/LanguageSelector';
import { useTranslation } from '../contexts/TranslationContext';
import { LanguageSelector } from './ui/Languageselector';

interface NavbarProps {
  onNavigateToHome: () => void;
  onNavigateToMarketplace: () => void;
  onNavigateToDoctors: () => void;
  onNavigateToPackages?: () => void;
  onStartTour?: () => void;
  isHomePage?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigateToHome,
  onNavigateToMarketplace,
  onNavigateToDoctors,
  onNavigateToPackages,
  onStartTour,
  isHomePage = false
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

  const handleMobileNav = (action: () => void) => {
    action();
    setIsMobileMenuOpen(false);
  };

  return (
    <div>
        {/* Why Medifly banner - Only shown on homepage */}
        {isHomePage && (
          <nav className="w-full bg-[#FDFBF7] border-b border-[#F0EAE0] py-2 px-4 md:px-8 flex items-center justify-center md:justify-between text-[#5D5555] text-[10px] md:text-xs overflow-hidden whitespace-nowrap relative z-10">
              <div className="flex items-center gap-8 md:w-full md:justify-center overflow-x-auto no-scrollbar mask-image-gradient">
                  <div className="flex items-center gap-2 shrink-0">
                      <span className="font-semibold text-slate-700">{t('Why Medifly?')}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                      <Package className="w-3.5 h-3.5" />
                      <span>{t('Global hospital network')}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                      <BadgeCheck className="w-3.5 h-3.5" />
                      <span>{t('Transparent pricing estimates')}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{t('JCI accredited partners')}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>{t('100% digital booking')}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{t('24/7 AI Concierge')}</span>
                  </div>
              </div>
          </nav>
        )}
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
                    {t('How it works')}
                </button>
                <button 
                    onClick={onNavigateToMarketplace}
                    className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
                >
                    {t('Hospitals')}
                </button>
                <button 
                    onClick={onNavigateToDoctors}
                    className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
                >
                    {t('Doctors')}
                </button>
                <button 
                    onClick={onNavigateToPackages}
                    className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
                >
                    {t('Packages')}
                </button>
            </div>

            {/* Right Actions */}
            <div className="hidden md:flex items-center gap-4">
                {onStartTour && (
                    <button 
                        onClick={onStartTour}
                        className="text-sm font-medium text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                        <Compass className="w-4 h-4" /> {t('Tour')}
                    </button>
                )}
                <div className="hidden lg:block">
                    <LanguageSelector />
                </div>
                <button className="text-sm font-medium bg-slate-900 text-white px-5 py-2.5 rounded-lg hover:bg-slate-800 transition-colors shadow-sm hover:shadow-md">
                    {t('Get Started')}
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
                            <span>{t('Hospitals')}</span>
                            <ArrowRight className="w-5 h-5 text-slate-300" />
                        </button>
                        <button 
                            onClick={() => handleMobileNav(onNavigateToDoctors)}
                            className="flex items-center justify-between w-full text-lg font-semibold text-slate-900 border-b border-slate-100 pb-4"
                        >
                            <span>{t('Doctors')}</span>
                            <ArrowRight className="w-5 h-5 text-slate-300" />
                        </button>
                        <button 
                            onClick={() => handleMobileNav(onNavigateToPackages || (() => {}))}
                            className="flex items-center justify-between w-full text-lg font-semibold text-slate-900 border-b border-slate-100 pb-4"
                        >
                            <span>{t('Packages')}</span>
                            <ArrowRight className="w-5 h-5 text-slate-300" />
                        </button>
                        {onStartTour && (
                            <button 
                                onClick={() => handleMobileNav(onStartTour)}
                                className="flex items-center justify-between w-full text-lg font-semibold text-indigo-600 border-b border-indigo-100 pb-4"
                            >
                                <span className="flex items-center gap-2"><Compass className="w-5 h-5" /> {t('Tour')}</span>
                                <ArrowRight className="w-5 h-5 text-indigo-300" />
                            </button>
                        )}
                    </div>

                    <div className="mt-8 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-500">{t('Language')}</span>
                            <LanguageSelector />
                        </div>
                        <button className="w-full bg-slate-900 text-white text-base font-semibold py-4 rounded-xl hover:bg-black transition shadow-sm mt-4">
                            {t('Sign in')}
                        </button>
                    </div>
                </div>
            )}
        </nav>
    </div>
   
  );
};
