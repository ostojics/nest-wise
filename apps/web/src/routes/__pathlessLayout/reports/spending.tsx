import {getStartAndEndOfMonth} from '@/lib/utils';
import SpendingReportPage from '@/modules/reports/components/spending-report-page';
import {getTransactionsQuerySchema} from '@maya-vault/contracts';
import {createFileRoute} from '@tanstack/react-router';
import z from 'zod';

const {start, end} = getStartAndEndOfMonth();
const spendingQuerySchema = getTransactionsQuerySchema
  .pick({
    transactionDate_from: true,
    transactionDate_to: true,
  })
  .extend({
    transactionDate_from: z.string().date().default(start).catch(start),
    transactionDate_to: z.string().date().default(end).catch(end),
  });

export const Route = createFileRoute('/__pathlessLayout/reports/spending')({
  component: SpendingReportPage,
  validateSearch: spendingQuerySchema,
});
