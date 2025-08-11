import {Button} from '@/components/ui/button';
import {useGetHouseholdAccounts} from '@/modules/accounts/hooks/useGetHouseholdAccounts';
import {useGetMe} from '@/modules/auth/hooks/useGetMe';
import {useGetHouseholdCategories} from '@/modules/categories/hooks/useGetHouseholdCategories';
import AccountCombobox from './selects/account-combobox';
import CategoryCombobox from './selects/category-combobox';
import TransactionDateFromPicker from './selects/transaction-date-from';
import TransactionDateToPicker from './selects/transaction-date-to';
import TransactionsTableSearch from './transactions-table-search';
import {useNavigate} from '@tanstack/react-router';

const TransactionsTableActions = () => {
  const {data: me} = useGetMe();
  const navigate = useNavigate();
  const {data: accounts} = useGetHouseholdAccounts(me?.householdId ?? '');
  const {data: categories} = useGetHouseholdCategories(me?.householdId ?? '');

  return (
    <section className="mb-5">
      <div className="flex flex-col justify-between gap-3">
        <TransactionsTableSearch />
        <div className="flex items-center gap-2">
          <AccountCombobox accounts={accounts ?? []} />
          <CategoryCombobox categories={categories ?? []} />
          <TransactionDateFromPicker />
          <TransactionDateToPicker />
          <Button onClick={() => navigate({search: {page: 1, pageSize: 15}, to: '/transactions'})}>
            Reset filters
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TransactionsTableActions;
