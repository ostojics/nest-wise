import {getStartAndEndOfMonth} from '@/lib/utils';
import DashboardPage from '@/modules/dashboard/components/dashboard-page';
import {getTransactionsQuerySchema} from '@maya-vault/validation';
import {createFileRoute} from '@tanstack/react-router';
import {z} from 'zod';

const {start, end} = getStartAndEndOfMonth();
const dashboardQuerySchema = getTransactionsQuerySchema
  .pick({
    transactionDate_from: true,
    transactionDate_to: true,
  })
  .extend({
    transactionDate_from: z.string().date().default(start),
    transactionDate_to: z.string().date().default(end),
  });

export const Route = createFileRoute('/__pathlessLayout/dashboard')({
  component: DashboardPage,
  validateSearch: dashboardQuerySchema,
});
