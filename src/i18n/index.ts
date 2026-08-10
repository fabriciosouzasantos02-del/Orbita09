import { Language } from './types';
import { commonTranslations } from './common';
import { profileTranslations } from './profile';
import { astrologyTranslations } from './astrology';
import { tarotTranslations } from './tarot';
import { tarotUiTranslations } from './tarotUi';
import { tarotUiCompleteTranslations } from './tarotUiComplete';
import { transitsUiTranslations } from './transitsUi';
import { biorhythmUiCompleteTranslations } from './biorhythmUiComplete';
import { lunarRuntimeUiTranslations } from './lunarRuntimeUi';
import { lunarKeyPatch } from './lunarKeyPatch';
import { vercelBuildFixTranslations } from './vercelBuildFix';
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
import { localLangDict } from '../lib/locales';
import { uiTranslationsMultilang } from '../components/numerologyTranslations';
import { LUNAR_PHASES_TRANSLATIONS, SIGN_MEDICAL_TRANSLATED, LOCAL_UI_TRANSLATIONS } from '../lib/lunarTranslations';
import { NODE_SIGNS_LOCALIZED, NODE_HOUSES_LOCALIZED } from '../lib/nodeTranslations';

const modules = [
  commonTranslations,
  profileTranslations,
  astrologyTranslations,
  tarotTranslations,
  tarotUiTranslations,
  transitsUiTranslations,
  biorhythmUiCompleteTranslations,
  lunarRuntimeUiTranslations,
  lunarKeyPatch,
  vercelBuildFixTranslations,
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

function mergeNestedLocalizedSource(source: unknown): void {
  const isRecord = (value: unknown): value is Record<string, any> =>
    !!value && typeof value === 'object' && !Array.isArray(value);

  const visit = (node: unknown): void => {
    if (!isRecord(node)) return;

    const hasAllLanguages = languages.every((lang) => Object.prototype.hasOwnProperty.call(node, lang));
    if (hasAllLanguages) {
      const localized = node as Record<Language, unknown>;
      const ptNode = localized.pt;

      const pairWalk = (ptValue: unknown, targetValues: Record<Language, unknown>): void => {
        if (typeof ptValue === 'string') {
          for (const lang of languages) {
            const translated = targetValues[lang];
            if (typeof translated === 'string' && translated.trim()) {
              mergedTranslations[lang][ptValue] = translated;
            }
          }
          return;
        }

        if (!isRecord(ptValue)) return;
        for (const key of Object.keys(ptValue)) {
          const nextTargets: Record<Language, unknown> = {
            pt: isRecord(targetValues.pt) ? targetValues.pt[key] : undefined,
            en: isRecord(targetValues.en) ? targetValues.en[key] : undefined,
            es: isRecord(targetValues.es) ? targetValues.es[key] : undefined,
            de: isRecord(targetValues.de) ? targetValues.de[key] : undefined,
            fr: isRecord(targetValues.fr) ? targetValues.fr[key] : undefined
          };
          pairWalk(ptValue[key], nextTargets);
        }
      };

      pairWalk(ptNode, localized);
      return;
    }

    for (const value of Object.values(node)) visit(value);
  };

  visit(source);
}

import { applyTranslationPatches } from '../lib/translationPatch';
try {
  applyTranslationPatches(mergedTranslations);
} catch (e) {
  console.warn('Note: applyTranslationPatches deferred or already merged.');
}

// Register nested five-language dictionaries after legacy patches so an old
// Portuguese fallback cannot overwrite the selected-language translation.
mergeNestedLocalizedSource(LUNAR_PHASES_TRANSLATIONS);
mergeNestedLocalizedSource(SIGN_MEDICAL_TRANSLATED);
mergeNestedLocalizedSource(LOCAL_UI_TRANSLATIONS);
mergeNestedLocalizedSource(NODE_SIGNS_LOCALIZED);
mergeNestedLocalizedSource(NODE_HOUSES_LOCALIZED);

// Authoritative fixed-interface layers are applied last.
for (const lang of languages) {
  if (tarotUiCompleteTranslations[lang]) Object.assign(mergedTranslations[lang], tarotUiCompleteTranslations[lang]);
  if (transitsUiTranslations[lang]) Object.assign(mergedTranslations[lang], transitsUiTranslations[lang]);
  if (biorhythmUiCompleteTranslations[lang]) Object.assign(mergedTranslations[lang], biorhythmUiCompleteTranslations[lang]);
  if (lunarRuntimeUiTranslations[lang]) Object.assign(mergedTranslations[lang], lunarRuntimeUiTranslations[lang]);
  if (lunarKeyPatch[lang]) Object.assign(mergedTranslations[lang], lunarKeyPatch[lang]);
  if (vercelBuildFixTranslations[lang]) Object.assign(mergedTranslations[lang], vercelBuildFixTranslations[lang]);
}

import i18next from 'i18next';

export function getDeviceLanguage(): Language {
  if (typeof window === 'undefined') return 'pt';
  try {
    const params = new URLSearchParams(window.location.search);
    const urlLang = (params.get('lang') || params.get('hl') || params.get('locale') || '').toLowerCase();
    if (urlLang.startsWith('es')) return 'es';
    if (urlLang.startsWith('en')) return 'en';
    if (urlLang.startsWith('de')) return 'de';
    if (urlLang.startsWith('fr')) return 'fr';
    if (urlLang.startsWith('pt')) return 'pt';
  } catch (e) {}

  const candidates: string[] = [];
  if (typeof navigator !== 'undefined' && navigator) {
    if (Array.isArray(navigator.languages)) candidates.push(...navigator.languages);
    if (navigator.language) candidates.push(navigator.language);
    if ((navigator as any).userLanguage) candidates.push((navigator as any).userLanguage);
    if ((navigator as any).browserLanguage) candidates.push((navigator as any).browserLanguage);
    if ((navigator as any).systemLanguage) candidates.push((navigator as any).systemLanguage);
  }
  if (typeof document !== 'undefined' && document.documentElement?.lang) candidates.push(document.documentElement.lang);
  for (const item of candidates) {
    const clean = item?.trim().toLowerCase();
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
