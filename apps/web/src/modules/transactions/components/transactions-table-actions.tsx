import {Button} from '@/components/ui/button';
import {useGetActiveHouseholdAccounts} from '@/modules/accounts/hooks/use-get-active-household-accounts';
import {useGetHouseholdCategories} from '@/modules/categories/hooks/use-get-household-categories';
import AccountCombobox from './selects/account-combobox';
import CategoryCombobox from './selects/category-combobox';
import TransactionDateFromPicker from './selects/transaction-date-from';
import TransactionDateToPicker from './selects/transaction-date-to';
import TransactionsTableSearch from './transactions-table-search';
import {useNavigate} from '@tanstack/react-router';

const TransactionsTableActions = () => {
  const navigate = useNavigate();
  const {data: accounts} = useGetActiveHouseholdAccounts();
  const {data: categories} = useGetHouseholdCategories();

  return (
    <section className="mb-6 p-4 rounded-xl border-none shadow-sm bg-card/50 @container/transactions-table-actions">
      <div className="flex flex-col justify-between gap-3">
        <TransactionsTableSearch />
        <div className="grid grid-cols-1 gap-2 @lg/transactions-table-actions:grid-cols-2 @4xl/transactions-table-actions:grid-cols-4 @7xl/transactions-table-actions:flex @7xl/transactions-table-actions:flex-row @7xl/transactions-table-actions:items-center">
          <AccountCombobox accounts={accounts ?? []} />
          <CategoryCombobox categories={categories ?? []} />
          <TransactionDateFromPicker />
          <TransactionDateToPicker />
          <Button
            variant="ghost"
            onClick={() => navigate({to: '/transactions'})}
            className="text-muted-foreground hover:text-foreground"
          >
            Poništi filtere
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TransactionsTableActions;
