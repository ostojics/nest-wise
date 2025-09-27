import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {LoginDTO, loginSchema} from '@nest-wise/contracts';
import {useTranslation} from 'react-i18next';
import {useMemo} from 'react';
import {z} from 'zod';

// Create a localized error map that will be passed to zodResolver
const createLocalizedErrorMap =
  (t: any): z.ZodErrorMap =>
  (issue, ctx) => {
    // Handle standard Zod validation errors with dynamic translation
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

        const translatedMessage = t(`zod:${translationKey}`, interpolationData);
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

export const useValidateLogin = () => {
  const {t, i18n} = useTranslation();

  // Create a new resolver instance when language changes with localized error map
  const resolver = useMemo(() => {
    const errorMap = createLocalizedErrorMap(t);
    return zodResolver(loginSchema, {
      errorMap,
    });
  }, [t, i18n.language]);

  return useForm<LoginDTO>({
    resolver,
    defaultValues: {
      email: '',
      password: '',
    },
  });
};
