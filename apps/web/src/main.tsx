import {RouterProvider} from '@tanstack/react-router';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {router} from './router';

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
