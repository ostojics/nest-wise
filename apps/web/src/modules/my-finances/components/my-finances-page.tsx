import {CreatePrivateTransactionDialog} from './create-private-transaction-dialog';

const MyFinancesPage = () => {
  return (
    <section className="p-4 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My Finances</h1>
        <p className="text-muted-foreground mt-1">
          This page shows only your private finances. Use it to review and log your personal expenses and income.
        </p>
      </div>
      <div className="mt-7">
        <CreatePrivateTransactionDialog />
      </div>
    </section>
  );
};

export default MyFinancesPage;
