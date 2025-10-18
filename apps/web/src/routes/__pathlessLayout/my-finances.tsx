import MyFinancesPage from '@/modules/my-finances/components/my-finances-page';
import {getPrivateTransactionsQuerySchema} from '@nest-wise/contracts';
import {createFileRoute} from '@tanstack/react-router';

export const Route = createFileRoute('/__pathlessLayout/my-finances')({
  component: RouteComponent,
  validateSearch: getPrivateTransactionsQuerySchema,
});

function RouteComponent() {
  return <MyFinancesPage />;
}
