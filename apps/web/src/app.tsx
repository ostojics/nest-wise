import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import {RouterProvider} from '@tanstack/react-router';
import {Toaster} from './components/ui/sonner';
import {router} from './router';
import {useGetMe} from './modules/auth/hooks/useGetMe';

const App = () => {
  const {data, isLoading, isError} = useGetMe();
  if (isLoading) return <></>;

  return (
    <>
      <RouterProvider router={router} context={{isAuthenticated: Boolean(data && !isError)}} />
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster />
    </>
  );
};

export default App;
