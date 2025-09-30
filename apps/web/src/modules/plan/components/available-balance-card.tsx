import {Card, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {useGetHouseholdAccounts} from '@/modules/accounts/hooks/use-get-household-accounts';
import {useFormatBalance} from '@/modules/formatting/hooks/use-format-balance';
import {IconWallet} from '@tabler/icons-react';
import {useMemo} from 'react';
import AvailableBalanceCardSkeleton from './available-balance-card.skeleton';
import AvailableBalanceCardError from './available-balance-card.error';

const AvailableBalanceCard = () => {
  const {data: accounts, isLoading, isError, refetch} = useGetHouseholdAccounts();
  const {formatBalance} = useFormatBalance();
  const accountCount = accounts?.length ?? 0;

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
    <Card className="flex-1 hover:shadow-md transition-all duration-200">
      <CardHeader>
        <CardDescription className="flex items-center gap-2">
          <IconWallet className="h-4 w-4" />
          Raspoloživo stanje
        </CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl transition-colors text-green-600 dark:text-green-400">
          {formatBalance(netWorth)}
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium items-center">Ukupno raspoloživo stanje</div>
        <div className="text-muted-foreground">Broj računa: {accountCount}</div>
      </CardFooter>
    </Card>
  );
};

export default AvailableBalanceCard;
