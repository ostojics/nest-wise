import {mainLinks} from '@/common/constants/main-links';
import {Button} from '@/components/ui/button';
import {Separator} from '@/components/ui/separator';
import {SidebarTrigger} from '@/components/ui/sidebar';
import {CreateTransactionDialog} from '@/modules/transactions/components/create-transaction-dialog';
import {IconInvoice} from '@tabler/icons-react';
import {useLocation} from '@tanstack/react-router';
import {useMemo, useState} from 'react';

export function SiteHeader() {
  const {pathname} = useLocation();
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);

  const title = useMemo(() => {
    return mainLinks.find((link) => {
      return pathname.startsWith(link.url);
    })?.title;
  }, [pathname]);

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <h1 className="text-base font-medium">{title}</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button
            size="sm"
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg border-0 font-medium px-4 py-2"
            onClick={() => setIsTransactionDialogOpen(true)}
          >
            <IconInvoice className="w-4 h-4" />
            <span>Zabeleži transakciju</span>
          </Button>
        </div>
      </div>

      <CreateTransactionDialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen} />
    </header>
  );
}
