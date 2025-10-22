import {lazy} from 'react';
import {getCategoryBudgetsQueryParamsSchema} from '@nest-wise/contracts';
import {createFileRoute} from '@tanstack/react-router';
import {format} from 'date-fns';
import z from 'zod';

const PlanPage = lazy(() => import('@/modules/plan/components/plan-page'));

const defaultMonthValue = format(new Date(), 'yyyy-MM');

const planQuerySchema = getCategoryBudgetsQueryParamsSchema
  .pick({
    month: true,
  })
  .extend({
    month: z
      .string()
      .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Mesec mora biti formata YYYY-MM')
      .default(defaultMonthValue)
      .catch(defaultMonthValue),
  });

export const Route = createFileRoute('/__pathlessLayout/plan')({
  component: PlanPage,
  validateSearch: planQuerySchema,
});
