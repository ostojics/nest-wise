import {getStartAndEndOfMonth} from '@/lib/utils';
import PlanPage from '@/modules/plan/components/plan-page';
import {getTransactionsQuerySchema} from '@maya-vault/validation';
import {createFileRoute} from '@tanstack/react-router';
import {z} from 'zod';

const {start, end} = getStartAndEndOfMonth();
const planQuerySchema = getTransactionsQuerySchema
  .pick({
    transactionDate_from: true,
    transactionDate_to: true,
  })
  .extend({
    transactionDate_from: z.string().date().default(start).catch(start),
    transactionDate_to: z.string().date().default(end).catch(end),
  });

export const Route = createFileRoute('/__pathlessLayout/plan')({
  component: PlanPage,
  validateSearch: planQuerySchema,
});
