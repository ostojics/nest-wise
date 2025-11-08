import {isPublicRoute} from '@/lib/utils';
import ky from 'ky';

const httpClient = ky.create({
  prefixUrl: import.meta.env.VITE_API_URL as string,
  credentials: 'include',
});

const extended = httpClient.extend({
  hooks: {
    afterResponse: [
      async (_request, _options, response) => {
        if (isPublicRoute(window.location.pathname)) return response;

        const {status} = response;

        // Log HTTP errors to PostHog
        if (!response.ok) {
          const {default: posthog} = await import('posthog-js');
          posthog.captureException(new Error(`HTTP ${status}: ${response.url}`), {
            context: {
              feature: 'ApiClient',
            },
            meta: {
              status,
              url: response.url,
              method: _request.method,
            },
          });
        }

        if (status === 401 || status === 403) {
          window.location.href = '/login';
        }

        return response;
      },
    ],
  },
});

export default extended;
