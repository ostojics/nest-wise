import {z} from 'zod';

export interface CategoryBudgetContract {
  id: string;
  householdId: string;
  categoryId: string;
  month: string; // 'YYYY-MM'
  plannedAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export const getCategoryBudgetsQueryParamsSchema = z
  .object({
    month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Month must be in the format YYYY-MM'),
  })
  .strict();

export type GetCategoryBudgetsQueryParams = z.infer<typeof getCategoryBudgetsQueryParamsSchema>;

export const upsertCategoryBudgetSchema = z
  .object({
    month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Month must be in the format YYYY-MM'),
    items: z
      .array(
        z
          .object({
            categoryId: z.string().uuid('categoryId must be a valid UUID'),
            plannedAmount: z.coerce.number().min(0, 'plannedAmount must be 0 or greater'),
          })
          .strict(),
      )
      .min(1, 'At least one item is required'),
  })
  .strict();

export type UpsertCategoryBudgetDTO = z.infer<typeof upsertCategoryBudgetSchema>;

export const editCategoryBudgetSchema = z
  .object({
    plannedAmount: z.coerce.number().min(0, 'plannedAmount must be 0 or greater'),
  })
  .strict();

export type EditCategoryBudgetDTO = z.infer<typeof editCategoryBudgetSchema>;
