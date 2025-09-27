import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import {resources, defaultNamespaces, supportedLanguages} from '@nest-wise/locales';
import {z} from 'zod';

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

// Custom Zod error map that dynamically uses current i18n language
const dynamicZodErrorMap: z.ZodErrorMap = (issue, ctx) => {
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

  // Handle standard Zod validation errors with dynamic translation
  // Map Zod issue codes to our translation keys
  const zodErrorKeyMap: Record<string, string> = {
    invalid_type: 'invalid_type',
    invalid_literal: 'invalid_literal',
    unrecognized_keys: 'unrecognized_keys',
    invalid_union: 'invalid_union',
    invalid_union_discriminator: 'invalid_union_discriminator',
    invalid_enum_value: 'invalid_enum_value',
    invalid_arguments: 'invalid_arguments',
    invalid_return_type: 'invalid_return_type',
    invalid_date: 'invalid_date',
    invalid_string: 'invalid_string',
    too_small: 'too_small',
    too_big: 'too_big',
    invalid_intersection_types: 'invalid_intersection_types',
    not_multiple_of: 'not_multiple_of',
    not_finite: 'not_finite',
    invalid_url: 'invalid_url',
    invalid_email: 'invalid_email',
    invalid_uuid: 'invalid_uuid',
    invalid_regex: 'invalid_regex',
    custom: 'custom',
  };

  const translationKey = zodErrorKeyMap[issue.code];
  if (translationKey) {
    try {
      // Prepare interpolation data for the translation
      const interpolationData: Record<string, any> = {};

      if (issue.code === 'invalid_type') {
        interpolationData.expected = issue.expected;
        interpolationData.received = issue.received;
      } else if (issue.code === 'invalid_literal') {
        interpolationData.expected = JSON.stringify(issue.expected);
      } else if (issue.code === 'unrecognized_keys') {
        interpolationData.keys = issue.keys.map((k) => `'${k}'`).join(', ');
      } else if (issue.code === 'invalid_union_discriminator') {
        interpolationData.options = issue.options.map((o) => `'${o}'`).join(', ');
      } else if (issue.code === 'invalid_enum_value') {
        interpolationData.options = issue.options.map((o) => `'${o}'`).join(', ');
        interpolationData.received = issue.received;
      } else if (issue.code === 'too_small') {
        interpolationData.minimum = issue.minimum;
        interpolationData.count = issue.minimum;
      } else if (issue.code === 'too_big') {
        interpolationData.maximum = issue.maximum;
        interpolationData.count = issue.maximum;
      } else if (issue.code === 'not_multiple_of') {
        interpolationData.multipleOf = issue.multipleOf;
      }

      const translatedMessage = i18n.t(`zod:${translationKey}`, interpolationData);
      if (translatedMessage && translatedMessage !== `zod:${translationKey}`) {
        return {message: translatedMessage};
      }
    } catch (error) {
      console.warn('Translation failed for Zod error:', issue.code, error);
    }
  }

  // Fallback to default English messages if translation fails
  return {message: ctx.defaultError};
};

// Set up error map once - it will dynamically use current language
z.setErrorMap(dynamicZodErrorMap);

// Expose i18n to window for debugging
if (typeof window !== 'undefined') {
  (window as any).i18n = i18n;
}

export default i18n;
