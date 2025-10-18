import {useState} from 'react';
import {AccountContract} from '@nest-wise/contracts';
import {accountTypes} from '@/common/constants/account-types';
import {useFormatBalance} from '@/modules/formatting/hooks/use-format-balance';
import {Button} from '@/components/ui/button';
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog';
import {cn} from '@/lib/utils';

interface AccountTypeTotalsProps {
  accounts: AccountContract[];
  maxInlineItems?: number;
  className?: string;
}

interface AccountTypeTotal {
  type: string;
  label: string;
  total: number;
  Icon?: React.ComponentType<{className?: string}>;
}

const AccountTypeTotals = ({accounts, maxInlineItems = 3, className}: AccountTypeTotalsProps) => {
  const {formatBalance} = useFormatBalance();
  const [dialogOpen, setDialogOpen] = useState(false);

  // Group accounts by type and calculate totals
  const accountTypeTotals: AccountTypeTotal[] = Object.entries(
    accounts.reduce(
      (acc, account) => {
        const type = account.type;
        acc[type] ??= 0;
        acc[type] += Number(account.currentBalance);
        return acc;
      },
      {} as Record<string, number>,
    ),
  ).map(([type, total]) => {
    const typeInfo = accountTypes.find((t) => t.value === type);
    return {
      type,
      label: typeInfo?.label ?? 'Drugo',
      total,
      Icon: typeInfo?.icon,
    };
  });

  // Sort by total descending, then by label ascending
  accountTypeTotals.sort((a, b) => {
    if (b.total !== a.total) {
      return b.total - a.total;
    }
    return a.label.localeCompare(b.label, 'sr');
  });

  // Handle edge case: no accounts
  if (accountTypeTotals.length === 0) {
    return <div className={cn('text-sm text-muted-foreground', className)}>Nema računa</div>;
  }

  // Split into inline and remaining items
  const inlineItems = accountTypeTotals.slice(0, maxInlineItems);
  const remainingItems = accountTypeTotals.slice(maxInlineItems);
  const hasMoreItems = remainingItems.length > 0;

  return (
    <div className={cn('text-sm text-muted-foreground', className)}>
      <ul className="space-y-1">
        {inlineItems.map((item) => (
          <li key={item.type}>
            {item.label}: <span className="tabular-nums">{formatBalance(item.total)}</span>
          </li>
        ))}
      </ul>
      {hasMoreItems && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="mt-1 h-auto p-0 text-sm font-normal hover:bg-transparent"
              aria-label={`Prikaži ${remainingItems.length} dodatnih tipova računa`}
            >
              +{remainingItems.length}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Stanja po tipovima računa</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              {accountTypeTotals.map((item) => {
                const Icon = item.Icon;
                return (
                  <div key={item.type} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
                      <span className="text-sm">{item.label}</span>
                    </div>
                    <span className="text-sm font-medium tabular-nums">{formatBalance(item.total)}</span>
                  </div>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AccountTypeTotals;
