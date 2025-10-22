import {lazy} from 'react';
import {getPrivateTransactionsQuerySchema} from '@nest-wise/contracts';
import {createFileRoute} from '@tanstack/react-router';

const MyFinancesPage = lazy(() => import('@/modules/my-finances/components/my-finances-page'));

export const Route = createFileRoute('/__pathlessLayout/my-finances')({
  component: RouteComponent,
  validateSearch: getPrivateTransactionsQuerySchema,
});

function RouteComponent() {
  return <MyFinancesPage />;
}
