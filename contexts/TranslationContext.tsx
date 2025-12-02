
import React, { createContext, useContext, useState, ReactNode, useRef, useCallback, useEffect } from 'react';
import { translateBatch } from '../services/geminiService';

interface TranslationContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (text: string) => string;
  isTranslating: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState('English');
  const [translations, setTranslations] = useState<Record<string, Record<string, string>>>({});
  const [isTranslating, setIsTranslating] = useState(false);
  
  // Use a Ref for the registry to avoid re-renders when components register strings
  const registryRef = useRef<Set<string>>(new Set());

  const setLanguage = async (lang: string) => {
    if (lang === language) return;
    
    // If switching to English, just switch immediately
    if (lang === 'English') {
        setLanguageState('English');
        return;
    }

    setIsTranslating(true);
    
    // Simulate "Scanning" phase for UX
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Get all registered strings
    const allStrings = Array.from(registryRef.current);
    
    // Filter out strings we already have cached for this language
    const existingTranslations = translations[lang] || {};
    const stringsToTranslate = allStrings.filter(s => !existingTranslations[s]);

    if (stringsToTranslate.length > 0) {
        // Send batch to AI
        const newTranslations = await translateBatch(stringsToTranslate, lang);
        
        setTranslations(prev => ({
            ...prev,
            [lang]: { ...(prev[lang] || {}), ...newTranslations }
        }));
    }

    setLanguageState(lang);
    setIsTranslating(false);
  };

  const t = useCallback((text: string) => {
    // Register the string if it's new
    if (!registryRef.current.has(text)) {
        registryRef.current.add(text);
    }

    // If language is English, return original
    if (language === 'English') return text;

    // Return translation if available, otherwise return original (fallback)
    return translations[language]?.[text] || text;
  }, [language, translations]);

  // Optional: Background check for missing translations
  // If the user navigates to a new page while in a non-English language, 
  // new strings will be registered but not translated yet.
  // We can add a debounced effect here to catch them up, but for this demo,
  // we'll rely on the main "Language Switch" action or simple fallbacks.

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t, isTranslating }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
