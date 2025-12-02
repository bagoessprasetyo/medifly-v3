
import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  onNavigateToHome: () => void;
  onNavigateToMarketplace: () => void;
  onNavigateToDoctors: () => void;
  onNavigateToPackages?: () => void;
  onStartTour?: () => void;
  isHomePage?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children,
  onNavigateToHome,
  onNavigateToMarketplace,
  onNavigateToDoctors,
  onNavigateToPackages,
  onStartTour,
  isHomePage = false
}) => {
  const [showNavbar, setShowNavbar] = useState(!isHomePage);

  useEffect(() => {
    // If not homepage, always show
    if (!isHomePage) {
        setShowNavbar(true);
        return;
    }

    // On homepage, only show after scrolling past a threshold
    const handleScroll = () => {
        const mainContent = document.getElementById('main-content-area');
        if (mainContent) {
            // Check scroll inside the main content container if it handles scrolling
            if (mainContent.scrollTop > 50) {
                setShowNavbar(true);
            } else {
                setShowNavbar(false);
            }
        } else {
            // Fallback to window scroll
            if (window.scrollY > 50) {
                setShowNavbar(true);
            } else {
                setShowNavbar(false);
            }
        }
    };

    // Attach listeners
    const mainContent = document.getElementById('main-content-area');
    if (mainContent) {
        mainContent.addEventListener('scroll', handleScroll);
        // Initial check
        handleScroll();
    }
    window.addEventListener('scroll', handleScroll);

    return () => {
        if (mainContent) mainContent.removeEventListener('scroll', handleScroll);
        window.removeEventListener('scroll', handleScroll);
    };
  }, [isHomePage]);

  return (
    <div className="min-h-full flex flex-col bg-white font-sans text-slate-900 relative">
      <div 
        className={`top-0 z-50 w-full transition-all duration-300 ease-in-out transform ${
            isHomePage ? 'fixed' : 'sticky'
        } ${
            showNavbar ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
          <Navbar 
            onNavigateToHome={onNavigateToHome}
            onNavigateToMarketplace={onNavigateToMarketplace}
            onNavigateToDoctors={onNavigateToDoctors}
            onNavigateToPackages={onNavigateToPackages}
            onStartTour={onStartTour}
          />
      </div>
      <main className="flex-1 w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
};
