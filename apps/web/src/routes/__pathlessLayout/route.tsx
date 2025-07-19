import {createFileRoute, Outlet} from '@tanstack/react-router';
import {AppSidebar} from '@/components/app-sidebar';
import {SiteHeader} from '@/components/site-header';
import {SidebarInset, SidebarProvider} from '@/components/ui/sidebar';

export const Route = createFileRoute('/__pathlessLayout')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <section className="flex flex-1 flex-col">
          {/* <div className="@container/main flex flex-1 flex-col gap-2"> */}
          <Outlet />
          {/* </div> */}
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}
