import type {CookieOptions, Response} from 'express';
import {AppConfig} from 'src/config/app.config';

/**
 * Sets the authentication cookie on the response with the provided JWT.
 *
 * @param res - Express response object
 * @param jwt - JWT access token to set as the cookie value
 * @param config - Application configuration containing environment and cookie domain
 *
 * The cookie is:
 * - HTTP-only
 * - Secure in production
 * - SameSite strict
 * - Path set to '/'
 * - Max age 7 days
 * - Domain set if in production and cookieDomain is provided
 */
export const setAuthCookie = (res: Response, jwt: string, config: AppConfig) => {
  const {environment, cookieDomain} = config;
  const isProduction = environment === 'production';

  const options: CookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    path: '/',
  };

  if (isProduction && cookieDomain) {
    options.domain = cookieDomain;
  }

  res.cookie('auth', jwt, options);
};
