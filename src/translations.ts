import i18next from 'i18next';
import { mergedTranslations, getInitialLanguage } from './i18n';
import { Language } from './i18n/types';

export type { Language };

export const translations: Record<Language, Record<string, string>> = mergedTranslations;
export const staticTranslations = mergedTranslations;
export const translationDict = mergedTranslations;
export const uiTranslations = mergedTranslations;

/**
 * Returns only the language currently selected by the application/user.
 * Browser, OS and navigator locale are never used as a fallback.
 */
export function getCurrentLang(): Language {
  if (i18next && i18next.language) {
    const active = i18next.language.toLowerCase().split('-')[0];
    if (['pt', 'en', 'es', 'de', 'fr'].includes(active)) {
      return active as Language;
    }
  }

  return getInitialLanguage();
}

export function translateUiText(key: string, lang?: Language): string {
  const targetLang = lang || getCurrentLang();
  if (i18next && i18next.isInitialized && i18next.exists(key, { lng: targetLang })) {
    const val = i18next.t(key, { lng: targetLang });
    if (typeof val === 'string' && val) return val;
  }
  const dict = mergedTranslations[targetLang];
  if (dict && dict[key]) {
    return dict[key];
  }
  return key;
}
