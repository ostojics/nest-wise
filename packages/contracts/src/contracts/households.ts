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
    name: z.string().min(1).max(255),
    currencyCode: z
      .string()
      .length(3)
      .regex(/^[A-Z]{3}$/),
  })
  .strict();

export const updateHouseholdSchema = z
  .object({
    name: z.string().min(1).max(255).optional(),
    currencyCode: z
      .string()
      .length(3)
      .regex(/^[A-Z]{3}$/)
      .optional(),
    monthlyBudget: z.coerce.number().min(0).optional(),
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
