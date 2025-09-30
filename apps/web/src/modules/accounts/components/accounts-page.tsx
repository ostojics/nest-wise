//
import AccountsList from './accounts-list';
import CreateAccount from './create-account';
import TransferFundsDialog from './transfer-funds-dialog';
import TextBanner from '@/components/text-banner';

const AccountsPage = () => {
  return (
    <section className="p-4">
      <TextBanner
        className="mb-6"
        aria-label="Pregled računa"
        text="Računi su mesta gde se nalazi vaš novac. Dodajte one koje koristite i održavajte stanje ažurnim beleženjem transakcija."
      />
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
