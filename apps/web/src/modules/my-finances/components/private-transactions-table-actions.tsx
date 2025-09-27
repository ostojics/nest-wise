import {Button} from '@/components/ui/button';
import {useGetHouseholdAccounts} from '@/modules/accounts/hooks/use-get-household-accounts';
import PrivateTransactionsTableSearch from './private-transactions-table-search';
import PrivateTransactionDateFromPicker from './selects/transaction-date-from';
import PrivateTransactionDateToPicker from './selects/transaction-date-to';
import AccountCombobox from './selects/account-combobox';
import {useNavigate} from '@tanstack/react-router';

const PrivateTransactionsTableActions = () => {
  const navigate = useNavigate();
  const {data: accounts} = useGetHouseholdAccounts();

  return (
    <section className="mb-5 @container/transactions-table-actions">
      <div className="flex flex-col justify-between gap-3">
        <PrivateTransactionsTableSearch />
        <div className="grid grid-cols-1 gap-2 @lg/transactions-table-actions:grid-cols-2 @4xl/transactions-table-actions:grid-cols-4 @7xl/transactions-table-actions:flex @7xl/transactions-table-actions:flex-row @7xl/transactions-table-actions:items-center">
          <AccountCombobox accounts={accounts ?? []} />
          <PrivateTransactionDateFromPicker />
          <PrivateTransactionDateToPicker />
          <Button onClick={() => navigate({to: '/my-finances'})}>Reset filters</Button>
        </div>
      </div>
    </section>
  );
};

export default PrivateTransactionsTableActions;
