import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './locales/en/translation.json';
import kkTranslation from './locales/kk/translation.json';
import ruTranslation from './locales/ru/translation.json';

const browserLanguage = typeof navigator !== 'undefined' ? navigator.language.toLowerCase() : 'en';
const defaultLanguage = browserLanguage.startsWith('kk') ? 'kk' : browserLanguage.startsWith('ru') ? 'ru' : 'en';
const savedLanguage =
  typeof window !== 'undefined'
    ? localStorage.getItem('umetaiLang') || defaultLanguage
    : 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      kk: { translation: kkTranslation },
      ru: { translation: ruTranslation },
    },
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('umetaiLang', lng);
});

export default i18n;
