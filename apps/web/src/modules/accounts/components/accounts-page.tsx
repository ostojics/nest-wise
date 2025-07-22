import AccountsList from './accounts-list';
import CreateAccount from './create-account';

const AccountsPage = () => {
  return (
    <section className="p-4">
      <div className="flex items-center justify-between">
        <CreateAccount />
      </div>
      <AccountsList />
    </section>
  );
};

export default AccountsPage;
