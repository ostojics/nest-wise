import {getStartAndEndOfMonth} from '@/lib/utils';
import SpendingReportPage from '@/modules/reports/components/spending-report-page';
import {createFileRoute} from '@tanstack/react-router';
import z from 'zod';

const {start, end} = getStartAndEndOfMonth();
const spendingQuerySchema = z.object({
  transactionDate_from: z.string().date().default(start).catch(start),
  transactionDate_to: z.string().date().default(end).catch(end),
});

export const Route = createFileRoute('/__pathlessLayout/reports/spending')({
  component: SpendingReportPage,
  validateSearch: spendingQuerySchema,
});
