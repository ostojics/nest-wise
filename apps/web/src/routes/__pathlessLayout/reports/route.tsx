import {createFileRoute, Outlet, redirect} from '@tanstack/react-router';
import ReportsNav from '@/modules/reports/components/reports-nav';

export const Route = createFileRoute('/__pathlessLayout/reports')({
  component: RouteComponent,
  beforeLoad: ({location}) => {
    if (location.pathname === '/reports') {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({to: '/reports/spending'});
    }
  },
});

function RouteComponent() {
  return (
    <section className="p-4 flex flex-col h-full">
      <ReportsNav />
      <Outlet />
    </section>
  );
}
