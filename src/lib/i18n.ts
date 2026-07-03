import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { translationDict, uiTranslations } from './translations';
import { staticTranslations as rootTranslations } from '../translations';
import { applyTranslationPatches } from './translationPatch';
import { mergedTranslations, getInitialLanguage } from '../i18n';

// Apply the manual highly polished translations to ensure 100% key consistency
applyTranslationPatches();

const resources: any = {
  pt: {
    translation: {
      ...translationDict.pt,
      ...rootTranslations.pt,
      // uiTranslations usa chaves em PT -> tradução em outro idioma.
      // Para PT, o valor deve ser a própria chave PT (o texto original),
      // então populamos corretamente usando as chaves como valores.
      ...Object.fromEntries(
        Object.keys(uiTranslations.en).map(ptKey => [ptKey, ptKey])
      ),
      ...mergedTranslations.pt,
    }
  },
  en: {
    translation: {
      ...translationDict.en,
      ...rootTranslations.en,
      ...uiTranslations.en,
      ...mergedTranslations.en,
    }
  },
  es: {
    translation: {
      ...translationDict.es,
      ...rootTranslations.es,
      ...uiTranslations.es,
      ...mergedTranslations.es,
    }
  },
  de: {
    translation: {
      ...translationDict.de,
      ...rootTranslations.de,
      ...uiTranslations.de,
      ...mergedTranslations.de,
    }
  },
  fr: {
    translation: {
      ...translationDict.fr,
      ...rootTranslations.fr,
      ...uiTranslations.fr,
      ...mergedTranslations.fr,
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
