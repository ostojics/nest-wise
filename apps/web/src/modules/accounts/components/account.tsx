import React from 'react';
import {AccountContract} from '@maya-vault/contracts';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {accountTypes} from '@/common/constants/account-types';
import {format} from 'date-fns';
import {cn} from '@/lib/utils';

interface AccountProps {
  account: AccountContract;
}

const Account: React.FC<AccountProps> = ({account}) => {
  const accountType = accountTypes.find((type) => type.value === account.type);
  const IconComponent = accountType?.icon;

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(balance);
  };

  const formatDate = (date: Date) => {
    return format(new Date(date), 'MMM dd, yyyy');
  };

  return (
    <Card className="@container/card hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <div className="flex flex-col items-start gap-3 md:gap-0 md:flex-row md:items-center justify-between">
          <div className="flex items-center gap-3">
            {IconComponent && (
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/50">
                <IconComponent className="h-5 w-5 text-accent-foreground" />
              </div>
            )}
            <div>
              <CardTitle className="text-md font-semibold">{account.name}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {accountType?.label ?? account.type}
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {formatDate(account.createdAt)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">Current Balance</div>
          <div
            className={cn(
              'text-right font-semibold tabular-nums',
              account.currentBalance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
            )}
          >
            {formatBalance(account.currentBalance)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Account;
