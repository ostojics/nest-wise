import {getStartAndEndOfMonthIso} from '@/lib/utils';
import SpendingReportPage from '@/modules/reports/components/spending-report-page';
import {createFileRoute} from '@tanstack/react-router';
import z from 'zod';

const {start, end} = getStartAndEndOfMonthIso();
const spendingQuerySchema = z.object({
  from: z.string().datetime().default(start).catch(start),
  to: z.string().datetime().default(end).catch(end),
});

export const Route = createFileRoute('/__pathlessLayout/reports/spending')({
  component: SpendingReportPage,
  validateSearch: spendingQuerySchema,
});
