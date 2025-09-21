import TransactionsPage from '@/modules/transactions/components/transactions-page';
import {TransactionSortFieldEnum} from '@nest-wise/contracts';
import {createFileRoute} from '@tanstack/react-router';
import z from 'zod';

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(15),
  sort: TransactionSortFieldEnum.default('-transactionDate'),
  accountId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
  from: z.string().date().optional(),
  to: z.string().date().optional(),
  q: z.string().optional(),
});

export const Route = createFileRoute('/__pathlessLayout/transactions')({
  component: TransactionsPage,
  validateSearch: querySchema,
});
