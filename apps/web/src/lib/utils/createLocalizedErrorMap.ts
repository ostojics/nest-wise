import {makeZodI18nMap} from 'zod-i18n-map';
import {z} from 'zod';
import type {TFunction} from 'i18next';

/**
 * Creates a localized Zod error map that handles both standard Zod errors
 * and domain-specific translation keys
 *
 * @param t - Translation function from i18next
 * @returns ZodErrorMap for use with Zod schemas
 */
export const createLocalizedErrorMap = (t: TFunction): z.ZodErrorMap => {
  // Get the standard zod-i18n-map for basic validation errors
  const zodI18nMap = makeZodI18nMap({t});

  return (issue, ctx) => {
    // Check if the message is a domain-specific translation key
    const isTranslationKey = /^[a-z][\w.-]+(\.[\w-]+)*$/.test(issue.message || '');

    if (isTranslationKey && issue.message) {
      // Convert namespace.key.subkey format to namespace:key.subkey format for i18next
      const parts = issue.message.split('.');
      if (parts.length >= 2) {
        const namespace = parts[0];
        const key = parts.slice(1).join('.');
        const i18nKey = `${namespace}:${key}`;

        const translatedMessage = t(i18nKey, {defaultValue: issue.message});
        if (translatedMessage && translatedMessage !== i18nKey && translatedMessage !== issue.message) {
          return {message: translatedMessage};
        }
      }
    }

    // Fall back to standard zod-i18n-map for all other cases
    return zodI18nMap(issue, ctx);
  };
};
