import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {lazy, StrictMode, Suspense} from 'react';
import {createRoot} from 'react-dom/client';
import App from './app';
import './index.css';
import {router} from './router';
import {setDefaultOptions} from 'date-fns';
import {srLatn} from 'date-fns/locale';
import {Loader2} from 'lucide-react';
import {ErrorBoundary} from 'react-error-boundary';
import {DefaultErrorComponent} from './components/error-boundary';

// Lazy load PostHog for non-critical analytics
const PostHogProvider = lazy(() =>
  import('posthog-js/react').then((module) => ({
    default: module.PostHogProvider,
  })),
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes
      retry: 1,
    },
  },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

setDefaultOptions({locale: srLatn});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

async function enableMocking() {
  if (import.meta.env.VITE_MSW_ENABLED !== 'true') {
    return;
  }

  const {worker} = await import('./msw/worker');
  return worker.start({
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
    onUnhandledRequest: 'warn',
  });
}

enableMocking()
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to start MSW:', error);
  })
  .finally(() => {
    createRoot(rootElement).render(
      <StrictMode>
        <Suspense
          fallback={
            <div className="flex justify-center items-center h-screen">
              <Loader2 className="animate-spin size-4" />
            </div>
          }
        >
          <PostHogProvider
            apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
            options={{
              api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
              defaults: '2025-05-24',
              capture_exceptions: true,
              debug: import.meta.env.DEV,
            }}
          >
            <ErrorBoundary FallbackComponent={DefaultErrorComponent}>
              <QueryClientProvider client={queryClient}>
                <App />
              </QueryClientProvider>
            </ErrorBoundary>
          </PostHogProvider>
        </Suspense>
      </StrictMode>,
    );
  });
