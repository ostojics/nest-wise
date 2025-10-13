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
    name: z
      .string({
        required_error: 'Naziv domaćinstva je obavezan',
        invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
      })
      .min(1, 'Naziv domaćinstva je obavezan')
      .max(255, 'Naziv domaćinstva može imati najviše 255 karaktera'),
    currencyCode: z
      .string({
        required_error: 'Valuta je obavezna',
        invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
      })
      .length(3, 'Valuta mora imati tačno 3 karaktera')
      .regex(/^[A-Z]{3}$/, 'Valuta mora biti 3 velika slova (npr. USD, EUR, RSD)'),
  })
  .strict();

export const updateHouseholdSchema = z
  .object({
    name: z
      .string({
        invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
      })
      .min(1, 'Naziv domaćinstva je obavezan')
      .max(255, 'Naziv domaćinstva može imati najviše 255 karaktera')
      .optional(),
    currencyCode: z
      .string({
        invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
      })
      .length(3, 'Valuta mora imati tačno 3 karaktera')
      .regex(/^[A-Z]{3}$/, 'Valuta mora biti 3 velika slova (npr. USD, EUR, RSD)')
      .optional(),
    monthlyBudget: z.coerce
      .number({
        invalid_type_error: 'Neispravna vrednost (mora biti broj)',
      })
      .min(0, 'Mesečni budžet mora biti 0 ili veći')
      .optional(),
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
