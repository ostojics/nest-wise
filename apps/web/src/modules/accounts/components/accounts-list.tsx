import {useGetMe} from '@/modules/auth/hooks/useGetMe';
import {useGetHouseholdAccounts} from '../hooks/useGetHouseholdAccounts';
import {useGetHouseholdById} from '@/modules/households/hooks/useGetHouseholdById';
import Account from './account';
import AccountsListSkeleton from './accounts-list.skeleton';
import AccountsListEmpty from './accounts-list.empty';
import AccountsListError from './accounts-list.error';

const AccountsList = () => {
  const {data: me} = useGetMe();
  const {data: household} = useGetHouseholdById(me?.householdId ?? '');
  const {data: accounts, isLoading, isError, refetch} = useGetHouseholdAccounts(household?.id ?? '');

  if (isLoading) {
    return <AccountsListSkeleton />;
  }

  if (isError) {
    return <AccountsListError onRetry={refetch} />;
  }

  if (!accounts || accounts.length === 0) {
    return <AccountsListEmpty />;
  }

  const shared = accounts.filter((a) => a.variant === 'shared');
  const priv = accounts.filter((a) => a.variant === 'private');

  return (
    <div className="mt-6 space-y-8">
      <section>
        <h3 className="text-base font-semibold text-foreground">Shared accounts</h3>
        {shared.length === 0 ? (
          <AccountsListEmpty />
        ) : (
          <div className="mt-4 grid grid-cols-1 @[871px]/list:grid-cols-2 gap-4">
            {shared.map((account) => (
              <Account key={account.id} account={account} />
            ))}
          </div>
        )}
      </section>
      <section>
        <h3 className="text-base font-semibold text-foreground">Private accounts</h3>
        {priv.length === 0 ? (
          <AccountsListEmpty />
        ) : (
          <div className="mt-4 grid grid-cols-1 @[871px]/list:grid-cols-2 gap-4">
            {priv.map((account) => (
              <Account key={account.id} account={account} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AccountsList;
