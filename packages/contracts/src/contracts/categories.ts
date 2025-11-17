import {z} from 'zod';

export interface CategoryContract {
  id: string;
  name: string;
  description: string | null;
  householdId: string;
  createdAt: Date;
  updatedAt: Date;
  default: boolean;
}

export const createCategorySchema = z
  .object({
    name: z
      .string({
        required_error: 'Naziv kategorije je obavezan',
        invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
      })
      .min(1, 'Naziv kategorije je obavezan')
      .max(100, 'Naziv kategorije može imati najviše 100 karaktera'),
    description: z
      .string({
        invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
      })
      .max(300, 'Opis kategorije može imati najviše 300 karaktera')
      .optional(),
    default: z.boolean().optional(),
  })
  .strict();

export const updateCategorySchema = z
  .object({
    name: z
      .string({
        invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
      })
      .min(1, 'Naziv kategorije je obavezan')
      .max(100, 'Naziv kategorije može imati najviše 100 karaktera')
      .optional(),
    description: z
      .string({
        invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
      })
      .max(300, 'Opis kategorije može imati najviše 300 karaktera')
      .optional(),
    default: z.boolean().optional(),
  })
  .strict();

export const categoryResponseSchema = z
  .object({
    id: z.string().uuid(),
    name: z.string(),
    description: z.string().max(300).nullable(),
    householdId: z.string().uuid(),
    createdAt: z.date(),
    updatedAt: z.date(),
    default: z.boolean(),
  })
  .strict();

export type CreateCategoryDTO = z.infer<typeof createCategorySchema>;
export type UpdateCategoryDTO = z.infer<typeof updateCategorySchema>;
export type CategoryResponseDTO = z.infer<typeof categoryResponseSchema>;
