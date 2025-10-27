import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {z} from 'zod';

// Step 2 schema - recurrence rule
export const scheduleRuleSchema = z
  .object({
    frequencyType: z.enum(['weekly', 'monthly'], {message: 'Frekvencija je obavezna'}),
    dayOfWeek: z.number().int().min(0).max(6).nullable(),
    dayOfMonth: z.number().int().min(1).max(31).nullable(),
  })
  .refine(
    (data) => {
      if (data.frequencyType === 'weekly') {
        return data.dayOfWeek !== null;
      }
      return true;
    },
    {
      message: 'Dan u nedelji je obavezan za nedeljnu frekvenciju',
      path: ['dayOfWeek'],
    },
  )
  .refine(
    (data) => {
      if (data.frequencyType === 'monthly') {
        return data.dayOfMonth !== null;
      }
      return true;
    },
    {
      message: 'Dan u mesecu je obavezan za mesečnu frekvenciju',
      path: ['dayOfMonth'],
    },
  );

export type ScheduleRuleFormData = z.infer<typeof scheduleRuleSchema>;

export const useValidateScheduleRule = () => {
  return useForm<ScheduleRuleFormData>({
    resolver: zodResolver(scheduleRuleSchema),
    mode: 'onSubmit',
    defaultValues: {
      frequencyType: 'monthly',
      dayOfWeek: null,
      dayOfMonth: 1,
    },
  });
};
