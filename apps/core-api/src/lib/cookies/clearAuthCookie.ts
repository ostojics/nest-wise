import type {CookieOptions, Response} from 'express';
import {AppConfig} from 'src/config/app.config';

/**
 * Clears the authentication cookie from the response.
 *
 * @param res - Express response object
 * @param config - Application configuration containing environment and cookie domain
 *
 * The cookie is cleared with the following options:
 * - HTTP-only
 * - Secure in production
 * - SameSite strict
 * - Path set to '/'
 * - Domain set if in production and cookieDomain is provided
 */
export const clearAuthCookie = (res: Response, config: AppConfig) => {
  const {environment, cookieDomain} = config;
  const isProduction = environment === 'production';

  const options: CookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    path: '/',
  };

  if (isProduction && cookieDomain) {
    options.domain = cookieDomain;
  }

  res.clearCookie('auth', options);
};
