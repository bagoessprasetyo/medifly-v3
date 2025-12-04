import React, { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { ChatInterface } from './components/ChatInterface';
import { Marketplace } from './components/Marketplace';
import { HospitalPage } from './components/HospitalPage';
import { HospitalGalleryPage } from './components/HospitalGalleryPage';
import { FacilityGalleryPage } from './components/FacilityGalleryPage';
import { FacilityDetailsPage } from './components/FacilityDetailsPage'; 
import { DoctorsPage } from './components/DoctorsPage'; 
import { DoctorDetailsPage } from './components/DoctorDetailsPage';
import { PackageDetailsPage } from './components/PackageDetailsPage';
import { SpecializationDetailsPage } from './components/SpecializationDetailsPage'; 
// import { HospitalInsightsPage } from './components/HospitalInsightsPage'; 
import { ArticleDetailsPage } from './components/ArticleDetailsPage';
import { ResearchDetailsPage } from './components/ResearchDetailsPage'; 
import { TreatmentDetailsPage } from './components/TreatmentDetailsPage'; // Import
import { Layout } from './components/Layout';
import { FilterState, Hospital, ChatSession, Message, Doctor, MedicalPackage } from './types';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { HOSPITALS, DOCTORS, PACKAGES, createSlug } from './constants';
import { PackagesPage } from './components/PackagesPage';
import { HealthPotential } from './components/HealthPotential';
import { Testimonials } from './components/Testimonials';
import { MedicalTeam } from './components/MedicalTeam';
import { ExploreHospitals } from './components/ExploreHospitals';
import { Mission } from './components/Mission';
import { TranslationProvider, useTranslation } from './contexts/TranslationContext';
import { AITranslationOverlay } from './components/ui/AiTranslationOverlay';
import { HospitalInsightsPage } from './components/HospitalInsights';
// import { AITranslationOverlay } from './components/ui/AITranslationOverlay';

const safePushState = (url: string) => {
  try {
    window.history.pushState(null, '', url);
  } catch (e) {
    console.debug('URL update skipped due to environment restriction:', e);
  }
};

const MainApp: React.FC = () => {
  const [page, setPage] = useState<'home' | 'marketplace' | 'hospital-page' | 'doctors' | 'doctor-details' | 'gallery' | 'facilities' | 'facility-details' | 'packages' | 'package-details' | 'specialization-details' | 'hospital-insights' | 'article-details' | 'research-details' | 'treatment-details'>('home');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDeepFocusMode, setIsDeepFocusMode] = useState(false); 
  const { isTranslating, language, setLanguage } = useTranslation();
  
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
  });

  const [viewedHospital, setViewedHospital] = useState<Hospital | null>(null);
  const [viewedFacilityName, setViewedFacilityName] = useState<string | null>(null);
  const [viewedDoctor, setViewedDoctor] = useState<Doctor | null>(null);
  const [viewedPackage, setViewedPackage] = useState<MedicalPackage | null>(null);
  const [viewedSpecializationName, setViewedSpecializationName] = useState<string | null>(null);
  const [viewedArticleTitle, setViewedArticleTitle] = useState<string | null>(null);
  const [viewedResearchTitle, setViewedResearchTitle] = useState<string | null>(null);
  const [viewedTreatmentName, setViewedTreatmentName] = useState<string | null>(null);

  useEffect(() => {
    const savedSessions = localStorage.getItem('medifly_sessions');
    if (savedSessions) {
      try {
        const parsed = JSON.parse(savedSessions);
        setSessions(parsed);
        if (parsed.length > 0) {
          setCurrentSessionId(parsed[0].id); 
        } else {
            createNewSession();
        }
      } catch (e) {
        console.error("Failed to load sessions", e);
        createNewSession();
      }
    } else {
      createNewSession();
    }
  }, []);

  useEffect(() => {
    if (sessions.length > 0) {
        localStorage.setItem('medifly_sessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  useEffect(() => {
    const session = sessions.find(s => s.id === currentSessionId);
    if (session && session.lastActiveFilters) {
        setFilters(session.lastActiveFilters);
        if (['home', 'marketplace'].includes(page)) {
           setPage('marketplace');
        }
    } else if (session && page === 'marketplace') {
        setFilters({ searchQuery: '' });
    }
  }, [currentSessionId]);

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Conversation',
      messages: [],
      updatedAt: Date.now()
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    return newSession.id;
  };

  const updateSessionMessages = (sessionId: string, newMessages: Message[]) => {
      setSessions(prev => prev.map(session => {
          if (session.id === sessionId) {
              let title = session.title;
              if (session.messages.length === 0 && newMessages.length > 0) {
                  const firstUserMsg = newMessages.find(m => m.role === 'user');
                  if (firstUserMsg) {
                      title = firstUserMsg.content.slice(0, 30) + (firstUserMsg.content.length > 30 ? '...' : '');
                  }
              }

              return {
                  ...session,
                  messages: newMessages,
                  title: title,
                  updatedAt: Date.now()
              };
          }
          return session;
      }));
  };

  const currentSession = sessions.find(s => s.id === currentSessionId) || sessions[0];

  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname;
      
      if (path.startsWith('/hospitals/')) {
          const parts = path.split('/');
          const hospitalSlug = parts[2];
          const subPageOrSpec = parts[3];
          const subItem = parts[4];
          
          const hospital = HOSPITALS.find(h => createSlug(h.name) === hospitalSlug);
          if (hospital) {
              setViewedHospital(hospital);
              
              if (subPageOrSpec === 'tour') {
                  setPage('gallery');
              } else if (subPageOrSpec === 'facilities') {
                  if (subItem) {
                      const name = subItem.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                      setViewedFacilityName(name);
                      setPage('facility-details');
                  } else {
                      setPage('facilities');
                  }
              } else if (subPageOrSpec === 'insights') {
                  setPage('hospital-insights');
              } else if (subPageOrSpec === 'articles') {
                  if (subItem) {
                      const title = subItem.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                      setViewedArticleTitle(title);
                      setPage('article-details');
                  }
              } else if (subPageOrSpec === 'research') {
                  if (subItem) {
                      const title = subItem.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                      setViewedResearchTitle(title);
                      setPage('research-details');
                  }
              } else if (subPageOrSpec) {
                  const specName = subPageOrSpec.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                  setViewedSpecializationName(specName);
                  
                  if (subItem) {
                      const treatmentName = subItem.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                      setViewedTreatmentName(treatmentName);
                      setPage('treatment-details');
                  } else {
                      setPage('specialization-details');
                  }
              } else {
                  setPage('hospital-page');
              }
              setIsChatOpen(false); 
              return;
          }
      }

      if (path.startsWith('/doctors/')) {
          const slug = path.split('/')[2];
          const doctor = DOCTORS.find(d => createSlug(d.name) === slug);
          if (doctor) {
              setViewedDoctor(doctor);
              setPage('doctor-details');
              setIsChatOpen(false);
              return;
          }
      }

      if (path.startsWith('/packages/')) {
          const slug = path.split('/')[2];
          const pkg = PACKAGES.find(p => createSlug(p.title) === slug);
          if (pkg) {
              setViewedPackage(pkg);
              setPage('package-details');
              setIsChatOpen(false);
              return;
          }
      }

      if (path === '/doctors') {
          setPage('doctors');
          setIsChatOpen(false);
          return;
      }

      if (path === '/packages') {
          setPage('packages');
          setIsChatOpen(false);
          return;
      }
      
      if (path === '/') {
          if (page !== 'home') {
             setPage('home'); 
             setViewedHospital(null);
             setViewedDoctor(null);
             setViewedPackage(null);
          }
      }
    };

    handleUrlChange();

    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []); 

  const handleNavigateToHospital = (hospital: Hospital) => {
    setViewedHospital(hospital);
    setPage('hospital-page');
    setIsChatOpen(false);
    safePushState(`/hospitals/${createSlug(hospital.name)}`);
  };

  const handleNavigateToHospitalById = (hospitalId: string) => {
      const hospital = HOSPITALS.find(h => h.id === hospitalId);
      if (hospital) {
          handleNavigateToHospital(hospital);
      }
  };

  const handleBackFromHospital = () => {
      try {
        if (window.history.state !== null) {
            window.history.back();
        } else {
            setPage('marketplace');
            setViewedHospital(null);
            safePushState('/');
        }
      } catch (e) {
        setPage('marketplace');
        setViewedHospital(null);
      }
  };

  const handleNavigateToGallery = () => {
      if (viewedHospital) {
        setPage('gallery');
        safePushState(`/hospitals/${createSlug(viewedHospital.name)}/tour`);
      }
  };

  const handleBackFromGallery = () => {
      if (viewedHospital) {
        setPage('hospital-page');
        safePushState(`/hospitals/${createSlug(viewedHospital.name)}`);
      }
  };

  const handleNavigateToFacilities = () => {
      if (viewedHospital) {
        setPage('facilities');
        safePushState(`/hospitals/${createSlug(viewedHospital.name)}/facilities`);
      }
  };

  const handleNavigateToFacilityDetails = (facilityName: string) => {
      if (viewedHospital) {
          setViewedFacilityName(facilityName);
          setPage('facility-details');
          const facilitySlug = createSlug(facilityName);
          safePushState(`/hospitals/${createSlug(viewedHospital.name)}/facilities/${facilitySlug}`);
      }
  }

  const handleBackFromFacilities = () => {
      if (viewedHospital) {
        setPage('hospital-page');
        safePushState(`/hospitals/${createSlug(viewedHospital.name)}`);
      }
  };

  const handleBackFromFacilityDetails = () => {
      if (viewedHospital) {
          setPage('facilities');
          safePushState(`/hospitals/${createSlug(viewedHospital.name)}/facilities`);
      }
  }

  const handleNavigateToSpecialization = (specName: string) => {
      if (viewedHospital) {
          setViewedSpecializationName(specName);
          setPage('specialization-details');
          const specSlug = createSlug(specName);
          safePushState(`/hospitals/${createSlug(viewedHospital.name)}/${specSlug}`);
      }
  }

  const handleBackFromSpecialization = () => {
      if (viewedHospital) {
          setPage('hospital-page');
          safePushState(`/hospitals/${createSlug(viewedHospital.name)}`);
      }
  }

  const handleNavigateToTreatment = (treatmentName: string) => {
      if (viewedHospital && viewedSpecializationName) {
          setViewedTreatmentName(treatmentName);
          setPage('treatment-details');
          const specSlug = createSlug(viewedSpecializationName);
          const treatmentSlug = createSlug(treatmentName);
          safePushState(`/hospitals/${createSlug(viewedHospital.name)}/${specSlug}/${treatmentSlug}`);
      }
  }

  const handleBackFromTreatment = () => {
      if (viewedHospital && viewedSpecializationName) {
          setPage('specialization-details');
          const specSlug = createSlug(viewedSpecializationName);
          safePushState(`/hospitals/${createSlug(viewedHospital.name)}/${specSlug}`);
      }
  }

  const handleNavigateToInsights = () => {
      if (viewedHospital) {
          setPage('hospital-insights');
          safePushState(`/hospitals/${createSlug(viewedHospital.name)}/insights`);
      }
  }

  const handleBackFromInsights = () => {
      if (viewedHospital) {
          setPage('hospital-page');
          safePushState(`/hospitals/${createSlug(viewedHospital.name)}`);
      }
  }

  const handleNavigateToArticle = (articleTitle: string) => {
      if (viewedHospital) {
          setViewedArticleTitle(articleTitle);
          setPage('article-details');
          const articleSlug = createSlug(articleTitle);
          safePushState(`/hospitals/${createSlug(viewedHospital.name)}/articles/${articleSlug}`);
      }
  }

  const handleNavigateToResearch = (researchTitle: string) => {
      if (viewedHospital) {
          setViewedResearchTitle(researchTitle);
          setPage('research-details');
          const researchSlug = createSlug(researchTitle);
          safePushState(`/hospitals/${createSlug(viewedHospital.name)}/research/${researchSlug}`);
      }
  }

  const handleBackFromArticle = () => {
      if (viewedHospital) {
          setPage('hospital-insights');
          safePushState(`/hospitals/${createSlug(viewedHospital.name)}/insights`);
      }
  }

  const handleBackFromResearch = () => {
      if (viewedHospital) {
          setPage('hospital-insights');
          safePushState(`/hospitals/${createSlug(viewedHospital.name)}/insights`);
      }
  }

  const handleNavigateToDoctor = (doctor: Doctor) => {
      setViewedDoctor(doctor);
      setPage('doctor-details');
      setIsChatOpen(false);
      safePushState(`/doctors/${createSlug(doctor.name)}`);
  };

  const handleBackFromDoctor = () => {
      setPage('doctors');
      safePushState('/doctors');
  };

  const handleNavigateToPackage = (pkg: MedicalPackage) => {
      setViewedPackage(pkg);
      setPage('package-details');
      setIsChatOpen(false);
      safePushState(`/packages/${createSlug(pkg.title)}`);
  };

  const handleBackFromPackage = () => {
      setPage('packages');
      safePushState('/packages');
  };

  const [initialQuery, setInitialQuery] = useState<string>('');

  const handleQuickSearch = (query: string, origin?: string, location?: { lat: number; lng: number }) => {
    const newId = createNewSession();
    setInitialQuery(query); 
    setFilters(prev => ({ 
        ...prev, 
        userOrigin: origin || undefined,
        userLocation: location || undefined
    }));
    if (page !== 'hospital-page') {
        setPage('marketplace');
    }
    setIsChatOpen(true);
    if (page !== 'hospital-page') {
        safePushState('/');
    }
  };
  
  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setSessions(prev => prev.map(s => {
        if (s.id === currentSessionId) {
            return { 
                ...s, 
                title: newFilters.aiListName || s.title,
                lastActiveFilters: { ...filters, ...newFilters },
                updatedAt: Date.now()
            };
        }
        return s;
    }));
    setPage('marketplace'); 
    safePushState('/');
  };

  const handleClearFilters = () => {
    const emptyFilters = { searchQuery: '' };
    setFilters(emptyFilters);
    setSessions(prev => prev.map(s => {
        if (s.id === currentSessionId) {
            return { ...s, lastActiveFilters: undefined };
        }
        return s;
    }));
  };

  const handleNewSessionClick = () => {
      createNewSession();
      setInitialQuery('');
      handleClearFilters();
  };

  const navigateToMarketplace = () => {
      setPage('marketplace');
      setFilters({ searchQuery: '' });
      safePushState('/');
  };

  const navigateToDoctors = () => {
      setPage('doctors');
      safePushState('/doctors');
  }

  const navigateToPackages = () => {
      setPage('packages');
      safePushState('/packages');
  }

  const navigateToHome = () => {
      setPage('home');
      safePushState('/');
  }

  const layoutProps = {
    onNavigateToHome: navigateToHome,
    onNavigateToMarketplace: navigateToMarketplace,
    onNavigateToDoctors: navigateToDoctors,
    onNavigateToPackages: navigateToPackages,
    isHomePage: page === 'home',
  };

  return (
    <div className="h-[100dvh] w-screen overflow-hidden flex bg-white relative">
      
      {isTranslating && <AITranslationOverlay />}

      <div 
        className={`
            h-full flex-shrink-0 bg-white border-r border-slate-200 relative z-30 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
            ${isChatOpen 
                ? (isDeepFocusMode ? 'w-full' : 'w-full md:w-[450px] lg:w-[500px]') 
                : 'w-0 -translate-x-10 opacity-0 overflow-hidden'
            }
            ${isDeepFocusMode ? 'border-r-0' : ''}
        `}
      >
        <div className="w-full h-full">
            {currentSession && (
                <ChatInterface 
                    key={currentSession.id}
                    currentSession={currentSession}
                    sessions={sessions}
                    onSelectSession={setCurrentSessionId}
                    onNewSession={handleNewSessionClick}
                    onUpdateSessionMessages={updateSessionMessages}
                    isDeepFocusMode={isDeepFocusMode}
                    onToggleDeepFocus={() => setIsDeepFocusMode(!isDeepFocusMode)}
                    initialQuery={initialQuery && currentSession.messages.length === 0 ? initialQuery : undefined} 
                    onSendMessage={async () => {}}
                    onApplyFilters={handleApplyFilters} 
                    onClose={() => setIsChatOpen(false)}
                    activeFilters={filters}
                    language={language}
                    onLanguageChange={setLanguage}
                />
            )}
        </div>
      </div>

      <div 
        id="main-content-area"
        className={`
            flex-1 h-full relative transition-all duration-500 bg-white overflow-y-auto
            ${isDeepFocusMode ? 'hidden w-0 opacity-0' : ''} 
        `}
      >
         <div className={`md:hidden absolute top-4 left-4 z-20 flex gap-2 ${['hospital-page', 'doctors', 'marketplace', 'gallery', 'facilities', 'facility-details', 'doctor-details', 'packages', 'package-details', 'specialization-details', 'hospital-insights', 'article-details', 'research-details', 'treatment-details'].includes(page) ? 'hidden' : ''}`}>
             <button onClick={() => {
                 setPage('home');
             }} className="p-2 bg-white rounded-full shadow-md border border-slate-100">
                <ArrowLeft className="w-5 h-5 text-slate-700" />
             </button>
             {!isChatOpen && (
                <button onClick={() => setIsChatOpen(true)} className="p-2 bg-slate-900 rounded-full shadow-md text-white">
                    <MessageSquare className="w-5 h-5" />
                </button>
             )}
         </div>

         <Layout {...layoutProps}>
            {page === 'home' && (
                <>
                    <Hero 
                        onQuickSearch={handleQuickSearch} 
                        onNavigateToMarketplace={navigateToMarketplace}
                    />
                    <ExploreHospitals />
                    <HealthPotential />
                    <MedicalTeam />
                    <Testimonials />
                    <Mission />
                </>
            )}

            {page === 'marketplace' && (
                <Marketplace
                    filters={filters}
                    onClearFilters={handleClearFilters}
                    onViewHospitalPage={handleNavigateToHospital}
                    onUpdateFilters={handleApplyFilters}
                    isChatOpen={isChatOpen}
                    onOpenChat={() => setIsChatOpen(true)}
                />
            )}

            {page === 'hospital-page' && viewedHospital && (
                <HospitalPage
                    hospital={viewedHospital}
                    onBack={handleBackFromHospital}
                    onNavigateToHospitals={navigateToMarketplace}
                    onNavigateToDoctors={navigateToDoctors}
                    onNavigateToPackages={navigateToPackages}
                    onViewGallery={handleNavigateToGallery}
                    onViewFacilities={handleNavigateToFacilities}
                    onAskAria={handleQuickSearch}
                    onViewSpecialization={handleNavigateToSpecialization}
                    onNavigateToHospital={handleNavigateToHospital}
                    onNavigateToDoctor={handleNavigateToDoctor}
                    onNavigateToInsights={handleNavigateToInsights}
                    onNavigateToFacilityDetails={handleNavigateToFacilityDetails}
                    isChatOpen={isChatOpen}
                />
            )}

            {page === 'gallery' && viewedHospital && (
                <HospitalGalleryPage 
                    hospital={viewedHospital}
                    onBack={handleBackFromGallery}
                />
            )}

            {page === 'facilities' && viewedHospital && (
                <FacilityGalleryPage 
                    hospital={viewedHospital}
                    onBack={handleBackFromFacilities}
                    onViewFacilityDetails={handleNavigateToFacilityDetails}
                />
            )}

            {page === 'facility-details' && viewedHospital && viewedFacilityName && (
                <FacilityDetailsPage
                    hospital={viewedHospital}
                    facilityName={viewedFacilityName}
                    onBack={handleBackFromFacilityDetails}
                    onNavigateToHospital={() => handleNavigateToHospital(viewedHospital)}
                />
            )}

            {page === 'specialization-details' && viewedHospital && viewedSpecializationName && (
                <SpecializationDetailsPage
                    hospital={viewedHospital}
                    specializationName={viewedSpecializationName}
                    onBack={handleBackFromSpecialization}
                    onNavigateToHospital={() => handleNavigateToHospital(viewedHospital)}
                    onNavigateToDoctor={handleNavigateToDoctor}
                    onViewAllInsights={handleNavigateToInsights}
                    onNavigateToArticle={handleNavigateToArticle}
                    onNavigateToTreatment={handleNavigateToTreatment}
                    onNavigateToFacility={handleNavigateToFacilityDetails}
                />
            )}

            {page === 'treatment-details' && viewedHospital && viewedSpecializationName && viewedTreatmentName && (
                <TreatmentDetailsPage
                    hospital={viewedHospital}
                    specializationName={viewedSpecializationName}
                    treatmentName={viewedTreatmentName}
                    onBack={handleBackFromTreatment}
                    onNavigateToHospital={() => handleNavigateToHospital(viewedHospital)}
                    onNavigateToSpecialization={handleBackFromTreatment}
                />
            )}

            {page === 'hospital-insights' && viewedHospital && (
                <HospitalInsightsPage
                    hospital={viewedHospital}
                    onBack={handleBackFromInsights}
                    onNavigateToHospital={() => handleNavigateToHospital(viewedHospital)}
                    onNavigateToArticle={handleNavigateToArticle}
                    onNavigateToResearch={handleNavigateToResearch}
                />
            )}

            {page === 'article-details' && viewedHospital && viewedArticleTitle && (
                <ArticleDetailsPage
                    hospital={viewedHospital}
                    articleTitle={viewedArticleTitle}
                    onBack={handleBackFromArticle}
                    onNavigateToHospital={() => handleNavigateToHospital(viewedHospital)}
                    onNavigateToArticle={handleNavigateToArticle}
                    onNavigateToResearch={handleNavigateToResearch}
                />
            )}

            {page === 'research-details' && viewedHospital && viewedResearchTitle && (
                <ResearchDetailsPage
                    hospital={viewedHospital}
                    researchTitle={viewedResearchTitle}
                    onBack={handleBackFromResearch}
                    onNavigateToHospital={() => handleNavigateToHospital(viewedHospital)}
                    onNavigateToArticle={handleNavigateToArticle}
                    onNavigateToResearch={handleNavigateToResearch}
                />
            )}

            {page === 'doctors' && (
                <DoctorsPage 
                    onBack={() => setPage('home')}
                    onNavigateToHospitals={navigateToMarketplace}
                    onNavigateToDoctors={() => {}} 
                    onViewDoctor={handleNavigateToDoctor}
                />
            )}

            {page === 'doctor-details' && viewedDoctor && (
                <DoctorDetailsPage
                    doctor={viewedDoctor}
                    onBack={handleBackFromDoctor}
                    onNavigateToHospital={handleNavigateToHospitalById}
                    onViewDoctor={handleNavigateToDoctor}
                />
            )}

            {page === 'packages' && (
                <PackagesPage 
                    onBack={() => setPage('home')}
                    onViewPackage={handleNavigateToPackage}
                />
            )}

            {page === 'package-details' && viewedPackage && (
                <PackageDetailsPage
                    medicalPackage={viewedPackage}
                    onBack={handleBackFromPackage}
                    onNavigateToHospital={handleNavigateToHospital}
                />
            )}
         </Layout>
      </div>
    </div>
  );
}

const App: React.FC = () => {
  return (
    <TranslationProvider>
      <MainApp />
    </TranslationProvider>
  );
};

export default App;