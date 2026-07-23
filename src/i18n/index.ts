import { Language } from '../translations';
import { commonTranslations } from './common';
import { profileTranslations } from './profile';
import { astrologyTranslations } from './astrology';
import { tarotTranslations } from './tarot';
import { dreamsTranslations } from './dreams';
import { missionsTranslations } from './missions';
import { settingsTranslations } from './settings';
import { notificationsTranslations } from './notifications';
import { compatibilityTranslations } from './compatibility';
import { chartsTranslations } from './charts';
import { onboardingTranslations } from './onboarding';
import { numerologyTranslations } from './numerology';
import { orbiaTranslations } from './orbia';
import { serverTranslations } from './server';
import { landingTranslations } from './landing';
import { customFeaturesTranslations } from './customFeatures';
import { dynamicContentTranslations } from './dynamicContent';
import { cupidoTranslations } from './cupido';

// Collection of all registered translation modules
const modules = [
  commonTranslations,
  profileTranslations,
  astrologyTranslations,
  tarotTranslations,
  dreamsTranslations,
  missionsTranslations,
  settingsTranslations,
  notificationsTranslations,
  compatibilityTranslations,
  chartsTranslations,
  onboardingTranslations,
  numerologyTranslations,
  orbiaTranslations,
  serverTranslations,
  landingTranslations,
  customFeaturesTranslations,
  dynamicContentTranslations,
  cupidoTranslations
];

// Automatically merged single official source of truth
export const mergedTranslations: Record<Language, Record<string, string>> = {
  pt: {},
  en: {},
  es: {},
  de: {},
  fr: {}
};

// Merge all module objects cleanly at runtime
const languages: Language[] = ['pt', 'en', 'es', 'de', 'fr'];
for (const lang of languages) {
  for (const mod of modules) {
    if (mod && mod[lang]) {
      Object.assign(mergedTranslations[lang], mod[lang]);
    }
  }
}

import i18next from 'i18next';

export function getDeviceLanguage(): Language {
  if (typeof window === 'undefined' || !navigator) return 'pt';
  const systemLang = navigator.language || (navigator as any).userLanguage || '';
  const langLower = systemLang.toLowerCase();
  
  if (langLower.startsWith('de')) return 'de';
  if (langLower.startsWith('es')) return 'es';
  if (langLower.startsWith('fr')) return 'fr';
  if (langLower.startsWith('en')) return 'en';
  return 'pt'; // Default is Portuguese
}

export function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'pt';
  const saved = localStorage.getItem('orbi_preferred_language');
  if (saved && ['pt', 'en', 'es', 'de', 'fr'].includes(saved)) {
    return saved as Language;
  }
  const detected = getDeviceLanguage();
  localStorage.setItem('orbi_preferred_language', detected);
  return detected;
}

export function changeLanguage(novoIdioma: Language): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('orbi_preferred_language', novoIdioma);
    // Invalidate caches
    try {
      Object.keys(localStorage).forEach(key => {
        if (
          key.startsWith('orbi_natal_chart_') ||
          key.startsWith('orbi_transit_') ||
          key.startsWith('orbi_daily_insight_') ||
          key.startsWith('orbi_weekly_insight_') ||
          key.startsWith('orbi_missions_') ||
          key.startsWith('orbi_numerology_') ||
          key.startsWith('orbi_prosperity_') ||
          key.startsWith('orbi_biorhythm_') ||
          key.startsWith('orbi_lunarnodes_') ||
          key.startsWith('tarot_saved_') ||
          key.startsWith('tarot_last_draw_') ||
          key.startsWith('orbi_calc_cache_') ||
          key.includes('_insight_') ||
          key === 'orbi_map_data' ||
          key === 'orbi_numerology_data'
        ) {
          localStorage.removeItem(key);
        }
      });

      // Clear relevant session storage caches
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith('astrological_')) {
          sessionStorage.removeItem(key);
        }
      });
      // Dispatch global change event
      window.dispatchEvent(new Event('orbi_language_changed'));
    } catch (e) {
      console.error('Error invalidating caches for language change:', e);
    }
  }
  i18next.changeLanguage(novoIdioma);
}

// Verification function to ensure a key exists across all languages (enforces translation completeness)
export function verifyTranslationKeys(): string[] {
  const ptKeys = Object.keys(mergedTranslations.pt);
  const errors: string[] = [];
  
  for (const key of ptKeys) {
    for (const lang of languages) {
      if (!mergedTranslations[lang][key]) {
        errors.push(`Missing translation key: "${key}" in language "${lang}"`);
      }
    }
  }
  return errors;
}
