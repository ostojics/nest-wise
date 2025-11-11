import {z} from 'zod';

export interface BudgetAllocationContract {
  id: string;
  householdId: string;
  month: string;
  salaryAmount: number;
  fixedBillsAmount: number;
  spendingPercentage: number;
  investingPercentage: number;
  givingPercentage: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetAllocationWithCalculationsContract extends BudgetAllocationContract {
  remainder: number;
  spendingAmount: number;
  investingAmount: number;
  givingAmount: number;
}

export const createBudgetAllocationSchema = z
  .object({
    month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Mesec mora biti u formatu YYYY-MM'),
    salaryAmount: z.coerce.number().nonnegative('Plata mora biti 0 ili veća'),
    fixedBillsAmount: z.coerce.number().nonnegative('Fiksni troškovi moraju biti 0 ili veći'),
    spendingPercentage: z.coerce.number().int().min(0).max(100).default(25),
    investingPercentage: z.coerce.number().int().min(0).max(100).default(65),
    givingPercentage: z.coerce.number().int().min(0).max(100).default(10),
  })
  .strict()
  .refine((data) => data.spendingPercentage + data.investingPercentage + data.givingPercentage === 100, {
    message: 'Procenti moraju biti tačno 100%',
    path: ['spendingPercentage'],
  });

export const updateBudgetAllocationSchema = z
  .object({
    month: z
      .string()
      .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Mesec mora biti u formatu YYYY-MM')
      .optional(),
    salaryAmount: z.coerce.number().nonnegative('Plata mora biti 0 ili veća').optional(),
    fixedBillsAmount: z.coerce.number().nonnegative('Fiksni troškovi moraju biti 0 ili veći').optional(),
    spendingPercentage: z.coerce.number().int().min(0).max(100).optional(),
    investingPercentage: z.coerce.number().int().min(0).max(100).optional(),
    givingPercentage: z.coerce.number().int().min(0).max(100).optional(),
  })
  .strict()
  .refine(
    (data) => {
      if (
        data.spendingPercentage !== undefined ||
        data.investingPercentage !== undefined ||
        data.givingPercentage !== undefined
      ) {
        const spending = data.spendingPercentage ?? 0;
        const investing = data.investingPercentage ?? 0;
        const giving = data.givingPercentage ?? 0;
        return spending + investing + giving === 100;
      }
      return true;
    },
    {
      message: 'Procenti moraju biti tačno 100%',
      path: ['spendingPercentage'],
    },
  );

export const getBudgetAllocationQueryParamsSchema = z
  .object({
    month: z
      .string({
        invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
      })
      .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Mesec mora biti u formatu YYYY-MM')
      .optional(),
  })
  .strict();

export type CreateBudgetAllocationDTO = z.infer<typeof createBudgetAllocationSchema>;
export type UpdateBudgetAllocationDTO = z.infer<typeof updateBudgetAllocationSchema>;
export type GetBudgetAllocationQueryParams = z.infer<typeof getBudgetAllocationQueryParamsSchema>;
