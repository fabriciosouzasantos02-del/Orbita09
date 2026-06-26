import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { translationDict, uiTranslations, getInitialLanguage } from './translations';

const resources: any = {
  pt: {
    translation: {
      ...translationDict.pt,
      // uiTranslations usa chaves em PT -> tradução em outro idioma.
      // Para PT, o valor deve ser a própria chave PT (o texto original),
      // então populamos corretamente usando as chaves como valores.
      ...Object.fromEntries(
        Object.keys(uiTranslations.en).map(ptKey => [ptKey, ptKey])
      ),
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

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: 'pt',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
