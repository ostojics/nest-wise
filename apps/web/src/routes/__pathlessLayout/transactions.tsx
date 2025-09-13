import TransactionsPage from '@/modules/transactions/components/transactions-page';
import {getTransactionsQuerySchema} from '@maya-vault/contracts';
import {createFileRoute} from '@tanstack/react-router';

export const Route = createFileRoute('/__pathlessLayout/transactions')({
  component: TransactionsPage,
  validateSearch: getTransactionsQuerySchema,
});
