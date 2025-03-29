import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
const resources = {
  en: {
    translation: {},
  },
  es: {
    translation: {},
  },
  hi: {
    translation: {},
  },
  cn: {
    translation: {},
  },
  ru: {
    translation: {},
  },
  fr: {
    translation: {},
  },
  th: {
    translation: {},
  },
  id: {
    translation: {},
  },
  kr: {
    translation: {},
  },
  jp: {
    translation: {},
  },
  zh: {
    translation: {},
  },
};

const initializeI18n = async () => {
  // Initialize i18n asynchronously
  await i18n.use(initReactI18next).init({
    // lng: getUserData ? getUserData : 'en',
    debug: true,
    compatibilityJSON: 'v3',
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });
};

initializeI18n().catch(error => {
  console.error('Error initializing i18n:', error);
});

export default i18n;
