import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import {RouterProvider} from '@tanstack/react-router';
import {Toaster} from './components/ui/sonner';
import {router} from './router';
import {useGetMe} from './modules/auth/hooks/use-get-me';
import {Loader2} from 'lucide-react';

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
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster />
    </>
  );
};

export default App;
