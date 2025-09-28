import {Injectable} from '@nestjs/common';
import {Request} from 'express';
import i18next, {TFunction} from 'i18next';

/**
 * Centralized i18n service for backend translation
 * Provides request-scoped translation functions
 */
@Injectable()
export class I18nService {
  /**
   * Get a translator function for the given request
   * Detects language from Accept-Language header or falls back to 'en'
   *
   * @param request - Express request object (optional)
   * @returns Translation function bound to detected language
   */
  getTranslator(request?: Request): TFunction {
    const language = this.detectLanguage(request);
    return i18next.getFixedT(language);
  }

  /**
   * Detect language from request headers
   *
   * @param request - Express request object
   * @returns Language code ('en', 'sr', etc.)
   */
  private detectLanguage(request?: Request): string {
    if (!request) {
      return 'en';
    }

    const acceptLanguage = request.headers['accept-language'];
    if (!acceptLanguage) {
      return 'en';
    }

    // Parse Accept-Language header and find supported language
    const supportedLanguages = ['en', 'sr'];
    const preferredLanguages = acceptLanguage
      .split(',')
      .map((lang) => lang.split(';')[0].trim().toLowerCase())
      .map((lang) => lang.split('-')[0]); // Handle 'en-US' -> 'en'

    for (const lang of preferredLanguages) {
      if (supportedLanguages.includes(lang)) {
        return lang;
      }
    }

    return 'en'; // fallback
  }

  /**
   * Translate a key directly with optional language override
   *
   * @param key - Translation key (e.g., 'policy:cannotUpdateAccount')
   * @param language - Language override (optional)
   * @param options - i18next translation options
   * @returns Translated string
   */
  translate(key: string, language?: string, options?: any): string {
    const lng = language || 'en';
    return i18next.t(key, {lng, ...options});
  }
}
