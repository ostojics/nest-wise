import PlanPage from '@/modules/plan/components/plan-page';
import {getCategoryBudgetsQueryParamsSchema} from '@maya-vault/contracts';
import {createFileRoute} from '@tanstack/react-router';
import {format} from 'date-fns';
import z from 'zod';

const defaultMonthValue = format(new Date(), 'yyyy-MM');

const planQuerySchema = getCategoryBudgetsQueryParamsSchema
  .pick({
    month: true,
  })
  .extend({
    month: z
      .string()
      .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Month must be in the format YYYY-MM')
      .default(defaultMonthValue)
      .catch(defaultMonthValue),
  });

export const Route = createFileRoute('/__pathlessLayout/plan')({
  component: PlanPage,
  validateSearch: planQuerySchema,
});
