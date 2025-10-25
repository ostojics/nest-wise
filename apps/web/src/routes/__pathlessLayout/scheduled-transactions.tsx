import ScheduledTransactionsPage from '@/modules/scheduled-transactions/pages/scheduled-transactions.page';
import {createFileRoute} from '@tanstack/react-router';
import z from 'zod';

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1).catch(1),
  pageSize: z.coerce.number().min(1).max(100).default(15).catch(15),
});

export const Route = createFileRoute('/__pathlessLayout/scheduled-transactions')({
  component: ScheduledTransactionsPage,
  validateSearch: querySchema,
});
