import {getStartAndEndOfMonth} from '@/lib/utils';
import SpendingReportPage from '@/modules/reports/components/spending-report-page';
import {createFileRoute} from '@tanstack/react-router';
import z from 'zod';

const {start, end} = getStartAndEndOfMonth();
const spendingQuerySchema = z.object({
  from: z.string().date().default(start).catch(start),
  to: z.string().date().default(end).catch(end),
});

export const Route = createFileRoute('/__pathlessLayout/reports/spending')({
  component: SpendingReportPage,
  validateSearch: spendingQuerySchema,
});
