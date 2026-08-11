import { Language } from './types';
import { commonTranslations } from './common';
import { profileTranslations } from './profile';
import { astrologyTranslations } from './astrology';
import { tarotSemanticTranslations, tarotSemanticKeyMap } from './tarotSemantic';
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

const modules = [
  commonTranslations,
  profileTranslations,
  astrologyTranslations,
  tarotSemanticTranslations,
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

export const mergedTranslations: Record<Language, Record<string, string>> = {
  pt: {}, en: {}, es: {}, de: {}, fr: {}
};

const languages: Language[] = ['pt', 'en', 'es', 'de', 'fr'];
for (const lang of languages) {
  for (const mod of modules) {
    if (mod && mod[lang]) Object.assign(mergedTranslations[lang], mod[lang]);
  }
}

import { applyTranslationPatches } from '../lib/translationPatch';
try {
  applyTranslationPatches(mergedTranslations);
} catch (e) {
  console.warn('Note: applyTranslationPatches deferred or already merged.');
}

// Compatibility bridge: legacy Tarot consumers can still pass a Portuguese
// sentence to t(), while all canonical Tarot entries are semantic IDs.
for (const lang of languages) {
  for (const [semanticId, legacyKey] of Object.entries(tarotSemanticKeyMap)) {
    const value = mergedTranslations[lang][semanticId];
    if (value) mergedTranslations[lang][legacyKey] = value;
  }
}

import i18next from 'i18next';

export function getDeviceLanguage(): Language {
  if (typeof window === 'undefined') return 'pt';
  try {
    const params = new URLSearchParams(window.location.search);
    const urlLang = (params.get('lang') || params.get('hl') || params.get('locale') || '').toLowerCase();
    if (urlLang) {
      if (urlLang.startsWith('es')) return 'es';
      if (urlLang.startsWith('en')) return 'en';
      if (urlLang.startsWith('de')) return 'de';
      if (urlLang.startsWith('fr')) return 'fr';
      if (urlLang.startsWith('pt')) return 'pt';
    }
  } catch (e) {
    // Ignore URL parse errors
  }

  const candidates: string[] = [];
  if (typeof navigator !== 'undefined' && navigator) {
    if (Array.isArray(navigator.languages) && navigator.languages.length > 0) candidates.push(...navigator.languages);
    if (navigator.language) candidates.push(navigator.language);
    if ((navigator as any).userLanguage) candidates.push((navigator as any).userLanguage);
    if ((navigator as any).browserLanguage) candidates.push((navigator as any).browserLanguage);
    if ((navigator as any).systemLanguage) candidates.push((navigator as any).systemLanguage);
  }
  if (typeof document !== 'undefined' && document.documentElement?.lang) candidates.push(document.documentElement.lang);

  for (const item of candidates) {
    if (!item || typeof item !== 'string') continue;
    const clean = item.trim().toLowerCase();
    if (clean.startsWith('es')) return 'es';
    if (clean.startsWith('en')) return 'en';
    if (clean.startsWith('de')) return 'de';
    if (clean.startsWith('fr')) return 'fr';
    if (clean.startsWith('pt')) return 'pt';
  }
  return 'pt';
}

export function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'pt';
  const explicitSaved = localStorage.getItem('orbi_user_explicit_lang');
  if (explicitSaved && ['pt', 'en', 'es', 'de', 'fr'].includes(explicitSaved)) return explicitSaved as Language;
  const detected = getDeviceLanguage();
  localStorage.setItem('orbi_preferred_language', detected);
  return detected;
}

export function changeLanguage(novoIdioma: Language): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('orbi_user_explicit_lang', novoIdioma);
    localStorage.setItem('orbi_preferred_language', novoIdioma);
    try { window.dispatchEvent(new Event('orbi_language_changed')); } catch (e) { console.error('Error dispatching language change event:', e); }
  }
  i18next.changeLanguage(novoIdioma);
}

export function verifyTranslationKeys(): string[] {
  const ptKeys = Object.keys(mergedTranslations.pt);
  const errors: string[] = [];
  for (const key of ptKeys) {
    for (const lang of languages) {
      if (!mergedTranslations[lang][key]) errors.push(`Missing translation key: "${key}" in language "${lang}"`);
    }
  }
  return errors;
}
