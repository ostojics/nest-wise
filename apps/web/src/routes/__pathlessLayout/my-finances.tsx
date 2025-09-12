import MyFinancesPage from '@/modules/my-finances/components/my-finances-page';
import {getPrivateTransactionsQuerySchema} from '@maya-vault/contracts';
import {createFileRoute} from '@tanstack/react-router';

export const Route = createFileRoute('/__pathlessLayout/my-finances')({
  component: RouteComponent,
  validateSearch: getPrivateTransactionsQuerySchema,
});

function RouteComponent() {
  return (
    <section className="p-4">
      <MyFinancesPage />
    </section>
  );
}
