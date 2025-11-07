import {createRouter} from '@tanstack/react-router';
import {routeTree} from './routeTree.gen';
import {DefaultErrorComponent} from '@/components/error-boundary';
import posthog from 'posthog-js';

export const router = createRouter({
  routeTree,
  context: {isAuthenticated: false},
  defaultViewTransition: true,
  defaultErrorComponent: DefaultErrorComponent,
  defaultOnCatch: (error) => {
    // Log router-level errors to PostHog
    posthog.captureException(error, {
      context: {
        feature: 'RouterErrorBoundary',
        route: window.location.pathname,
      },
    });
  },
});
