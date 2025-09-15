import {Skeleton} from '@/components/ui/skeleton';
import {useGetHouseholdAccounts} from '../hooks/useGetHouseholdAccounts';
import Account from './account';

const AccountsList = () => {
  const {data: accounts, isLoading} = useGetHouseholdAccounts();

  if (isLoading) {
    return (
      <div className="mt-6 grid grid-cols-2 gap-4 @5xl/main:grid-cols-3">
        {Array.from({length: 6}).map((_, index) => (
          <div key={index} className="space-y-4 rounded-xl border p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="flex items-center justify-between pt-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!accounts || accounts.length === 0) {
    return (
      <div className="mt-6 flex flex-col items-center justify-center py-12">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground">No accounts found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Create your first account to get started with managing your finances.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 grid grid-cols-1 @[871px]/list:grid-cols-2 gap-4">
      {accounts.map((account) => (
        <Account key={account.id} account={account} />
      ))}
    </div>
  );
};

export default AccountsList;
