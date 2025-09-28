import {zodResolver} from '@hookform/resolvers/zod';
import {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {z} from 'zod';
import {createLocalizedErrorMap} from '@/lib/utils/createLocalizedErrorMap';

/**
 * Universal hook for localized Zod validation with react-hook-form
 * Works with any Zod schema and automatically localizes error messages
 *
 * @param schema - Any Zod schema
 * @returns Localized zodResolver for use with react-hook-form
 *
 * @example
 * const resolver = useLocalizedZodResolver(loginSchema);
 * const form = useForm({ resolver });
 */
export const useLocalizedZodResolver = <T extends z.ZodSchema>(schema: T) => {
  const {t, i18n} = useTranslation();

  return useMemo(() => {
    const errorMap = createLocalizedErrorMap(t);
    return zodResolver(schema, {errorMap});
  }, [schema, t, i18n.language]);
};
