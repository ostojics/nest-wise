import {z} from 'zod';

export interface HouseholdContract {
  id: string;
  name: string;
  currencyCode: string;
  monthlyBudget: number;
  createdAt: Date;
  updatedAt: Date;
}

export const createHouseholdSchema = z
  .object({
    name: z.string().min(1, 'Household name is required').max(255, 'Household name must be 255 characters or less'),
    currencyCode: z
      .string()
      .length(3, 'Valid currency code must be selected')
      .regex(/^[A-Z]{3}$/, 'Currency code must be 3 uppercase letters (e.g., USD, EUR, GBP)'),
  })
  .strict();

export const updateHouseholdSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Household name is required')
      .max(255, 'Household name must be 255 characters or less')
      .optional(),
    currencyCode: z
      .string()
      .length(3, 'Currency code must be exactly 3 characters')
      .regex(/^[A-Z]{3}$/, 'Currency code must be 3 uppercase letters (e.g., USD, EUR, GBP)')
      .optional(),
    monthlyBudget: z.coerce.number().min(0, 'Monthly budget must be 0 or greater').optional(),
  })
  .strict();

export const householdResponseSchema = z
  .object({
    id: z.string().uuid(),
    name: z.string(),
    currencyCode: z.string(),
    monthlyBudget: z.number(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

export type CreateHouseholdDTO = z.infer<typeof createHouseholdSchema>;
export type UpdateHouseholdDTO = z.infer<typeof updateHouseholdSchema>;
export type HouseholdResponseDTO = z.infer<typeof householdResponseSchema>;
