import {createFileRoute, Outlet, redirect} from '@tanstack/react-router';

export const Route = createFileRoute('/__pathlessLayout/reports')({
  component: RouteComponent,
  beforeLoad: ({location}) => {
    if (location.pathname === '/reports') {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({to: '/reports/category-spending'});
    }
  },
});

function RouteComponent() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
