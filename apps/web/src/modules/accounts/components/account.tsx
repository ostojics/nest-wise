import React from 'react';
import {AccountContract} from '@nest-wise/contracts';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Switch} from '@/components/ui/switch';
import {Label} from '@/components/ui/label';
import {accountTypes} from '@/common/constants/account-types';
import {format} from 'date-fns';
import {cn} from '@/lib/utils';
import {useFormatBalance} from '@/modules/formatting/hooks/use-format-balance';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {activateAccount, deactivateAccount} from '@/modules/api/accounts-api';
import {toast} from 'sonner';
import {queryKeys} from '@/modules/api/query-keys';
import EditAccountDialog from './edit-account-dialog';

interface AccountProps {
  account: AccountContract;
}

const Account: React.FC<AccountProps> = ({account}) => {
  const {formatBalance} = useFormatBalance();
  const queryClient = useQueryClient();
  const accountType = accountTypes.find((type) => type.value === account.type);
  const IconComponent = accountType?.icon;

  const formatDate = (date: Date) => {
    return format(new Date(date), 'dd.MM.yyyy.');
  };

  const activateMutation = useMutation({
    mutationFn: () => activateAccount(account.id),
    onSuccess: () => {
      void queryClient.invalidateQueries({queryKey: queryKeys.accounts.all()});
      toast.success('Račun je aktiviran.');
    },
    onError: () => {
      toast.error('Došlo je do greške. Pokušajte ponovo.');
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: () => deactivateAccount(account.id),
    onSuccess: () => {
      void queryClient.invalidateQueries({queryKey: queryKeys.accounts.all()});
      toast.success('Račun je deaktiviran.');
    },
    onError: () => {
      toast.error('Došlo je do greške. Pokušajte ponovo.');
    },
  });

  const handleToggleActive = (checked: boolean) => {
    if (checked) {
      activateMutation.mutate();
      return;
    }

    deactivateMutation.mutate();
  };

  return (
    <Card
      className={cn(
        '@container/account-card hover:shadow-md transition-shadow duration-200',
        !account.isActive && 'opacity-60',
      )}
    >
      <CardHeader>
        <div className="flex flex-col items-start gap-3 md:gap-0 md:flex-row md:items-center justify-between">
          <div className="flex items-center gap-3">
            {IconComponent && (
              <div className="flex h-10 min-w-10 items-center justify-center rounded-lg bg-accent/50">
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
          <div className="flex items-center gap-2">
            {!account.isActive && (
              <Badge variant="secondary" className="text-xs">
                Neaktivan
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {formatDate(account.createdAt)}
            </Badge>
            <EditAccountDialog account={account} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-start @lg/account-card:flex-row  @lg/account-card:items-center justify-between">
          <div className="text-sm text-muted-foreground">Trenutno stanje</div>
          <div
            className={cn(
              'text-right font-semibold tabular-nums',
              account.currentBalance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
            )}
          >
            {formatBalance(account.currentBalance)}
          </div>
        </div>
        <div className="flex items-center justify-between pt-2 border-t">
          <Label htmlFor={`account-active-${account.id}`} className="text-sm font-normal cursor-pointer">
            Aktivan račun
          </Label>
          <Switch
            id={`account-active-${account.id}`}
            checked={account.isActive}
            onCheckedChange={handleToggleActive}
            disabled={activateMutation.isPending || deactivateMutation.isPending}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default Account;
