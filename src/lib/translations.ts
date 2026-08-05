export type Language = 'pt' | 'en' | 'es' | 'de' | 'fr';

import { mergedTranslations, getDeviceLanguage } from '../i18n';

export const translations: Record<Language, Record<string, string>> = mergedTranslations;
export const staticTranslations = mergedTranslations;
export const translationDict = mergedTranslations;
export const uiTranslations = mergedTranslations;

export function getCurrentLang(): Language {
  return getDeviceLanguage();
}

export function translateUiText(key: string, lang: Language = 'pt'): string {
  const dict = mergedTranslations[lang] || mergedTranslations.pt;
  return dict[key] || mergedTranslations.pt[key] || key;
}
