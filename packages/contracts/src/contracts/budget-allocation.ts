import {z} from 'zod';

export interface BudgetAllocationCategoryContract {
  id: string;
  budgetAllocationId: string;
  name: string;
  percentage: number;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetAllocationContract {
  id: string;
  householdId: string;
  month: string;
  salaryAmount: number;
  fixedBillsAmount: number;
  categories: BudgetAllocationCategoryContract[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetAllocationWithCalculationsContract extends BudgetAllocationContract {
  remainder: number;
  categoryAllocations: {
    id: string;
    name: string;
    percentage: number;
    amount: number;
    displayOrder: number;
  }[];
}

const budgetAllocationCategorySchema = z.object({
  name: z.string().min(1, 'Ime kategorije je obavezno').max(100, 'Ime kategorije mora biti kraće od 100 karaktera'),
  percentage: z.coerce
    .number()
    .int()
    .min(0, 'Procenat mora biti 0 ili veći')
    .max(100, 'Procenat mora biti 100 ili manji'),
  displayOrder: z.coerce.number().int().default(0),
});

export const createBudgetAllocationSchema = z
  .object({
    month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Mesec mora biti u formatu YYYY-MM'),
    salaryAmount: z.coerce.number().nonnegative('Plata mora biti 0 ili veća'),
    fixedBillsAmount: z.coerce.number().nonnegative('Fiksni troškovi moraju biti 0 ili veći'),
    categories: z
      .array(budgetAllocationCategorySchema)
      .min(1, 'Potrebna je najmanje jedna kategorija')
      .default([
        {name: 'Potrošnja', percentage: 25, displayOrder: 0},
        {name: 'Investicije', percentage: 65, displayOrder: 1},
        {name: 'Davanje', percentage: 10, displayOrder: 2},
      ]),
  })
  .strict()
  .refine(
    (data) => {
      const totalPercentage = data.categories.reduce((sum, cat) => sum + cat.percentage, 0);
      return totalPercentage === 100;
    },
    {
      message: 'Procenti moraju biti tačno 100%',
      path: ['categories'],
    },
  );

export const updateBudgetAllocationSchema = z
  .object({
    month: z
      .string()
      .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Mesec mora biti u formatu YYYY-MM')
      .optional(),
    salaryAmount: z.coerce.number().nonnegative('Plata mora biti 0 ili veća').optional(),
    fixedBillsAmount: z.coerce.number().nonnegative('Fiksni troškovi moraju biti 0 ili veći').optional(),
    categories: z.array(budgetAllocationCategorySchema).min(1, 'Potrebna je najmanje jedna kategorija').optional(),
  })
  .strict()
  .refine(
    (data) => {
      if (data.categories) {
        const totalPercentage = data.categories.reduce((sum, cat) => sum + cat.percentage, 0);
        return totalPercentage === 100;
      }
      return true;
    },
    {
      message: 'Procenti moraju biti tačno 100%',
      path: ['categories'],
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

export type BudgetAllocationCategoryInput = z.infer<typeof budgetAllocationCategorySchema>;
export type CreateBudgetAllocationDTO = z.infer<typeof createBudgetAllocationSchema>;
export type UpdateBudgetAllocationDTO = z.infer<typeof updateBudgetAllocationSchema>;
export type GetBudgetAllocationQueryParams = z.infer<typeof getBudgetAllocationQueryParamsSchema>;
