//
import AccountsList from './accounts-list';
import CreateAccount from './create-account';
import TransferFundsDialog from './transfer-funds-dialog';

const AccountsPage = () => {
  return (
    <section className="p-4">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="space-y-1">
          <h3 className="text-2xl font-bold">Računi</h3>
          <p className="text-muted-foreground">Upravljajte svojim finansijskim računima i pratite stanje.</p>
        </div>
        <div className="flex items-center gap-2">
          <CreateAccount />
          <TransferFundsDialog />
        </div>
      </div>

      <AccountsList />
    </section>
  );
};

export default AccountsPage;
