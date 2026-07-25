import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { getInitialLanguage, changeLanguage } from '../i18n';

export type Idioma = 'pt' | 'en' | 'es' | 'de' | 'fr';

export interface TraducaoSchema {
  appName: string;
  appSubtitle: string;
  welcomeBuscador: string;
  userArea: string;
  birthChart: string;
  dreams: string;
  premium: string;
  settings: string;
  transits: string;
  missions: string;
  tarot: string;
  constellations: string;
  planetsOrbia: string;
  saveMap: string;
  btnSave: string;
  btnCancel: string;
  btnShareApp: string;
  btnUpgrade: string;
  btnBack: string;
  languageSelectLabel: string;
  successSave: string;
  confirmDeleteTitle: string;
  confirmDeleteBody: string;
}

interface IdiomaContextType {
  idioma: Idioma;
  mudarIdioma: (novoIdioma: Idioma) => void;
  t: (chave: keyof TraducaoSchema) => string;
}

const IdiomaContext = createContext<IdiomaContextType | undefined>(undefined);

interface IdiomaProviderProps {
  children: ReactNode;
}

export function IdiomaProvider({ children }: IdiomaProviderProps) {
  const { i18n, t: tI18n } = useTranslation();

  const normalizeLanguage = (langStr: string): Idioma => {
    if (!langStr) return getInitialLanguage();
    const base = langStr.toLowerCase().split('-')[0];
    return ['pt', 'en', 'es', 'de', 'fr'].includes(base) ? (base as Idioma) : getInitialLanguage();
  };

  const [idioma, setIdioma] = useState<Idioma>(() => getInitialLanguage());

  // Ensure initial language is synchronized on mount
  useEffect(() => {
    const initLang = getInitialLanguage();
    if (i18n.language !== initLang) {
      changeLanguage(initLang);
      setIdioma(initLang);
    }
  }, []);

  // Keep state in sync with react-i18next
  useEffect(() => {
    const handleLanguageChanged = () => {
      setIdioma(normalizeLanguage(i18n.language));
    };
    window.addEventListener('orbi_language_changed', handleLanguageChanged);
    return () => {
      window.removeEventListener('orbi_language_changed', handleLanguageChanged);
    };
  }, [i18n.language]);

  const mudarIdioma = (novoIdioma: Idioma) => {
    changeLanguage(novoIdioma);
    setIdioma(novoIdioma);
  };

  const t = (chave: keyof TraducaoSchema): string => {
    return tI18n(chave) || chave;
  };

  return (
    <IdiomaContext.Provider value={{ idioma, mudarIdioma, t }}>
      {children}
    </IdiomaContext.Provider>
  );
}

export function useIdioma() {
  const context = useContext(IdiomaContext);
  if (context === undefined) {
    throw new Error('useIdioma deve ser usado dentro de um IdiomaProvider');
  }
  return context;
}
