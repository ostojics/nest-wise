import {Card, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {useGetHouseholdAccounts} from '@/modules/accounts/hooks/useGetHouseholdAccounts';
import {useGetMe} from '@/modules/auth/hooks/useGetMe';
import {useFormatBalance} from '@/modules/formatting/hooks/useFormatBalance';
import {IconWallet} from '@tabler/icons-react';
import React, {useMemo} from 'react';
import NetWorthCardSkeleton from './net-worth-card.skeleton';
import NetWorthCardError from './net-worth-card.error';

const NetWorthCard: React.FC = () => {
  const {data: me} = useGetMe();
  const {data: accounts, isLoading, isError, refetch} = useGetHouseholdAccounts(me?.householdId ?? '');
  const {formatBalance} = useFormatBalance();
  const accountCount = accounts?.length ?? 0;

  const netWorth = useMemo(() => {
    if (!accounts || accounts.length === 0) return 0;

    return accounts.reduce((total, account) => {
      return total + (account.currentBalance || 0);
    }, 0);
  }, [accounts]);

  if (isLoading) {
    return <NetWorthCardSkeleton />;
  }

  if (isError) {
    return <NetWorthCardError onRetry={refetch} />;
  }

  return (
    <Card className="flex-1 hover:shadow-md transition-all duration-200">
      <CardHeader>
        <CardDescription className="flex items-center gap-2">
          <IconWallet className="h-4 w-4" />
          Net Worth
        </CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl transition-colors text-green-600 dark:text-green-400">
          {formatBalance(netWorth)}
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium items-center">Total household value</div>
        <div className="text-muted-foreground">
          Across {accountCount} {accountCount === 1 ? 'account' : 'accounts'}
        </div>
      </CardFooter>
    </Card>
  );
};

export default NetWorthCard;
