
import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  onNavigateToHome: () => void;
  onNavigateToMarketplace: () => void;
  onNavigateToDoctors: () => void;
  onNavigateToPackages?: () => void;
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children,
  onNavigateToHome,
  onNavigateToMarketplace,
  onNavigateToDoctors,
  onNavigateToPackages,
  selectedLanguage,
  onLanguageChange
}) => {
  return (
    <div className="min-h-full flex flex-col bg-white font-sans text-slate-900">
      <Navbar 
        onNavigateToHome={onNavigateToHome}
        onNavigateToMarketplace={onNavigateToMarketplace}
        onNavigateToDoctors={onNavigateToDoctors}
        onNavigateToPackages={onNavigateToPackages}
        selectedLanguage={selectedLanguage}
        onLanguageChange={onLanguageChange}
      />
      <main className="flex-1 w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
};