import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { translationDict, uiTranslations, getInitialLanguage } from './translations';
import { staticTranslations as rootTranslations } from '../translations';

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
    }
  },
  en: {
    translation: {
      ...translationDict.en,
      ...rootTranslations.en,
      ...uiTranslations.en
    }
  },
  es: {
    translation: {
      ...translationDict.es,
      ...rootTranslations.es,
      ...uiTranslations.es
    }
  },
  de: {
    translation: {
      ...translationDict.de,
      ...rootTranslations.de,
      ...uiTranslations.de
    }
  },
  fr: {
    translation: {
      ...translationDict.fr,
      ...rootTranslations.fr,
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
