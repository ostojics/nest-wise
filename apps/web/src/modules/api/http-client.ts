import {isPublicRoute} from '@/lib/utils';
import ky from 'ky';

const httpClient = ky.create({
  prefixUrl: import.meta.env.VITE_API_URL as string,
  credentials: 'include',
});

const extended = httpClient.extend({
  hooks: {
    afterResponse: [
      (_request, _options, response) => {
        if (isPublicRoute(window.location.pathname)) return response;

        const {status} = response;

        if (status === 401 || status === 403) {
          window.location.href = '/login';
        }

        return response;
      },
    ],
  },
});

export default extended;
