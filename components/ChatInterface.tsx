
import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, User, Loader2, ArrowRight, LayoutGrid, MapPin, Star, PanelLeftClose, Paperclip, Bot, History, Plus, MessageSquare, Clock, Check, X, ChevronUp, ChevronDown, Search, Plane, FileText, Image as ImageIcon, MessageCircle, LogOut, Telescope, Globe, ExternalLink, RefreshCw, BarChart3, Table, GitCompare } from 'lucide-react';
import { Message, FilterState, Hospital, ChatSession, Attachment, ArtifactData } from '../types';
import { streamMessageToAria } from '../services/geminiService';
import { ThinkingProcess } from './ThinkingProcess';
import { ArtifactView } from './ArtifactView';
import { HOSPITALS, calculateDistance, getCoordinatesForCity } from '../constants';
import ReactMarkdown from 'react-markdown';
// import { LanguageSelector } from './ui/LanguageSelector';
import { InteractiveBody } from './InteractiveBody';
import { LanguageSelector } from './ui/Languageselector';

interface ChatInterfaceProps {
  currentSession: ChatSession;
  sessions: ChatSession[];
  onSendMessage: (sessionId: string, text: string) => Promise<void>;
  onUpdateSessionMessages: (sessionId: string, messages: Message[]) => void;
  onSelectSession: (sessionId: string) => void;
  onNewSession: () => void;
  onApplyFilters: (filters: FilterState) => void;
  onClose: () => void;
  initialQuery?: string;
  activeFilters?: FilterState; 
  language?: string; 
  onLanguageChange: (lang: string) => void;
  isDeepFocusMode?: boolean; 
  onToggleDeepFocus?: () => void;
}

interface SuggestedAction {
  label: string;
  intent: string;
  context?: string;
}

