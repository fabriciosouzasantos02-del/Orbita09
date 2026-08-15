import { Language } from './types';
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
import { uiTranslations } from './ui';
import { interfaceSemanticTranslations } from './interfaceSemantic';
import { localLangDict } from '../lib/locales';
import { uiTranslationsMultilang } from '../components/numerologyTranslations';

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
  cupidoTranslations,
  uiTranslations,
  interfaceSemanticTranslations,
  localLangDict as unknown as Record<Language, Record<string, string>>,
  uiTranslationsMultilang as Record<Language, Record<string, string>>
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

import { applyTranslationPatches } from '../lib/translationPatch';
try {
  applyTranslationPatches(mergedTranslations);
} catch (e) {
  console.warn('Note: applyTranslationPatches deferred or already merged.');
}

import i18next from 'i18next';

/**
 * Legacy-compatible function name. It no longer detects the browser/device
 * language. It returns the language explicitly selected in the application,
 * or Portuguese as the initial application default.
 */
export function getDeviceLanguage(): Language {
  if (typeof window === 'undefined') return 'pt';

  const explicit = localStorage.getItem('orbi_user_explicit_lang');
  if (explicit && languages.includes(explicit as Language)) {
    return explicit as Language;
  }

  return 'pt';
}

/**
 * The application language is authoritative. Browser, OS, navigator and URL
 * locale settings are intentionally ignored.
 */
export function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'pt';

  const explicitSaved = localStorage.getItem('orbi_user_explicit_lang');
  if (explicitSaved && languages.includes(explicitSaved as Language)) {
    return explicitSaved as Language;
  }

  return 'pt';
}

export function changeLanguage(novoIdioma: Language): void {
  if (!languages.includes(novoIdioma)) return;

  if (typeof window !== 'undefined') {
    localStorage.setItem('orbi_user_explicit_lang', novoIdioma);
    localStorage.setItem('orbi_preferred_language', novoIdioma);
    try {
      // Dispatch global change event for UI re-rendering
      window.dispatchEvent(new Event('orbi_language_changed'));
    } catch (e) {
      console.error('Error dispatching language change event:', e);
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
