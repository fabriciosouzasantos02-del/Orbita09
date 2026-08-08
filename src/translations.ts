import i18next from 'i18next';
import { mergedTranslations, getDeviceLanguage } from './i18n';

export type Language = 'pt' | 'en' | 'es' | 'de' | 'fr';

export const translations: Record<Language, Record<string, string>> = mergedTranslations;
export const staticTranslations = mergedTranslations;
export const translationDict = mergedTranslations;
export const uiTranslations = mergedTranslations;

export function getCurrentLang(): Language {
  if (i18next && i18next.language) {
    const active = i18next.language.toLowerCase().split('-')[0];
    if (['pt', 'en', 'es', 'de', 'fr'].includes(active)) {
      return active as Language;
    }
  }
  if (typeof window !== 'undefined') {
    const explicit = localStorage.getItem('orbi_user_explicit_lang') || localStorage.getItem('orbi_preferred_language');
    if (explicit && ['pt', 'en', 'es', 'de', 'fr'].includes(explicit)) {
      return explicit as Language;
    }
  }
  return getDeviceLanguage();
}

export function translateUiText(key: string, lang?: Language): string {
  const targetLang = lang || getCurrentLang();
  const dict = mergedTranslations[targetLang] || mergedTranslations.pt;
  return dict[key] || mergedTranslations.pt[key] || key;
}