const parseStreamedContent = (text: string) => {
  let thinking: string[] | undefined = undefined;
  let message = text;
  let suggestedFilters: any = undefined;
  let showConsultationCTA = false;
  let suggestedActions: SuggestedAction[] | undefined = undefined;

  const startTag = "<thinking>";
  const endTag = "</thinking>";

  // Use indexOf instead of regex for reliable partial stream detection
  let startIndex = text.indexOf(startTag);
  const endIndex = text.indexOf(endTag);

  if (startIndex !== -1) {
      // Thinking block has started
      let thinkContent = "";

      if (endIndex !== -1) {
          // Block is complete
          thinkContent = text.substring(startIndex + startTag.length, endIndex);

          // Remove the thinking block from the visible message
          const beforeTag = text.substring(0, startIndex);
          const afterTag = text.substring(endIndex + endTag.length);

          // Clean up "Thinking Process:" prefix if it exists before the tag
          const cleanBeforeTag = beforeTag.replace(/(\*\*|#)?\s*(Thinking|Reasoning|Process).*:?\s*$/i, '').trim();

          message = cleanBeforeTag + (cleanBeforeTag ? '\n\n' : '') + afterTag;

      } else {
          // Block is still streaming (open but not closed)
          thinkContent = text.substring(startIndex + startTag.length);

          // Hide everything including the prefix "Thinking:" if present
          const beforeTag = text.substring(0, startIndex);
          const cleanBeforeTag = beforeTag.replace(/(\*\*|#)?\s*(Thinking|Reasoning|Process).*:?\s*$/i, '').trim();

          message = cleanBeforeTag;
      }

      // Split into steps, handling newlines. Filter out empty lines unless it's just one empty line (loading start)
      const rawSteps = thinkContent.split('\n');
      const steps = rawSteps
          .map(s => s.trim())
          .filter(s => s.length > 0);

      thinking = steps;
  }

  // Safety check: Ensure message is always a string, not an array
  if (Array.isArray(message)) {
      message = message.join('\n');
  }
  if (typeof message !== 'string') {
      message = String(message || '');
  }

  // Helper function to parse actions JSON and extract suggestedActions
  const parseActionsJson = (jsonStr: string): boolean => {
      try {
          const parsed = JSON.parse(jsonStr);
          if (parsed.suggested_actions && Array.isArray(parsed.suggested_actions)) {
              suggestedActions = parsed.suggested_actions.map((action: any) => ({
                  label: action.label || '',
                  intent: action.intent || '',
                  context: action.context || action.description || ''
              }));
              // Check if any action has speak_to_team or book_consultation intent
              if (parsed.suggested_actions.some((a: any) =>
                  a.intent === 'speak_to_team' ||
                  a.intent === 'book_consultation' ||
                  a.intent === 'request_quote'
              )) {
                  showConsultationCTA = true;
              }
              return true;
          }
      } catch (e) {
          // Ignore parse errors
      }
      return false;
  };

  // Helper function to parse filters JSON
  const parseFiltersJson = (jsonStr: string): boolean => {
      try {
          const parsed = JSON.parse(jsonStr);
          if (parsed.country !== undefined || parsed.specialty !== undefined || parsed.aiListName !== undefined) {
              suggestedFilters = parsed;
              return true;
          }
      } catch (e) {
          // Ignore parse errors
      }
      return false;
  };

  // Extract Actions Block with <actions> tags
  const actionsStart = message.indexOf('<actions>');
  const actionsEnd = message.indexOf('</actions>');

  if (actionsStart !== -1) {
      if (actionsEnd !== -1) {
          let actionsContent = message.substring(actionsStart + 9, actionsEnd);
          actionsContent = actionsContent.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
          parseActionsJson(actionsContent);
          message = message.substring(0, actionsStart) + message.substring(actionsEnd + 10);
      } else {
          message = message.substring(0, actionsStart);
      }
  }

  // Extract Filters Block with <filters> tags
  const filterStart = message.indexOf('<filters>');
  const filterEnd = message.indexOf('</filters>');

  if (filterStart !== -1) {
      if (filterEnd !== -1) {
          let filterContent = message.substring(filterStart + 9, filterEnd);
          filterContent = filterContent.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
          parseFiltersJson(filterContent);
          message = message.substring(0, filterStart) + message.substring(filterEnd + 10);
      } else {
          message = message.substring(0, filterStart);
      }
  }

  // Remove "Suggested Actions" header followed by JSON (with or without code blocks)
  // Pattern: ### Suggested Actions or **Suggested Actions** or Suggested Actions followed by JSON
  const suggestedActionsHeaderRegex = /(?:#{1,3}\s*)?(?:\*\*)?Suggested Actions(?:\*\*)?\s*\n+(?:```(?:json)?\s*)?\{\s*"suggested_actions"\s*:\s*\[[\s\S]*?\]\s*\}(?:\s*```)?/gi;
  let headerMatch = message.match(suggestedActionsHeaderRegex);
  if (headerMatch) {
      headerMatch.forEach(match => {
          const jsonMatch = match.match(/\{[\s\S]*\}/);
          if (jsonMatch && !suggestedActions) {
              parseActionsJson(jsonMatch[0]);
          }
          message = message.replace(match, '').trim();
      });
  }

  // Remove "Filters" header followed by JSON
  const filtersHeaderRegex = /(?:#{1,3}\s*)?(?:\*\*)?Filters(?:\*\*)?\s*\n+(?:```(?:json)?\s*)?\{\s*"(?:country|specialty|aiListName|procedure|languages|minRating|accreditation|sortBy)"[\s\S]*?\}(?:\s*```)?/gi;
  let filtersHeaderMatch = message.match(filtersHeaderRegex);
  if (filtersHeaderMatch) {
      filtersHeaderMatch.forEach(match => {
          const jsonMatch = match.match(/\{[\s\S]*\}/);
          if (jsonMatch && !suggestedFilters) {
              parseFiltersJson(jsonMatch[0]);
          }
          message = message.replace(match, '').trim();
      });
  }

  // Remove markdown code blocks containing suggested_actions JSON
  const codeBlockActionsRegex = /```(?:json)?\s*\{\s*"suggested_actions"\s*:\s*\[[\s\S]*?\]\s*\}\s*```/gi;
  let codeBlockMatch = message.match(codeBlockActionsRegex);
  if (codeBlockMatch) {
      codeBlockMatch.forEach(match => {
          const jsonStr = match.replace(/```(?:json)?\s*/gi, '').replace(/\s*```/g, '').trim();
          if (!suggestedActions) {
              parseActionsJson(jsonStr);
          }
          message = message.replace(match, '').trim();
      });
  }

  // Remove markdown code blocks containing filters JSON
  const codeBlockFiltersRegex = /```(?:json)?\s*\{\s*"(?:country|specialty|aiListName|procedure)"[\s\S]*?\}\s*```/gi;
  let codeBlockFiltersMatch = message.match(codeBlockFiltersRegex);
  if (codeBlockFiltersMatch) {
      codeBlockFiltersMatch.forEach(match => {
          const jsonStr = match.replace(/```(?:json)?\s*/gi, '').replace(/\s*```/g, '').trim();
          if (!suggestedFilters) {
              parseFiltersJson(jsonStr);
          }
          message = message.replace(match, '').trim();
      });
  }

  // Catch raw JSON actions without code blocks or tags
  const rawActionsJsonRegex = /\{\s*"suggested_actions"\s*:\s*\[[\s\S]*?\]\s*\}/g;
  let rawActionsMatches = message.match(rawActionsJsonRegex);
  if (rawActionsMatches) {
      rawActionsMatches.forEach(match => {
          if (!suggestedActions) {
              parseActionsJson(match);
          }
          message = message.replace(match, '').trim();
      });
  }

  // Catch raw filters JSON without code blocks or tags
  const rawFiltersJsonRegex = /\{\s*"(?:country|specialty|aiListName)"\s*:\s*(?:"[^"]*"|null)[\s\S]*?\}/g;
  let rawFiltersMatches = message.match(rawFiltersJsonRegex);
  if (rawFiltersMatches) {
      rawFiltersMatches.forEach(match => {
          if (!suggestedFilters) {
              parseFiltersJson(match);
          }
          message = message.replace(match, '').trim();
      });
  }

  // Extract CTA Tag (legacy support)
  const ctaStart = message.indexOf('<cta>');
  const ctaEnd = message.indexOf('</cta>');

  if (ctaStart !== -1 && ctaEnd !== -1) {
      showConsultationCTA = true;
      message = message.substring(0, ctaStart) + message.substring(ctaEnd + 6);
  } else if (ctaStart !== -1) {
      message = message.substring(0, ctaStart);
  }

  // Final cleanup - remove any trailing whitespace, leftover tags, headers, and orphaned code block markers
  message = message
      .replace(/<\/actions>/g, '')
      .replace(/<\/filters>/g, '')
      .replace(/<\/cta>/g, '')
      .replace(/<actions>/g, '')
      .replace(/<filters>/g, '')
      .replace(/<cta>/g, '')
      .replace(/```json\s*```/g, '')
      .replace(/```\s*```/g, '')
      // Remove orphaned "Suggested Actions" or "Filters" headers
      .replace(/(?:#{1,3}\s*)?(?:\*\*)?Suggested Actions(?:\*\*)?\s*$/gim, '')
      .replace(/(?:#{1,3}\s*)?(?:\*\*)?Filters(?:\*\*)?\s*$/gim, '')
      .trim();

  // Remove any trailing empty lines or excessive whitespace
  message = message.replace(/\n{3,}/g, '\n\n').trim();

  return { thinking, message, suggestedFilters, showConsultationCTA, suggestedActions };
};

// Mock User Interface
interface UserProfile {
  name: string;
  email: string;
  picture: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  currentSession, 
  sessions,
  onSendMessage, 
  onUpdateSessionMessages,
  onSelectSession,
  onNewSession,
  onApplyFilters, 
  onClose,
  initialQuery,
  activeFilters,
  language = 'English',
  onLanguageChange,
  isDeepFocusMode = false,
  onToggleDeepFocus
}) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedFile, setSelectedFile] = useState<Attachment | null>(null);

  // Deep Focus Intro State - Shows body map on entry
  const [showDeepFocusIntro, setShowDeepFocusIntro] = useState(false);

  // Artifact State - Claude-like side panel
  const [activeArtifact, setActiveArtifact] = useState<ArtifactData | null>(null);

  // Auth State
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasTriggeredInitial = useRef(false);

  // Trigger Deep Focus Intro when mode is toggled ON
  useEffect(() => {
    if (isDeepFocusMode) {
      // Only show intro if we haven't just sent a body part message (optional heuristic)
      // For now, always showing it when entering the mode provides the requested "first time" feel
      setShowDeepFocusIntro(true);
    } else {
      setShowDeepFocusIntro(false);
    }
  }, [isDeepFocusMode]);

  const scrollToBottom = () => {
    // Slight delay ensures DOM is fully rendered
    setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  useEffect(() => {
    if (!showDeepFocusIntro) {
      scrollToBottom();
    }
  }, [currentSession.messages, isLoading, showHistory, showDeepFocusIntro]);

  // Load User from LocalStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('medifly_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse user", e);
      }
    }
  }, []);

  // Handle Initial Query from Hero Page
  useEffect(() => {
    if (initialQuery && currentSession.messages.length === 0 && !hasTriggeredInitial.current) {
        hasTriggeredInitial.current = true;
        handleSend(initialQuery);
    }
  }, [initialQuery, currentSession.id]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 40) + 'px';
    }
  }, [input]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert to Base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      setSelectedFile({
        name: file.name,
        type: file.type,
        data: base64String
      });
    };
    reader.readAsDataURL(file);
    
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const handleGoogleLogin = () => {
    setIsLoggingIn(true);
    // Simulate API delay
    setTimeout(() => {
      const mockUser: UserProfile = {
        name: 'Alex Morgan',
        email: 'alex.morgan@gmail.com',
        picture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'
      };
      setUser(mockUser);
      localStorage.setItem('medifly_user', JSON.stringify(mockUser));
      setIsLoggingIn(false);
    }, 800);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('medifly_user');
  };

  const handleBodyPartSelect = (part: string) => {
      // Hide intro once selected
      setShowDeepFocusIntro(false);
      
      // Trigger AI logic for the specific body part
      handleSend(`[System Injection]: The user has identified a potential issue in the **${part}**. Please acknowledge this, act as a specialized clinician for this area, and ask 3-4 specific triage questions to narrow down the symptoms. Keep the tone empathetic and professional.`);
  };

  const handleSend = async (text: string) => {
    if (!text.trim() && !selectedFile) return;
    
    // Ensure intro is closed if sending message manually
    if (isDeepFocusMode) setShowDeepFocusIntro(false);

    // Add user message
    // If it's a system injection (hidden prompt), we might want to display something different or hide it
    // For now, we'll display a formatted version if it's the body part selection
    let displayContent = text;
    let role: 'user' | 'ai' = 'user';
    
    if (text.startsWith('[System Injection]')) {
        const partMatch = text.match(/\*\*(.*?)\*\*/);
        const part = partMatch ? partMatch[1] : 'selected area';
        displayContent = `I have a concern regarding my ${part}.`;
    }

    const userMsg: Message = { 
        id: Date.now().toString(), 
        role: role, 
        content: displayContent,
        // timestamp: Date.now(),
        attachment: selectedFile || undefined
    };

    const updatedMessages = [...currentSession.messages, userMsg];
    
    // Optimistic update
    onUpdateSessionMessages(currentSession.id, updatedMessages);
    
    setInput('');
    setSelectedFile(null); // Clear selected file after sending
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    
    // Create placeholder AI message
    const aiMsgId = (Date.now() + 1).toString();
    const placeholderMsg: Message = {
        id: aiMsgId,
        // timestamp: Date.now(),
        role: 'ai',
        content: '',
        thinking: undefined
    };
    const messagesWithPlaceholder = [...updatedMessages, placeholderMsg];
    onUpdateSessionMessages(currentSession.id, messagesWithPlaceholder);
    
    setIsLoading(true);

    try {
        // Prepare history for API
        const history = updatedMessages.slice(0, -1).map(m => {
            const parts: any[] = [];
            
            // Only add text part if content exists to avoid empty text errors
            if (m.content) {
                parts.push({ text: m.content });
            }

            // Add attachment part if exists
            if (m.attachment) {
                parts.push({
                    inlineData: {
                        mimeType: m.attachment.type,
                        data: m.attachment.data
                    }
                });
            }

            // Fallback for empty messages (shouldn't happen in valid flow but robust for API)
            if (parts.length === 0) {
                parts.push({ text: ' ' });
            }

            return {
                role: (m.role === 'user' ? 'user' : 'model') as 'user' | 'model',
                parts: parts
            };
        });

        // Pass the new message (text + attachment) to service
        // Pass isDeepFocusMode flag
        const stream = streamMessageToAria(history, text, userMsg.attachment, language, isDeepFocusMode);
        let fullText = '';

        // Store accumulated sources and search queries
        let accumulatedSources: any[] = [];
        let accumulatedSearchQueries: string[] = [];
        let currentIsSearching = false;

        for await (const chunk of stream) {
            if (typeof chunk === 'string') {
               // Backwards compat or error string
               fullText += chunk;
            } else {
               if (chunk.text) fullText += chunk.text;
               if (chunk.sources) {
                   // Append new sources avoiding duplicates
                   const newSources = chunk.sources.filter(ns => !accumulatedSources.some(as => as.uri === ns.uri));
                   accumulatedSources = [...accumulatedSources, ...newSources];
               }
               if (chunk.searchQueries) {
                   // Append new search queries avoiding duplicates
                   const newQueries = chunk.searchQueries.filter(q => !accumulatedSearchQueries.includes(q));
                   accumulatedSearchQueries = [...accumulatedSearchQueries, ...newQueries];
               }
               if (chunk.isSearching !== undefined) {
                   currentIsSearching = chunk.isSearching;
               }
            }

            const parsed = parseStreamedContent(fullText);

            // Update the specific AI message in the current session
            onUpdateSessionMessages(currentSession.id, messagesWithPlaceholder.map(m => {
                if (m.id === aiMsgId) {
                    // Preserve thinking if it was already set (don't let it become undefined)
                    const thinkingToUse = parsed.thinking && parsed.thinking.length > 0
                        ? parsed.thinking
                        : m.thinking; // Keep previous thinking if new one is empty/undefined

                    // Preserve suggestedActions if already set
                    const actionsToUse = parsed.suggestedActions && parsed.suggestedActions.length > 0
                        ? parsed.suggestedActions
                        : m.suggestedActions;

                    return {
                        ...m,
                        content: parsed.message,
                        thinking: thinkingToUse,
                        showConsultationCTA: parsed.showConsultationCTA,
                        suggestedActions: actionsToUse,
                        sources: accumulatedSources.length > 0 ? accumulatedSources : undefined,
                        searchQueries: accumulatedSearchQueries.length > 0 ? accumulatedSearchQueries : undefined,
                        isSearching: currentIsSearching,
                        suggestedFilters: parsed.suggestedFilters
                            ? {
                                searchQuery: '',
                                country: parsed.suggestedFilters.country,
                                specialty: parsed.suggestedFilters.specialty,
                                aiListName: parsed.suggestedFilters.aiListName,
                                languages: parsed.suggestedFilters.languages,
                                minRating: parsed.suggestedFilters.minRating,
                                accreditation: parsed.suggestedFilters.accreditation,
                                sortBy: parsed.suggestedFilters.sortBy
                            }
                            : undefined
                    };
                }
                return m;
            }));
        }
    } catch (error) {
        console.error("Streaming error:", error);
    } finally {
        setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSend(input);
      }
  };

  const handleUpdateMarketplace = (msgId: string, filters: FilterState) => {
    onApplyFilters(filters);
  };

  const handleToggleInlineResults = (msgId: string, filters: FilterState, currentResults: Hospital[] | undefined) => {
     if (currentResults) {
         // Hide Logic
         const newMessages = currentSession.messages.map(m => 
            m.id === msgId ? { ...m, inlineResults: undefined, inlineResultTotalCount: undefined } : m
         );
         onUpdateSessionMessages(currentSession.id, newMessages);
     } else {
         // Show Logic
         // 1. Get all matches first
         const allMatched = HOSPITALS.filter(h => {
             const matchCountry = !filters.country || h.country === filters.country;
             const matchSpecialty = !filters.specialty || h.specialties.includes(filters.specialty);
             return matchCountry && matchSpecialty;
         });
         
         // 2. Slice to max 5 for chat display
         const displayResults = allMatched.slice(0, 5); 
    
         const newMessages = currentSession.messages.map(m => 
            m.id === msgId ? { ...m, inlineResults: displayResults, inlineResultTotalCount: allMatched.length } : m
         );
         onUpdateSessionMessages(currentSession.id, newMessages);
     }
  };

  // Group sessions by day (simplified)
  const sortedSessions = [...sessions].sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div className="flex h-full bg-white z-20 relative overflow-hidden transition-all duration-700">
      {/* Main Chat Area */}
      <div className={`flex flex-col h-full flex-1 min-w-0 transition-all duration-500 ${activeArtifact ? 'md:w-1/2' : 'w-full'}`}>
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 flex items-center justify-between bg-white z-50 border-b border-slate-50 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-2">
            <button 
                onClick={() => setShowHistory(!showHistory)}
                className={`p-2 rounded-lg transition-colors ${showHistory ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                title="History"
            >
                {showHistory ? <PanelLeftClose className="w-5 h-5" /> : <History className="w-5 h-5" />}
            </button>
            <button 
                onClick={() => { setShowHistory(false); onNewSession(); }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors font-semibold text-sm group"
            >
                <Plus className="w-4 h-4 text-[#6495ED]" />
                <span className="text-slate-700">New Chat</span>
            </button>
        </div>
        
        {/* Deep Focus Title */}
        {isDeepFocusMode && (
             <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-2 px-4 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full animate-in fade-in slide-in-from-top-4">
                 <Telescope className="w-4 h-4 text-indigo-600" />
                 <span className="text-xs font-bold text-indigo-900 uppercase tracking-widest">Deep Focus Active</span>
             </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-2">
            <div className="scale-90 origin-right">
                <LanguageSelector selectedLanguage={language} onLanguageChange={onLanguageChange} />
            </div>
            <div className="h-6 w-px bg-slate-200 mx-1"></div>
            <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors"
                title="Close Sidebar"
            >
            <PanelLeftClose className="w-5 h-5" />
            </button>
        </div>
      </div>

      <div className="flex-1 flex min-h-0 relative">
        
        {/* History Menu Overlay */}
        <div className={`
            absolute inset-y-0 left-0 w-64 bg-slate-50 border-r border-slate-200 z-40 transform transition-transform duration-300 ease-in-out shadow-xl
            ${showHistory ? 'translate-x-0' : '-translate-x-full'}
        `}>
            <div className="p-4 h-full flex flex-col">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Recent Chats</h3>
                <div className="space-y-2 overflow-y-auto flex-1 pr-2">
                    {sortedSessions.map(session => (
                        <button
                            key={session.id}
                            onClick={() => {
                                onSelectSession(session.id);
                                setShowHistory(false);
                            }}
                            className={`w-full text-left p-3 rounded-xl text-sm transition-all flex items-start gap-3 group ${currentSession.id === session.id ? 'bg-white shadow-sm border border-slate-200 ring-1 ring-slate-200' : 'hover:bg-slate-200/50'}`}
                        >
                            <MessageSquare className={`w-4 h-4 mt-0.5 ${currentSession.id === session.id ? 'text-[#6495ED]' : 'text-slate-400'}`} />
                            <div className="flex-1 min-w-0">
                                <div className={`font-medium truncate ${currentSession.id === session.id ? 'text-slate-900' : 'text-slate-700'}`}>
                                    {session.title || 'New Conversation'}
                                </div>
                                <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {new Date(session.updatedAt).toLocaleDateString()}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* Messages Area */}
        <div className={`flex-1 flex flex-col min-w-0 bg-white relative transition-all duration-500 ${isDeepFocusMode ? 'max-w-4xl mx-auto w-full' : ''}`}>
            
            {/* Overlay when history is open on mobile/tablet */}
            {showHistory && (
                <div 
                    className="absolute inset-0 bg-white/60 backdrop-blur-sm z-30 transition-opacity"
                    onClick={() => setShowHistory(false)}
                />
            )}
            
            {/* Deep Focus Intro Overlay - FORCES BODY MAP ON ENTRY */}
            {isDeepFocusMode && showDeepFocusIntro && (
                <div className="absolute inset-0 z-40 bg-white animate-in fade-in duration-500 flex flex-col items-center justify-center p-4">
                    <div className="w-full max-w-4xl flex flex-col md:flex-row items-center gap-12 -mt-16">
                        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left space-y-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-2xl shadow-lg flex items-center justify-center animate-bounce-slow">
                                <Telescope className="w-8 h-8 text-indigo-600" />
                            </div>
                            <div className="space-y-3">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-full border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider">
                                    Deep Focus Mode Active
                                </div>
                                <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Interactive Diagnostic</h2>
                                <p className="text-slate-500 text-lg leading-relaxed max-w-sm">
                                    I'm switching to clinical specialist mode. Tap the area of concern on the body map below to begin a targeted analysis.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 text-slate-600 text-xs font-medium border border-slate-100">
                                    <Globe className="w-3.5 h-3.5" /> Research Backed
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 text-slate-600 text-xs font-medium border border-slate-100">
                                    <Sparkles className="w-3.5 h-3.5" /> Clinical Reasoning
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => setShowDeepFocusIntro(false)}
                                className="mt-4 text-xs font-semibold text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-1 group"
                            >
                                Skip diagnostic & go to chat <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                        
                        <div className="flex-1 w-full flex justify-center relative">
                            {/* Interactive Body Component */}
                            <InteractiveBody onSelectPart={handleBodyPartSelect} />
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 md:px-6 pb-4 w-full scroll-smooth relative" id="chat-scroller">
                
                {/* Zero State / Onboarding (Standard Mode only since Deep Focus has overlay) */}
                {currentSession.messages.length === 0 && !isLoading && !isDeepFocusMode && (
                <div className="flex flex-col items-center justify-center min-h-[80%] w-full animate-in fade-in zoom-in-95 duration-500 py-10">
                    <div className="flex flex-col items-center text-center max-w-lg">
                        <div className={`w-14 h-14 bg-gradient-to-br from-[#F4F0EE] to-white border border-slate-100 rounded-2xl shadow-lg flex items-center justify-center mb-6`}>
                            <Sparkles className="w-7 h-7 text-[#6495ED]" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">
                            How can I help you today?
                        </h2>
                        <p className="text-slate-500 max-w-xs leading-relaxed mb-8">
                            I can help you find top-rated hospitals, compare treatments, or analyze your medical documents.
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                            <button onClick={() => handleSend("Best hospitals for heart surgery in Bangkok")} className="text-left p-3 rounded-xl border border-slate-100 bg-[#F4F0EE]/50 hover:bg-[#F4F0EE] hover:border-[#B2D7FF] hover:shadow-sm transition-all text-sm text-slate-700">
                                🏥 Heart surgery in Bangkok
                            </button>
                            <button onClick={() => handleSend("Analyze this lab report for me")} className="text-left p-3 rounded-xl border border-slate-100 bg-[#F4F0EE]/50 hover:bg-[#F4F0EE] hover:border-[#B2D7FF] hover:shadow-sm transition-all text-sm text-slate-700">
                                📄 Analyze Lab Report
                            </button>
                            {/* Quick Access to Deep Focus if needed */}
                            <button onClick={onToggleDeepFocus} className="sm:col-span-2 text-left p-3 rounded-xl border border-indigo-100 bg-indigo-50/50 hover:bg-indigo-50 hover:border-indigo-200 hover:shadow-sm transition-all text-sm text-indigo-700 flex items-center justify-between group">
                                <span className="flex items-center gap-2"><Telescope className="w-4 h-4"/> Try Deep Focus Diagnostic</span>
                                <ArrowRight className="w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
                )}
                
                {currentSession.messages.map((msg) => (
                <div key={msg.id} className={`group ${msg.role === 'user' ? 'flex justify-end' : 'flex flex-col items-start'} mb-8`}>
                    
                    {/* User Message - Blue Bubble */}
                    {msg.role === 'user' && (
                        <div className="flex flex-col items-end max-w-[85%]">
                            {msg.attachment && (
                                <div className="mb-2 bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center gap-3 w-64 shadow-sm">
                                    <div className="w-10 h-10 bg-[#B2D7FF]/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                        {msg.attachment.type.startsWith('image/') ? (
                                            <ImageIcon className="w-5 h-5 text-[#6495ED]" />
                                        ) : (
                                            <FileText className="w-5 h-5 text-[#6495ED]" />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="text-xs font-semibold text-slate-700 truncate">{msg.attachment.name}</div>
                                        <div className="text-[10px] text-slate-400 uppercase">Document</div>
                                    </div>
                                </div>
                            )}
                            {msg.content && (
                                <div className="bg-[#B2D7FF] px-5 py-3.5 rounded-3xl rounded-br-sm text-slate-900 font-medium text-[15px] leading-relaxed shadow-sm">
                                    {msg.content}
                                </div>
                            )}
                        </div>
                    )}

                    {/* AI Message - Soft Brown Bubble/Container */}
                    {msg.role === 'ai' && (
                        <div className="w-full max-w-full flex gap-4 pr-2">
                            <div className={`w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0 mt-1 shadow-sm ${isDeepFocusMode ? 'bg-indigo-100 border-indigo-200' : 'bg-[#B2D7FF]/30 border-[#B2D7FF]'}`}>
                                {isDeepFocusMode ? <Telescope className="w-4 h-4 text-indigo-600" /> : <Sparkles className="w-4 h-4 text-[#6495ED]" />}
                            </div>
                            
                            <div className="flex-1 space-y-2 min-w-0">
                                {/* Thinking Process - Always show if thinking exists, or during loading for current message */}
                                {(() => {
                                    const hasThinking = msg.thinking && (
                                        (Array.isArray(msg.thinking) && msg.thinking.length > 0) ||
                                        (typeof msg.thinking === 'string' && msg.thinking.trim().length > 0)
                                    );
                                    const isCurrentStreamingMessage = isLoading && msg.id === currentSession.messages[currentSession.messages.length - 1]?.id;
                                    const shouldShowThinking = hasThinking || isCurrentStreamingMessage;

                                    if (!shouldShowThinking) return null;

                                    // Normalize thinking to array format
                                    let thinkingSteps: string[] = [];
                                    if (Array.isArray(msg.thinking)) {
                                        thinkingSteps = msg.thinking;
                                    } else if (typeof msg.thinking === 'string' && msg.thinking.trim()) {
                                        thinkingSteps = msg.thinking.split('\n').map(s => s.trim()).filter(s => s.length > 0);
                                    }

                                    return (
                                        <ThinkingProcess
                                            steps={thinkingSteps}
                                            isStreaming={isCurrentStreamingMessage && !msg.content}
                                        />
                                    );
                                })()}
                                
                                {/* Markdown Content - Wrapped in Soft Brown */}
                                {msg.content && typeof msg.content === 'string' && (
                                    <div className={`p-5 rounded-2xl rounded-tl-sm text-slate-900 shadow-sm border ${isDeepFocusMode ? 'bg-white border-indigo-50' : 'bg-[#F4F0EE] border-slate-100/50'}`}>
                                        <div className="prose prose-slate prose-sm max-w-none prose-p:leading-7 prose-li:marker:text-[#6495ED] prose-headings:text-slate-900 prose-headings:font-bold prose-strong:text-slate-900">
                                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                                        </div>
                                        
                                        {/* Search Queries Display for Deep Focus Mode */}
                                        {msg.searchQueries && msg.searchQueries.length > 0 && (
                                            <div className="mt-4 pt-3 border-t border-indigo-100/50">
                                                <h4 className="text-xs font-semibold text-indigo-600/70 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                                    <Search className="w-3 h-3" /> Searched For
                                                </h4>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {msg.searchQueries.map((query, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="inline-flex items-center px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium border border-indigo-100"
                                                        >
                                                            {query}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Citations for Deep Focus Mode */}
                                        {msg.sources && msg.sources.length > 0 && (
                                            <div className="mt-4 pt-3 border-t border-slate-100">
                                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                                    <Globe className="w-3 h-3" /> Sources ({msg.sources.length})
                                                </h4>
                                                <div className="grid gap-2">
                                                    {msg.sources.map((source, idx) => (
                                                        <a
                                                            key={idx}
                                                            href={source.uri}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors group text-xs border border-slate-200"
                                                        >
                                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold">
                                                                    {idx + 1}
                                                                </span>
                                                                <span className="font-medium text-slate-700 truncate">{source.title}</span>
                                                            </div>
                                                            <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 flex-shrink-0 ml-2" />
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Artifact Button - Claude-style */}
                                {msg.artifact && (
                                    <button
                                        onClick={() => setActiveArtifact(msg.artifact!)}
                                        className={`mt-3 flex items-center gap-3 w-full p-4 rounded-xl border-2 transition-all group/artifact animate-in fade-in slide-in-from-top-2 duration-300
                                            ${activeArtifact?.title === msg.artifact.title
                                                ? 'border-indigo-300 bg-indigo-50 shadow-md'
                                                : 'border-slate-200 bg-white hover:border-indigo-200 hover:bg-indigo-50/50 hover:shadow-md'
                                            }
                                        `}
                                    >
                                        <div className={`p-2.5 rounded-lg ${
                                            msg.artifact.type === 'chart' ? 'bg-emerald-100 text-emerald-600' :
                                            msg.artifact.type === 'comparison' ? 'bg-indigo-100 text-indigo-600' :
                                            msg.artifact.type === 'table' ? 'bg-blue-100 text-blue-600' :
                                            'bg-slate-100 text-slate-600'
                                        }`}>
                                            {msg.artifact.type === 'chart' && <BarChart3 className="w-5 h-5" />}
                                            {msg.artifact.type === 'comparison' && <GitCompare className="w-5 h-5" />}
                                            {msg.artifact.type === 'table' && <Table className="w-5 h-5" />}
                                        </div>
                                        <div className="flex-1 text-left">
                                            <p className="font-semibold text-slate-900 text-sm">{msg.artifact.title}</p>
                                            <p className="text-xs text-slate-500 capitalize">{msg.artifact.type} visualization</p>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover/artifact:text-indigo-500 group-hover/artifact:translate-x-1 transition-all" />
                                    </button>
                                )}

                                {/* WhatsApp CTA Button - Updated to Premium Dark Style */}
                                {msg.showConsultationCTA && (
                                    <div className="mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <a
                                            href="https://wa.me/6281291690707?text=Hello%2C%20I%20was%20chatting%20with%20Aria%20about%20my%20medical%20needs%20and%20would%20like%20more%20insight."
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center gap-2.5 bg-[#1C1C1C] text-white hover:bg-zinc-800 px-6 py-3 rounded-xl font-semibold shadow-md transition-all active:scale-95 group/wa w-full sm:w-auto"
                                        >
                                            <MessageCircle className="w-4 h-4 fill-white/20" />
                                            <span>Connect with a Care Coordinator</span>
                                            <ArrowRight className="w-4 h-4 opacity-70 group-hover/wa:translate-x-1 transition-transform" />
                                        </a>
                                    </div>
                                )}

                                {/* Suggested Actions - Clean GPT-like design */}
                                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                                    <div className="mt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <div className="flex flex-wrap gap-2">
                                            {msg.suggestedActions.map((action, idx) => {
                                                // Special handling for speak_to_team - open WhatsApp
                                                if (action.intent === 'speak_to_team' || action.intent === 'book_consultation') {
                                                    return (
                                                        <a
                                                            key={idx}
                                                            href="https://wa.me/6281291690707?text=Hello%2C%20I%20was%20chatting%20with%20Aria%20about%20my%20medical%20needs%20and%20would%20like%20more%20insight."
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="group flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-medium text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300 transition-all shadow-sm"
                                                        >
                                                            <MessageCircle className="w-3.5 h-3.5" />
                                                            <span>{action.label}</span>
                                                            <ExternalLink className="w-3 h-3 text-emerald-500 group-hover:text-emerald-600" />
                                                        </a>
                                                    );
                                                }
                                                return (
                                                    <button
                                                        key={idx}
                                                        onClick={() => handleSend(action.context || action.label)}
                                                        className="group flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 transition-all shadow-sm"
                                                    >
                                                        <span>{action.label}</span>
                                                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Interactive Suggestions Pills (Synced with Global State) */}
                                {msg.suggestedFilters && (
                                    <div className="mt-2 flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2 duration-300 pl-1">
                                        {/* Primary "Show List" Pill */}
                                        {(() => {
                                            const isActive = activeFilters?.aiListName === msg.suggestedFilters?.aiListName;
                                            return (
                                                <button
                                                    onClick={() => handleUpdateMarketplace(msg.id, msg.suggestedFilters!)}
                                                    className={`
                                                        flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm border
                                                        ${isActive 
                                                            ? 'bg-[#B2D7FF] border-[#B2D7FF] text-slate-900 ring-1 ring-[#B2D7FF]' 
                                                            : 'bg-white border-slate-200 hover:border-[#B2D7FF] hover:bg-[#F4F0EE] text-slate-700'}
                                                    `}
                                                >
                                                    {isActive ? <Check className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
                                                    {isActive ? 'Viewing: ' : 'Show: '} 
                                                    <span className="font-bold">
                                                        {msg.suggestedFilters.aiListName || 'Hospitals in Marketplace'}
                                                    </span>
                                                </button>
                                            );
                                        })()}
                                        
                                        {/* Secondary "Show Here" Pill (Toggle) */}
                                        <button
                                            onClick={() => handleToggleInlineResults(msg.id, msg.suggestedFilters!, msg.inlineResults)}
                                            className={`
                                                flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-medium transition-all shadow-sm
                                                ${msg.inlineResults 
                                                    ? 'bg-slate-100 border-slate-300 text-slate-900' 
                                                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900'}
                                            `}
                                        >
                                            {msg.inlineResults ? <ChevronUp className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                            {msg.inlineResults ? 'Hide details' : 'Show here'}
                                        </button>
                                    </div>
                                )}

                                {/* Inline Results */}
                                {msg.inlineResults && (
                                    <div className="mt-4 grid gap-3 w-full sm:max-w-md animate-in fade-in slide-in-from-top-2 duration-300">
                                        {msg.inlineResults.map(h => {
                                            let distance = null;
                                            if (activeFilters?.userOrigin) {
                                                const coords = getCoordinatesForCity(activeFilters.userOrigin);
                                                if (coords) {
                                                    distance = calculateDistance(coords.lat, coords.lng, h.coordinates.lat, h.coordinates.lng);
                                                }
                                            }
                                            
                                            return (
                                            <div key={h.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:border-[#B2D7FF] hover:shadow-md transition-all cursor-pointer group/card" onClick={() => handleUpdateMarketplace(msg.id, msg.suggestedFilters!)}>
                                                <img src={h.imageUrl} alt={h.name} className="w-16 h-16 rounded-lg object-cover" />
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-slate-900 text-sm truncate">{h.name}</h4>
                                                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                                                        <MapPin className="w-3 h-3" /> {h.country}
                                                        <span className="text-slate-300">|</span>
                                                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {h.rating}
                                                    </div>
                                                    <div className="flex items-center justify-between gap-2 mt-1">
                                                        <div className="flex items-baseline gap-1 truncate">
                                                            <span className="font-medium text-slate-900 text-xs">{h.priceRange}</span>
                                                            <span className="text-slate-400 text-[10px]">est. range</span>
                                                        </div>
                                                        {distance !== null && (
                                                            <div className="flex items-center gap-0.5 text-[10px] text-slate-500 shrink-0 bg-slate-50 px-1.5 py-0.5 rounded-sm border border-slate-100">
                                                                <Plane className="w-2.5 h-2.5" />
                                                                <span>~{distance.toLocaleString()} km</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <ArrowRight className="w-4 h-4 text-slate-300 group-hover/card:text-[#6495ED] -ml-2 mr-2 transition-colors" />
                                            </div>
                                            );
                                        })}
                                        
                                        {/* "View More" Button if there are remaining results */}
                                        {(msg.inlineResultTotalCount || 0) > msg.inlineResults.length && (
                                            <button
                                                onClick={() => handleUpdateMarketplace(msg.id, msg.suggestedFilters!)}
                                                className="w-full py-3 bg-[#F4F0EE] hover:bg-[#e8e4e2] text-slate-800 font-medium rounded-xl border border-dashed border-slate-300 hover:border-slate-400 transition-all text-sm flex items-center justify-center gap-2 mt-1"
                                            >
                                                <Search className="w-4 h-4" />
                                                Search {(msg.inlineResultTotalCount || 0) - msg.inlineResults.length}+ more in marketplace
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                ))}
                
                {/* Searching Indicator for Deep Focus Mode */}
                {isLoading && isDeepFocusMode && currentSession.messages.length > 0 && currentSession.messages[currentSession.messages.length - 1].isSearching && (
                <div className="flex gap-4 mb-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0 bg-indigo-100 border-indigo-200">
                        <Telescope className="w-4 h-4 text-indigo-600 animate-pulse" />
                    </div>
                    <div className="flex-1">
                        <div className="inline-flex items-center gap-3 px-4 py-3 rounded-2xl rounded-tl-sm bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100">
                            <div className="relative w-5 h-5">
                                <Globe className="w-5 h-5 text-indigo-500 animate-spin" style={{ animationDuration: '3s' }} />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Search className="w-2.5 h-2.5 text-indigo-600" />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-indigo-700">Searching the web...</span>
                                <span className="text-xs text-indigo-500/70">Finding the latest medical research</span>
                            </div>
                        </div>
                    </div>
                </div>
                )}

                {/* Simple Loading Dot */}
                {isLoading && currentSession.messages.length > 0 && !currentSession.messages[currentSession.messages.length - 1].content && currentSession.messages[currentSession.messages.length - 1].thinking === undefined && !currentSession.messages[currentSession.messages.length - 1].isSearching && (
                <div className="flex gap-4 mb-8">
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center animate-pulse flex-shrink-0 ${isDeepFocusMode ? 'bg-indigo-100 border-indigo-200' : 'bg-[#B2D7FF]/30 border-[#B2D7FF]'}`}>
                        {isDeepFocusMode ? <Telescope className="w-4 h-4 text-indigo-600" /> : <Sparkles className="w-4 h-4 text-[#6495ED]" />}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                        <span className={`w-2 h-2 rounded-full animate-bounce ${isDeepFocusMode ? 'bg-indigo-400' : 'bg-slate-400'}`} style={{ animationDelay: '0ms' }}></span>
                        <span className={`w-2 h-2 rounded-full animate-bounce ${isDeepFocusMode ? 'bg-indigo-400' : 'bg-slate-400'}`} style={{ animationDelay: '150ms' }}></span>
                        <span className={`w-2 h-2 rounded-full animate-bounce ${isDeepFocusMode ? 'bg-indigo-400' : 'bg-slate-400'}`} style={{ animationDelay: '300ms' }}></span>
                    </div>
                </div>
                )}
                
                <div className="h-32" ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className={`absolute bottom-0 left-0 w-full z-20 px-4 md:px-6 pb-6 pt-12 bg-gradient-to-t pointer-events-none ${isDeepFocusMode ? 'from-white via-white/90' : 'from-white via-white/90'} to-transparent`}>
                <div className="max-w-3xl mx-auto relative pointer-events-auto">

                    {/* Controls Row: Deep Focus & Login */}
                    <div className="flex justify-center items-center gap-3 mb-3 animate-in fade-in slide-in-from-bottom-2">
                        
                        {/* Deep Focus Toggle */}
                        <button
                            onClick={onToggleDeepFocus}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-xs font-semibold shadow-sm
                                ${isDeepFocusMode 
                                    ? 'bg-indigo-600 text-white border-indigo-600 ring-2 ring-indigo-200' 
                                    : 'bg-white/90 border-slate-200 text-slate-600 hover:bg-white hover:text-indigo-600'}
                            `}
                        >
                            <Telescope className="w-3.5 h-3.5" />
                            {isDeepFocusMode ? 'Deep Focus On' : 'Deep Focus'}
                        </button>

                        <div className="h-4 w-px bg-slate-300/50 mx-1"></div>

                        {/* Login / Profile Section */}
                        {!user ? (
                            <button
                                onClick={handleGoogleLogin}
                                disabled={isLoggingIn}
                                className="flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-full shadow-sm hover:bg-white hover:shadow-md transition-all text-xs font-medium text-slate-700 group"
                            >
                                {isLoggingIn ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />
                                ) : (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                    </svg>
                                )}
                                <span>Sign in</span>
                            </button>
                        ) : (
                            <div className="flex items-center gap-2 p-1 pr-3 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-full shadow-sm">
                                <img src={user.picture} alt={user.name} className="w-5 h-5 rounded-full object-cover" />
                                <span className="text-xs font-semibold text-slate-700">{user.name}</span>
                                <div className="w-px h-3 bg-slate-200 mx-1"></div>
                                <button 
                                    onClick={handleLogout}
                                    className="text-slate-400 hover:text-red-500 transition-colors"
                                    title="Sign out"
                                >
                                    <LogOut className="w-3 h-3" />
                                </button>
                            </div>
                        )}
                    </div>
                    
                    {/* Selected File Preview */}
                    {selectedFile && (
                        <div className="mb-2 mx-1 p-2 bg-white rounded-lg border border-slate-200 shadow-sm inline-flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
                             <div className="w-8 h-8 bg-slate-100 rounded-md flex items-center justify-center text-slate-500">
                                {selectedFile.type.startsWith('image/') ? <ImageIcon className="w-4 h-4"/> : <FileText className="w-4 h-4"/>}
                             </div>
                             <div className="flex flex-col">
                                 <span className="text-xs font-semibold text-slate-800 max-w-[200px] truncate">{selectedFile.name}</span>
                                 <span className="text-[10px] text-slate-400 uppercase">Ready to analyze</span>
                             </div>
                             <button 
                                onClick={() => setSelectedFile(null)}
                                className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition-colors ml-2"
                             >
                                <X className="w-4 h-4" />
                             </button>
                        </div>
                    )}

                    {/* Clean input container */}
                    <div className={`relative flex items-end gap-2 p-2.5 bg-white border rounded-[26px] shadow-xl shadow-slate-200/40 transition-all
                        ${isDeepFocusMode ? 'border-indigo-200 shadow-indigo-200/30 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-100' : 'border-slate-200 focus-within:border-slate-300 focus-within:shadow-2xl'}
                    `}>
                        <input 
                            type="file" 
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            className="hidden" 
                            accept="image/*,.pdf,.txt,.doc,.docx" 
                        />
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className={`p-2 rounded-full transition-colors self-end mb-0.5 ${selectedFile ? 'bg-[#B2D7FF] text-slate-900' : 'text-slate-400 hover:text-slate-600 hover:bg-[#F4F0EE]'}`}
                            title="Upload Document"
                        >
                            <Paperclip className="w-5 h-5" />
                        </button>
                        
                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={selectedFile ? "Ask Aria about this document..." : (isDeepFocusMode ? "Type symptoms here..." : "Ask anything...")}
                            className="flex-1 max-h-32 py-2.5 bg-transparent border-none focus:ring-0 placeholder:text-slate-400 text-slate-800 resize-none text-[15px] leading-relaxed outline-none"
                            rows={1}
                        />
                        
                        <button 
                            onClick={() => handleSend(input)}
                            disabled={(!input.trim() && !selectedFile) || isLoading}
                            className={`p-2 rounded-full transition-all duration-200 self-end mb-0.5 
                                ${(input.trim() || selectedFile) 
                                    ? (isDeepFocusMode ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:scale-105' : 'bg-slate-900 text-white shadow-md hover:bg-black hover:scale-105') 
                                    : 'bg-slate-900 text-slate-300 cursor-not-allowed'}
                            `}
                        >
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="text-center mt-2">
                        <p className="text-[10px] text-slate-400">Aria can make mistakes. Please verify important medical information.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
      </div>

      {/* Claude-style Artifact Side Panel */}
      {activeArtifact && (
        <div className="hidden md:flex w-1/2 h-full border-l border-slate-200 animate-in slide-in-from-right duration-500">
          <ArtifactView
            artifact={activeArtifact}
            onClose={() => setActiveArtifact(null)}
          />
        </div>
      )}

      {/* Mobile Artifact Modal */}
      {activeArtifact && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50 animate-in fade-in duration-300">
          <div className="absolute inset-x-0 bottom-0 top-16 bg-white rounded-t-2xl animate-in slide-in-from-bottom duration-500">
            <ArtifactView
              artifact={activeArtifact}
              onClose={() => setActiveArtifact(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
