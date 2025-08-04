import {z} from 'zod';

export const createHouseholdSchema = z.object({
  name: z.string().min(1, 'Household name is required').max(255, 'Household name must be 255 characters or less'),
  currencyCode: z
    .string()
    .length(3, 'Valid currency code must be selected')
    .regex(/^[A-Z]{3}$/, 'Currency code must be 3 uppercase letters (e.g., USD, EUR, GBP)'),
});

export const updateHouseholdSchema = z.object({
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
  monthlyBudget: z.number().positive('Monthly budget must be a positive number').optional(),
});

export const householdResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  currencyCode: z.string(),
  monthlyBudget: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CreateHouseholdDTO = z.infer<typeof createHouseholdSchema>;
export type UpdateHouseholdDTO = z.infer<typeof updateHouseholdSchema>;
export type HouseholdResponseDTO = z.infer<typeof householdResponseSchema>;
