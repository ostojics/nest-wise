import {Skeleton} from '@/components/ui/skeleton';
import {useGetHouseholdAccounts} from '../hooks/use-get-household-accounts';
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
          <h3 className="text-lg font-semibold text-foreground">Nema pronađenih računa</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Kreirajte prvi finansijski račun da biste započeli upravljanje finansijama.
          </p>
        </div>
      </div>
    );
  }

  const activeAccounts = accounts.filter((account) => account.isActive);
  const inactiveAccounts = accounts.filter((account) => !account.isActive);

  return (
    <div className="mt-6 space-y-8">
      {/* Active Accounts Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Aktivni računi</h3>
        {activeAccounts.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nema aktivnih računa</p>
        ) : (
          <div className="grid grid-cols-1 @[871px]/list:grid-cols-2 gap-4">
            {activeAccounts.map((account) => (
              <Account key={account.id} account={account} />
            ))}
          </div>
        )}
      </div>

      {/* Inactive Accounts Section */}
      {inactiveAccounts.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Neaktivni računi</h3>
          <div className="grid grid-cols-1 @[871px]/list:grid-cols-2 gap-4">
            {inactiveAccounts.map((account) => (
              <Account key={account.id} account={account} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountsList;
