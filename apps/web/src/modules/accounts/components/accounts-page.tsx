//
import AccountsList from './accounts-list';
import CreateAccount from './create-account';
import TransferFundsDialog from './transfer-funds-dialog';

const AccountsPage = () => {
  return (
    <section className="p-4">
      <div className="flex items-center gap-2">
        <CreateAccount />
        <TransferFundsDialog />
      </div>
      <div className="@container/list">
        <AccountsList />
      </div>
    </section>
  );
};

export default AccountsPage;
