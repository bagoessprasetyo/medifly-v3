import React from 'react';
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
  onOpenCTA?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  onNavigateToHome,
  onNavigateToMarketplace,
  onNavigateToDoctors,
  onNavigateToPackages,
  onStartTour,
  isHomePage = false,
  onOpenCTA
}) => {

  return (
    <div className="min-h-full flex flex-col bg-white font-sans text-slate-900 relative">
      <div className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100">
        <Navbar
          onNavigateToHome={onNavigateToHome}
          onNavigateToMarketplace={onNavigateToMarketplace}
          onNavigateToDoctors={onNavigateToDoctors}
          onNavigateToPackages={onNavigateToPackages}
          onStartTour={onStartTour}
          isHomePage={isHomePage}
          onOpenCTA={onOpenCTA}
        />
      </div>
      <main className="flex-1 w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
};