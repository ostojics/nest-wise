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
    // Remove hardcoded lng to allow proper language detection
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
const setupZodErrorMap = () => {
  // Create a fresh zodI18nMap that uses the current language
  const zodI18nMap = makeZodI18nMap({
    t: i18n.t.bind(i18n),
    ns: 'zod',
  });

  // Extended error map to handle domain-specific keys
  const extendedZodErrorMap: z.ZodErrorMap = (issue, ctx) => {
    // Check if the message is a translation key (starts with a letter, contains dots)
    const isTranslationKey = /^[a-z][\w.-]+(\.[\w-]+)*$/.test(issue.message || '');

    if (isTranslationKey && issue.message) {
      // Convert namespace.key.subkey format to namespace:key.subkey format for i18next
      // e.g., "users.validation.passwordsNotMatch" -> "users:validation.passwordsNotMatch"
      const parts = issue.message.split('.');
      if (parts.length >= 2) {
        const namespace = parts[0];
        const key = parts.slice(1).join('.');
        const i18nKey = `${namespace}:${key}`;

        try {
          const translatedMessage = i18n.t(i18nKey);
          // If translation is successful and different from the key, use it
          if (translatedMessage && translatedMessage !== i18nKey && translatedMessage !== issue.message) {
            return {message: translatedMessage};
          }
        } catch (error) {
          console.warn('Translation failed for key:', i18nKey, error);
        }
      }
    }

    // Fall back to the default zod-i18n-map
    return zodI18nMap(issue, ctx);
  };

  z.setErrorMap(extendedZodErrorMap);
};

// Set up error map initially
setupZodErrorMap();

// Re-setup error map when language changes
i18n.on('languageChanged', () => {
  setupZodErrorMap();
});

// Expose i18n to window for debugging
if (typeof window !== 'undefined') {
  (window as any).i18n = i18n;
}

export default i18n;
