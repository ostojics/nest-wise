import {Card, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {useGetActiveHouseholdAccounts} from '@/modules/accounts/hooks/use-get-active-household-accounts';
import {useFormatBalance} from '@/modules/formatting/hooks/use-format-balance';
import {IconWallet} from '@tabler/icons-react';
import {useMemo} from 'react';
import AvailableBalanceCardSkeleton from './available-balance-card.skeleton';
import AvailableBalanceCardError from './available-balance-card.error';
import AccountTypeTotals from '@/modules/accounts/components/account-type-totals';

const AvailableBalanceCard = () => {
  const {data: accounts, isLoading, isError, refetch} = useGetActiveHouseholdAccounts();
  const {formatBalance} = useFormatBalance();

  const netWorth = useMemo(() => {
    if (!accounts || accounts.length === 0) return 0;

    return accounts.reduce((total, account) => {
      return total + Number(account.currentBalance);
    }, 0);
  }, [accounts]);

  if (isLoading) {
    return <AvailableBalanceCardSkeleton />;
  }

  if (isError) {
    return <AvailableBalanceCardError onRetry={refetch} />;
  }

  return (
    <Card className="flex-1 h-full border-none shadow-sm bg-card/50 hover:bg-card hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-2">
        <CardDescription className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <div className="p-1.5 bg-primary/10 rounded-full text-primary">
            <IconWallet className="h-4 w-4" />
          </div>
          Raspoloživo stanje
        </CardDescription>
        <CardTitle className="text-4xl font-medium tabular-nums tracking-tight text-foreground mt-2">
          {formatBalance(netWorth)}
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-3 pt-4">
        <div className="w-full h-px bg-border/50" />
        <div className="w-full text-sm text-muted-foreground">
          <div className="mb-2 text-xs font-medium uppercase tracking-wider opacity-70">Po tipu računa</div>
          <AccountTypeTotals accounts={accounts ?? []} maxInlineItems={3} />
        </div>
      </CardFooter>
    </Card>
  );
};

export default AvailableBalanceCard;
