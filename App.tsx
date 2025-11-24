
import React, { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { ChatInterface } from './components/ChatInterface';
import { Marketplace } from './components/Marketplace';
import { HospitalPage } from './components/HospitalPage';
import { FilterState, Hospital, ChatSession, Message } from './types';
import { ArrowLeft, MessageSquare, Sparkles } from 'lucide-react';
import { HOSPITALS, createSlug } from './constants';

const App: React.FC = () => {
  const [page, setPage] = useState<'home' | 'marketplace' | 'hospital-page'>('home');
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // -- Language State --
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  // -- Session Management State --
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');

  // Marketplace State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
  });

  // Detailed Hospital Page State
  const [viewedHospital, setViewedHospital] = useState<Hospital | null>(null);

  // Load Sessions from LocalStorage on Mount
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

  // Save Sessions to LocalStorage whenever they change
  useEffect(() => {
    if (sessions.length > 0) {
        localStorage.setItem('medifly_sessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  // Restore filters when switching sessions
  useEffect(() => {
    const session = sessions.find(s => s.id === currentSessionId);
    if (session && session.lastActiveFilters) {
        setFilters(session.lastActiveFilters);
        // If the session has filters, assume we want to see the marketplace
        if (page !== 'hospital-page') {
           setPage('marketplace');
        }
    } else if (session && page === 'marketplace') {
        // If switching to a session without filters, reset them but stay on marketplace
        setFilters({ searchQuery: '' });
    }
  }, [currentSessionId]);

  // Create a new session
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
              // Auto-update title if it's the first user message
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

  // -- Routing Logic --

  // Handle URL routing on load and popstate (back button)
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname;
      const match = path.match(/^\/hospitals\/(.+)/);
      
      if (match) {
        const slug = match[1];
        const hospital = HOSPITALS.find(h => createSlug(h.name) === slug);
        if (hospital) {
            setViewedHospital(hospital);
            setPage('hospital-page');
            setIsChatOpen(false); // Ensure chat is closed on direct load
            return;
        }
      }
      
      // Default fallback based on path
      if (path === '/') {
          if (page === 'hospital-page') {
             setPage('marketplace'); // Go back to marketplace state if we were deep
             setViewedHospital(null);
          }
      }
    };

    // Check initial
    handleUrlChange();

    // Listen for back button
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []); // Remove dependencies to avoid loops, trust window location

  const handleNavigateToHospital = (hospital: Hospital) => {
    setViewedHospital(hospital);
    setPage('hospital-page');
    setIsChatOpen(false); // Auto-hide chat sidebar
    window.history.pushState(null, '', `/hospitals/${createSlug(hospital.name)}`);
  };

  const handleBackFromHospital = () => {
      // If we have history, go back, otherwise reset to marketplace
      if (window.history.state !== null) {
          window.history.back();
      } else {
          setPage('marketplace');
          setViewedHospital(null);
          window.history.pushState(null, '', '/');
      }
  };

  // This state is just to trigger the effect in ChatInterface one time. 
  const [initialQuery, setInitialQuery] = useState<string>('');

  const handleQuickSearch = (query: string, origin?: string, location?: { lat: number; lng: number }) => {
    const newId = createNewSession();
    setInitialQuery(query); 
    setFilters(prev => ({ 
        ...prev, 
        userOrigin: origin || undefined,
        userLocation: location || undefined
    }));
    setPage('marketplace');
    setIsChatOpen(true);
    window.history.pushState(null, '', '/');
  };
  
  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    
    // Update session title AND persist these filters to the session
    setSessions(prev => prev.map(s => {
        if (s.id === currentSessionId) {
            return { 
                ...s, 
                // Always rename the session to the AI list name if provided, creating a "Saved Search" effect
                title: newFilters.aiListName || s.title,
                lastActiveFilters: { ...filters, ...newFilters }, // Save the filters
                updatedAt: Date.now()
            };
        }
        return s;
    }));

    // Always switch to marketplace view so user sees results immediately
    setPage('marketplace'); 
    window.history.pushState(null, '', '/');
  };

  const handleClearFilters = () => {
    const emptyFilters = { searchQuery: '' };
    setFilters(emptyFilters);
    
    // Clear filters in session too
    setSessions(prev => prev.map(s => {
        if (s.id === currentSessionId) {
            return { ...s, lastActiveFilters: undefined };
        }
        return s;
    }));
  };

  const handleNewSessionClick = () => {
      createNewSession();
      setInitialQuery(''); // clear any previous initial query
      handleClearFilters();
  };

  if (page === 'home') {
    return (
      <Hero 
        onQuickSearch={handleQuickSearch} 
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
      />
    );
  }

  return (
    <div className="h-[100dvh] w-screen overflow-hidden flex bg-white relative">
      
      {/* Chat Open Toggle (Floating Button) - Only render when chat is closed */}
      {!isChatOpen && (
      <div className="absolute bottom-6 left-6 z-40 animate-in fade-in slide-in-from-bottom-4 duration-500">
         <button 
            onClick={() => setIsChatOpen(true)}
            className="flex items-center gap-2 pl-4 pr-5 py-3 bg-slate-900 text-white rounded-full shadow-2xl hover:scale-105 hover:bg-black transition-all group"
         >
            <div className="relative">
                <MessageSquare className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#B2D7FF] rounded-full border-2 border-slate-900 animate-pulse" />
            </div>
            <span className="font-semibold text-sm">Ask Concierge</span>
         </button>
      </div>
      )}

      {/* Left Panel: Aria Chat Sidebar */}
      <div 
        className={`
            h-full flex-shrink-0 bg-white border-r border-slate-200 relative z-30 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
            ${isChatOpen ? 'w-full md:w-[450px] lg:w-[500px] translate-x-0' : 'w-0 -translate-x-10 opacity-0 overflow-hidden'}
        `}
      >
        <div className="w-full h-full md:w-[450px] lg:w-[500px]">
            {currentSession && (
                <ChatInterface 
                    // Add Key to force re-mount on session switch
                    key={currentSession.id}
                    // Session Props
                    currentSession={currentSession}
                    sessions={sessions}
                    onSelectSession={setCurrentSessionId}
                    onNewSession={handleNewSessionClick}
                    onUpdateSessionMessages={updateSessionMessages}
                    language={selectedLanguage}
                    onLanguageChange={setSelectedLanguage} // Add this
                    
                    // Legacy Props
                    initialQuery={initialQuery && currentSession.messages.length === 0 ? initialQuery : undefined} 
                    onSendMessage={async () => {}} // Not really used directly anymore, handled inside
                    onApplyFilters={handleApplyFilters} 
                    onClose={() => setIsChatOpen(false)}
                    activeFilters={filters} // Pass global filters for sync
                />
            )}
        </div>
      </div>

      {/* Right Panel: Marketplace or Hospital Page */}
      <div 
        id="main-content-area"
        className={`flex-1 h-full relative transition-all duration-500 bg-white ${page === 'hospital-page' ? 'overflow-y-auto' : ''}`}
      >
         
         {/* Mobile Header / Back Button Area - Only show if page is NOT hospital-page (hospital page has its own nav) or if on marketplace */}
         <div className={`md:hidden absolute top-4 left-4 z-20 flex gap-2 ${page === 'hospital-page' ? 'hidden' : ''}`}>
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

         {page === 'hospital-page' && viewedHospital ? (
            <HospitalPage 
               hospital={viewedHospital} 
               onBack={handleBackFromHospital} 
            />
         ) : (
            <Marketplace 
              filters={filters} 
              onClearFilters={handleClearFilters}
              onViewHospitalPage={handleNavigateToHospital}
              onUpdateFilters={handleApplyFilters}
            />
         )}
      </div>
    </div>
  );
};

export default App;
