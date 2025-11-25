import {Skeleton} from '@/components/ui/skeleton';
import {useGetHouseholdAccounts} from '../hooks/use-get-household-accounts';
import Account from './account';

const AccountsList = () => {
  const {data: accounts, isLoading} = useGetHouseholdAccounts();

  if (isLoading) {
    return (
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({length: 4}).map((_, index) => (
          <div key={index} className="space-y-4 rounded-xl border-none shadow-sm bg-card/50 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
            <div className="space-y-2 pt-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-8 w-32" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!accounts || accounts.length === 0) {
    return (
      <div className="mt-6 flex flex-col items-center justify-center py-16 rounded-xl border-none shadow-sm bg-card/50 text-center">
        <div className="p-4 rounded-full bg-muted/30 mb-4">
          <div className="h-8 w-8 rounded-full bg-muted" />
        </div>
        <h3 className="text-lg font-medium text-foreground">Nema pronađenih računa</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
          Kreirajte prvi finansijski račun da biste započeli upravljanje finansijama.
        </p>
      </div>
    );
  }

  const activeAccounts = accounts.filter((account) => account.isActive);
  const inactiveAccounts = accounts.filter((account) => !account.isActive);

  return (
    <div className="mt-8 space-y-10">
      {/* Active Accounts Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4 pl-1">Aktivni računi</h3>
        {activeAccounts.length === 0 ? (
          <div className="p-8 rounded-xl border-none shadow-sm bg-card/50 text-center text-muted-foreground text-sm">
            Nema aktivnih računa
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeAccounts.map((account) => (
              <Account key={account.id} account={account} />
            ))}
          </div>
        )}
      </div>

      {/* Inactive Accounts Section */}
      {inactiveAccounts.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 pl-1">Neaktivni računi</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
