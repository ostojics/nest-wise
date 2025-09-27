import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import {resources, defaultNamespaces, supportedLanguages} from '@nest-wise/locales';
import {z} from 'zod';
import {makeZodI18nMap} from 'zod-i18n-map';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    lng: 'en', // Will be overridden by detector
    defaultNS: defaultNamespaces[0],
    ns: defaultNamespaces,
    supportedLngs: supportedLanguages,
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'nest-wise-language',
    },
  });

// Set up Zod error mapping after i18n is initialized
const zodI18nMap = makeZodI18nMap({
  t: i18n.t,
  ns: 'zod',
  handlePath: {
    keyPrefix: 'zod:errors',
  },
});

// Extended error map to handle domain-specific keys
const extendedZodErrorMap: z.ZodErrorMap = (issue, ctx) => {
  // Check if the message is a translation key (starts with a letter, contains dots)
  const isTranslationKey = /^[a-z][\w.-]+(\.[\w-]+)*$/.test(issue.message || '');

  if (isTranslationKey && issue.message) {
    // Try to translate the domain-specific key
    const translatedMessage = i18n.t(issue.message, {defaultValue: issue.message});
    if (translatedMessage !== issue.message) {
      return {message: translatedMessage};
    }
  }

  // Fall back to the default zod-i18n-map
  return zodI18nMap(issue, ctx);
};

z.setErrorMap(extendedZodErrorMap);

export default i18n;
