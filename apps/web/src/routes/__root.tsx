import {createRootRoute, Outlet} from '@tanstack/react-router';
import {TanStackRouterDevtools} from '@tanstack/react-router-devtools';

export const Route = createRootRoute({
  component: () => (
    <section className="bg-primary-foreground h-screen w-screen">
      <Outlet />
      <TanStackRouterDevtools position="bottom-left" />
    </section>
  ),
});
