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
  category: Pick<CategoryContract, 'name' | 'description'>;
}

export interface CategoryBudgetWithCurrentAmountContract extends CategoryBudgetContract {
  currentAmount: number;
}

export const getCategoryBudgetsQueryParamsSchema = z
  .object({
    month: z
      .string({
        required_error: 'Mesec je obavezan',
        invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
      })
      .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Mesec mora biti u formatu YYYY-MM'),
  })
  .strict();

export type GetCategoryBudgetsQueryParams = z.infer<typeof getCategoryBudgetsQueryParamsSchema>;

export const upsertCategoryBudgetSchema = z
  .object({
    month: z
      .string({
        required_error: 'Mesec je obavezan',
        invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
      })
      .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Mesec mora biti u formatu YYYY-MM'),
    items: z
      .array(
        z
          .object({
            categoryId: z
              .string({
                required_error: 'ID kategorije je obavezan',
                invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
              })
              .uuid('Kategorija mora biti izabrana'),
            plannedAmount: z.coerce
              .number({
                invalid_type_error: 'Neispravna vrednost (mora biti broj)',
              })
              .min(0, 'Planirani iznos mora biti 0 ili veći'),
          })
          .strict(),
      )
      .min(1, 'Potrebna je najmanje jedna stavka'),
  })
  .strict();

export type UpsertCategoryBudgetDTO = z.infer<typeof upsertCategoryBudgetSchema>;

export const editCategoryBudgetSchema = z
  .object({
    plannedAmount: z.coerce
      .number({
        invalid_type_error: 'Neispravna vrednost (mora biti broj)',
      })
      .min(0, 'Planirani iznos mora biti 0 ili veći'),
  })
  .strict();

export type EditCategoryBudgetDTO = z.infer<typeof editCategoryBudgetSchema>;
