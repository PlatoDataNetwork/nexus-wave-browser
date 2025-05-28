
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enCommon from './en/common.json';
import enLanding from './en/landing.json';
import enSearch from './en/search.json';
import enSettings from './en/settings.json';
import enBrowser from './en/browser.json';
import enCategories from './en/categories.json';

import esCommon from './es/common.json';
import esLanding from './es/landing.json';
import esSearch from './es/search.json';
import esSettings from './es/settings.json';
import esBrowser from './es/browser.json';
import esCategories from './es/categories.json';

import frCommon from './fr/common.json';
import frLanding from './fr/landing.json';
import frSearch from './fr/search.json';
import frSettings from './fr/settings.json';
import frBrowser from './fr/browser.json';
import frCategories from './fr/categories.json';

const resources = {
  en: {
    common: enCommon,
    landing: enLanding,
    search: enSearch,
    settings: enSettings,
    browser: enBrowser,
    categories: enCategories
  },
  es: {
    common: esCommon,
    landing: esLanding,
    search: esSearch,
    settings: esSettings,
    browser: esBrowser,
    categories: esCategories
  },
  fr: {
    common: frCommon,
    landing: frLanding,
    search: frSearch,
    settings: frSettings,
    browser: frBrowser,
    categories: frCategories
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'landing', 'search', 'settings', 'browser', 'categories'],
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    },

    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
