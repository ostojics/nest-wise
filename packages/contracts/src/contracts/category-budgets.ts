import {z} from 'zod';
import {CategoryContract} from './categories';

export interface CategoryBudgetContract {
  id: string;
  householdId: string;
  categoryId: string;
  month: string; // 'YYYY-MM'
  plannedAmount: number;
  createdAt: Date;
  updatedAt: Date;
  category: Pick<CategoryContract, 'name'>;
}

export interface CategoryBudgetWithCurrentAmountContract extends CategoryBudgetContract {
  currentAmount: number;
}

export const getCategoryBudgetsQueryParamsSchema = z
  .object({
    month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/),
  })
  .strict();

export type GetCategoryBudgetsQueryParams = z.infer<typeof getCategoryBudgetsQueryParamsSchema>;

export const upsertCategoryBudgetSchema = z
  .object({
    month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/),
    items: z
      .array(
        z
          .object({
            categoryId: z.string().uuid(),
            plannedAmount: z.coerce.number().min(0),
          })
          .strict(),
      )
      .min(1, 'At least one item is required'),
  })
  .strict();

export type UpsertCategoryBudgetDTO = z.infer<typeof upsertCategoryBudgetSchema>;

export const editCategoryBudgetSchema = z
  .object({
    plannedAmount: z.coerce.number().min(0, 'Planned amount must be 0 or greater'),
  })
  .strict();

export type EditCategoryBudgetDTO = z.infer<typeof editCategoryBudgetSchema>;
