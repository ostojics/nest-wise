import {z} from 'zod';

export const createCategorySchema = z
  .object({
    name: z.string().min(1, 'Category name is required').max(100, 'Category name must be 100 characters or less'),
    householdId: z.string().uuid('Household must be selected'),
  })
  .strict();

export const updateCategorySchema = z
  .object({
    name: z
      .string()
      .min(1, 'Category name is required')
      .max(100, 'Category name must be 100 characters or less')
      .optional(),
  })
  .strict();

export const categoryResponseSchema = z
  .object({
    id: z.string().uuid(),
    name: z.string(),
    householdId: z.string().uuid(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

export type CreateCategoryDTO = z.infer<typeof createCategorySchema>;
export type UpdateCategoryDTO = z.infer<typeof updateCategorySchema>;
export type CategoryResponseDTO = z.infer<typeof categoryResponseSchema>;
