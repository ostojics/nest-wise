import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import {RouterProvider} from '@tanstack/react-router';
import {Toaster} from './components/ui/sonner';
import {router} from './router';
import {useGetMe} from './modules/auth/hooks/use-get-me';
import {Loader2} from 'lucide-react';
import {PwaUpdater} from './pwa/pwa-updater';
import {useGetUserPreferences} from './modules/user-preferences/hooks/use-get-user-preferences';
import {useLogOut} from './modules/auth/hooks/use-log-out';
import {useEffect, useRef, useCallback} from 'react';

const App = () => {
  const {data, isLoading, isError} = useGetMe();
  const {data: userPreferences} = useGetUserPreferences();
  const {mutate: logout} = useLogOut();
  const automaticLogoutRef = useRef(false);

  // Update ref when preferences change
  useEffect(() => {
    automaticLogoutRef.current = userPreferences?.automaticLogout === true;
  }, [userPreferences?.automaticLogout]);

  // Create a stable logout callback
  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  // Cleanup on unmount - call logout if automatic logout is enabled
  useEffect(() => {
    return () => {
      if (automaticLogoutRef.current) {
        handleLogout();
      }
    };
  }, [handleLogout]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin size-4" />
      </div>
    );

  return (
    <>
      <RouterProvider router={router} context={{isAuthenticated: Boolean(data && !isError)}} />
      <ReactQueryDevtools initialIsOpen={false} />
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
