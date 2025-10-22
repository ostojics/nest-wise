import {getStartAndEndOfMonthIso} from '@/lib/utils';
import {createFileRoute} from '@tanstack/react-router';
import {lazy} from 'react';
import z from 'zod';

const SpendingReportPage = lazy(() => import('@/modules/reports/components/spending-report-page'));

const {start, end} = getStartAndEndOfMonthIso();
const spendingQuerySchema = z.object({
  from: z.string().datetime().default(start).catch(start),
  to: z.string().datetime().default(end).catch(end),
});

export const Route = createFileRoute('/__pathlessLayout/reports/spending')({
  component: SpendingReportPage,
  validateSearch: spendingQuerySchema,
});
