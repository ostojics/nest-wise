import {lazy, Suspense} from 'react';
import {RouterProvider} from '@tanstack/react-router';
import {Toaster} from './components/ui/sonner';
import {router} from './router';
import {useGetMe} from './modules/auth/hooks/use-get-me';
import {Loader2} from 'lucide-react';
import {PwaUpdater} from './pwa/pwa-updater';

// Lazy load ReactQueryDevtools only in development
const ReactQueryDevtools = import.meta.env.DEV
  ? lazy(() =>
      import('@tanstack/react-query-devtools').then((module) => ({
        default: module.ReactQueryDevtools,
      })),
    )
  : () => null;

const App = () => {
  const {data, isLoading, isError} = useGetMe();
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin size-4" />
      </div>
    );

  return (
    <>
      <RouterProvider router={router} context={{isAuthenticated: Boolean(data && !isError)}} />
      {import.meta.env.DEV && (
        <Suspense fallback={null}>
          <ReactQueryDevtools initialIsOpen={false} />
        </Suspense>
      )}
      <Toaster
        toastOptions={{
          classNames: {
            toast: 'app-toast',
          },
        }}
      />
      <PwaUpdater />
    </>
  );
};

export default App;
