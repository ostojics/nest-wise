import {z} from 'zod';

const categoryTypeSchema = z.enum(['shared', 'private'], {
  errorMap: () => ({
    message: 'Category type must be one of: shared, private',
  }),
});

export type TCategoryType = z.infer<typeof categoryTypeSchema>;

export interface CategoryContract {
  id: string;
  name: string;
  householdId: string;
  type: TCategoryType;
  createdAt: Date;
  updatedAt: Date;
}

export const createCategorySchema = z
  .object({
    name: z.string().min(1, 'Category name is required').max(100, 'Category name must be 100 characters or less'),
    householdId: z.string().uuid('Household must be selected'),
    type: categoryTypeSchema,
  })
  .strict();

export const updateCategorySchema = z
  .object({
    name: z
      .string()
      .min(1, 'Category name is required')
      .max(100, 'Category name must be 100 characters or less')
      .optional(),
    type: categoryTypeSchema.optional(),
  })
  .strict();

export const categoryResponseSchema = z
  .object({
    id: z.string().uuid(),
    name: z.string(),
    householdId: z.string().uuid(),
    createdAt: z.date(),
    updatedAt: z.date(),
    type: categoryTypeSchema,
  })
  .strict();

export type CreateCategoryDTO = z.infer<typeof createCategorySchema>;
export type UpdateCategoryDTO = z.infer<typeof updateCategorySchema>;
export type CategoryResponseDTO = z.infer<typeof categoryResponseSchema>;
