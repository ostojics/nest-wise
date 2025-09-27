import {Request} from 'express';
import i18next from 'i18next';

/**
 * Get a request-scoped translator instance
 * @param req Express request object
 * @returns i18next translator function
 */
export function getRequestTranslator(req?: Request) {
  if (!req) {
    return i18next.t.bind(i18next);
  }

  // Use i18next-http-middleware to get the correct language for this request
  const language = (req as any).language || (req as any).lng || 'en';
  return i18next.getFixedT(language);
}

/**
 * Get the language from the request
 * @param req Express request object
 * @returns language string
 */
export function getRequestLanguage(req?: Request): string {
  if (!req) {
    return 'en';
  }

  return (req as any).language || (req as any).lng || 'en';
}
