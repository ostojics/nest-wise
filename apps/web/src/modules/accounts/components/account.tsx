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
import {useActivateAccountMutation} from '../hooks/use-activate-account-mutation';
import {useDeactivateAccountMutation} from '../hooks/use-deactivate-account-mutation';
import EditAccountDialog from './edit-account-dialog';

interface AccountProps {
  account: AccountContract;
}

const Account: React.FC<AccountProps> = ({account}) => {
  const {formatBalance} = useFormatBalance();
  const accountType = accountTypes.find((type) => type.value === account.type);
  const IconComponent = accountType?.icon;

  const formatDate = (date: Date) => {
    return format(new Date(date), 'dd.MM.yyyy.');
  };

  const activateMutation = useActivateAccountMutation(account.id);
  const deactivateMutation = useDeactivateAccountMutation(account.id);

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
        'border-none shadow-sm bg-card/50 hover:bg-card hover:shadow-md transition-all duration-300',
        !account.isActive && 'opacity-60 grayscale-[0.5]',
      )}
      data-testid={`account-card-${account.name}`}
    >
      <CardHeader className="pb-2">
        <div className="flex flex-col items-start gap-3 md:gap-0 md:flex-row md:items-start justify-between">
          <div className="flex items-start gap-3">
            {IconComponent && (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <IconComponent className="h-5 w-5" />
              </div>
            )}
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold" data-testid="account-name">
                {account.name}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {accountType?.label ?? account.type}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end md:self-start">
            {!account.isActive && (
              <Badge variant="secondary" className="text-xs font-normal">
                Neaktivan
              </Badge>
            )}
            <EditAccountDialog account={account} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-2">
        <div className="flex flex-col gap-1">
          <div className="text-sm text-muted-foreground">Trenutno stanje</div>
          <div
            className={cn(
              'text-2xl font-bold tabular-nums',
              account.currentBalance >= 0 ? 'text-foreground' : 'text-red-600 dark:text-red-400',
            )}
            data-testid="account-balance"
          >
            {formatBalance(account.currentBalance)}
          </div>
        </div>

        <div className="w-full h-px bg-border/50" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-normal text-muted-foreground border-border/50">
              Kreiran {formatDate(account.createdAt)}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Label
              htmlFor={`account-active-${account.id}`}
              className="text-xs text-muted-foreground font-normal cursor-pointer"
            >
              {account.isActive ? 'Aktivan' : 'Neaktivan'}
            </Label>
            <Switch
              id={`account-active-${account.id}`}
              checked={account.isActive}
              onCheckedChange={handleToggleActive}
              disabled={activateMutation.isPending || deactivateMutation.isPending}
              className="scale-75 origin-right"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Account;
