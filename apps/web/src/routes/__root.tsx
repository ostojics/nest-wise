import {createRootRoute, Outlet} from '@tanstack/react-router';
import {TanStackRouterDevtools} from '@tanstack/react-router-devtools';

export const Route = createRootRoute({
  component: () => (
    <section className="bg-foreground h-screen w-screen flex items-center justify-center">
      <Outlet />
      <TanStackRouterDevtools position="bottom-left" />
    </section>
  ),
});
