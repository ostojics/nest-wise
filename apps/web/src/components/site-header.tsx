import {mainLinks} from '@/common/constants/main-links';
import {Button} from '@/components/ui/button';
import {Separator} from '@/components/ui/separator';
import {SidebarTrigger} from '@/components/ui/sidebar';
import {IconInvoice} from '@tabler/icons-react';
import {useLocation} from '@tanstack/react-router';
import {useMemo} from 'react';

export function SiteHeader() {
  const {pathname} = useLocation();

  const title = useMemo(() => {
    return mainLinks.find((link) => {
      return link.url === pathname;
    })?.title;
  }, [pathname]);

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <h1 className="text-base font-medium">{title}</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm">
            <IconInvoice /> New transaction
          </Button>
        </div>
      </div>
    </header>
  );
}
