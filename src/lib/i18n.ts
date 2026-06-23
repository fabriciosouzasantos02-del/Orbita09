import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { translationDict, uiTranslations, getInitialLanguage } from './translations';

const resources: any = {
  pt: {
    translation: {
      ...translationDict.pt,
    }
  },
  en: {
    translation: {
      ...translationDict.en,
      ...uiTranslations.en
    }
  },
  es: {
    translation: {
      ...translationDict.es,
      ...uiTranslations.es
    }
  },
  de: {
    translation: {
      ...translationDict.de,
      ...uiTranslations.de
    }
  },
  fr: {
    translation: {
      ...translationDict.fr,
      ...uiTranslations.fr
    }
  }
};

// Populate Portuguese translations with keys mapping to themselves as fallback representation
if (uiTranslations && uiTranslations.en) {
  Object.keys(uiTranslations.en).forEach(ptKey => {
    resources.pt.translation[ptKey] = ptKey;
  });
}

// Support other keys if needed from other languages too
['es', 'de', 'fr'].forEach(langCode => {
  const dict = (uiTranslations as any)[langCode];
  if (dict) {
    Object.keys(dict).forEach(ptKey => {
      if (!resources.pt.translation[ptKey]) {
        resources.pt.translation[ptKey] = ptKey;
      }
    });
  }
});

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: 'pt',
    interpolation: {
      escapeValue: false // react already handles XSS prevention
    }
  });

export default i18n;
