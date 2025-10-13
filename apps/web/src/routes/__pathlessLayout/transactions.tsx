import TransactionsPage from '@/modules/transactions/components/transactions-page';
import {TransactionSortFieldEnum} from '@nest-wise/contracts';
import {createFileRoute} from '@tanstack/react-router';
import z from 'zod';

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1).catch(1),
  pageSize: z.coerce.number().min(1).max(100).default(15).catch(15),
  sort: TransactionSortFieldEnum.default('-transactionDate').catch('-transactionDate'),
  accountId: z.string().uuid().optional().catch(undefined),
  categoryId: z.string().uuid().optional().catch(undefined),
  from: z.string().datetime().optional().catch(undefined),
  to: z.string().datetime().optional().catch(undefined),
  q: z.string().optional().catch(undefined),
});

export const Route = createFileRoute('/__pathlessLayout/transactions')({
  component: TransactionsPage,
  validateSearch: querySchema,
});
