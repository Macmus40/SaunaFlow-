
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { translations } from '../translations';

type LanguageCode = 'en' | 'pl' | 'de' | 'da' | 'sv' | 'no' | 'fi';

interface LanguageContextType {
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<LanguageCode>(() => {
    const storedLang = localStorage.getItem('saunaflow_lang');
    return (storedLang as LanguageCode) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('saunaflow_lang', lang);
  }, [lang]);

  const t = useCallback((key: string, params: Record<string, string | number> = {}) => {
    let str = translations[lang]?.[key] || translations['en'][key] || key;
    Object.keys(params).forEach(pKey => {
      str = str.replace(`{${pKey}}`, String(params[pKey]));
    });
    return str;
  }, [lang]);

  const value = { lang, setLang, t };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
