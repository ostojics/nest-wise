import * as React from 'react';

import {NavMain} from '@/components/nav-main';
import {NavUser} from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {useGetHouseholdById} from '@/modules/households/hooks/use-get-household-by-id';
import {HouseIcon} from 'lucide-react';
import {IconHelp, IconSettings} from '@tabler/icons-react';
import {NavSecondary} from './nav-secondary';
import HelpDialog from './help-dialog';

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
  const {data: household} = useGetHouseholdById();
  const [helpDialogOpen, setHelpDialogOpen] = React.useState(false);

  const navSecondary = [
    {
      title: 'Podešavanja',
      url: '#',
      icon: IconSettings,
    },
    {
      title: 'Pomoć',
      icon: IconHelp,
      onClick: () => setHelpDialogOpen(true),
    },
  ];

  return (
    <>
      <Sidebar collapsible="offcanvas" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
                <a href="#">
                  <HouseIcon className="!size-5" />
                  <span className="text-base font-semibold">{household?.name}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <NavMain />
          <NavSecondary items={navSecondary} className="mt-auto" />
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
          {/* TODO: Add version */}
          {/* <SidebarMenuItem>
          <p className="text-xs text-muted-foreground">v 0.0.1</p>
        </SidebarMenuItem> */}
        </SidebarFooter>
      </Sidebar>
      <HelpDialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen} />
    </>
  );
}
