import {Input} from '@/components/ui/input';
import {useGetHouseholdAccounts} from '@/modules/accounts/hooks/useGetHouseholdAccounts';
import {useGetMe} from '@/modules/auth/hooks/useGetMe';
import {useGetHouseholdCategories} from '@/modules/categories/hooks/useGetHouseholdCategories';
import AccountCombobox from './selects/account-combobox';
import CategoryCombobox from './selects/category-combobox';

const TransactionsTableActions = () => {
  const {data: me} = useGetMe();
  const {data: accounts} = useGetHouseholdAccounts(me?.householdId ?? '');
  const {data: categories} = useGetHouseholdCategories(me?.householdId ?? '');

  return (
    <section className="mb-5">
      <div className="flex items-center justify-between gap-3">
        <Input className="max-w-sm" placeholder="Search transactions" />
        <div className="flex items-center gap-2">
          <AccountCombobox accounts={accounts ?? []} placeholder="Select account" />
          <CategoryCombobox categories={categories ?? []} placeholder="Select category" />
        </div>
      </div>
    </section>
  );
};

export default TransactionsTableActions;
