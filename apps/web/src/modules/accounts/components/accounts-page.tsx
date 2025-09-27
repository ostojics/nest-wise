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
        aria-label="Accounts overview"
        text="Accounts are the places your money lives. Add the ones you use, keep balances up to date by recording transactions, and move money between them with Transfer Funds."
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
