import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { mergedTranslations, getInitialLanguage } from '../i18n';

const resources = {
  pt: {
    translation: mergedTranslations.pt,
  },
  en: {
    translation: mergedTranslations.en,
  },
  es: {
    translation: mergedTranslations.es,
  },
  de: {
    translation: mergedTranslations.de,
  },
  fr: {
    translation: mergedTranslations.fr,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

