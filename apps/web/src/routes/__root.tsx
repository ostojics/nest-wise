import {createRootRouteWithContext, Outlet} from '@tanstack/react-router';
import {TanStackRouterDevtools} from '@tanstack/react-router-devtools';

interface RouterContext {
  isAuthenticated: boolean;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <section className="bg-background w-full min-h-screen">
      <Outlet />
      <TanStackRouterDevtools position="bottom-left" />
    </section>
  ),
});
