import {z} from 'zod';

export const accountTypeEnum = z.enum(['checking', 'savings', 'credit_card', 'investment', 'cash', 'other'], {
  errorMap: () => ({
    message: 'Tip računa mora biti jedan od: tekući, štedni, kreditni, investicioni, gotovina, ostalo',
  }),
});

export interface AccountContract {
  id: string;
  name: string;
  type: string;
  initialBalance: number;
  currentBalance: number;
  ownerId: string;
  householdId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Household-scoped version without householdId (comes from path)
export const createAccountHouseholdScopedSchema = z
  .object({
    name: z
      .string({
        required_error: 'Naziv računa je obavezan',
        invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
      })
      .min(1, 'Naziv računa je obavezan')
      .max(255, 'Naziv računa može imati najviše 255 karaktera'),
    type: accountTypeEnum,
    initialBalance: z.coerce
      .number({
        invalid_type_error: 'Neispravna vrednost (mora biti broj)',
      })
      .min(0, 'Stanje mora biti 0 ili veće'),
    ownerId: z
      .string({
        required_error: 'ID vlasnika je obavezan',
        invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
      })
      .uuid('ID vlasnika mora biti važeći UUID'),
  })
  .strict();

export type CreateAccountHouseholdScopedDTO = z.infer<typeof createAccountHouseholdScopedSchema>;

export const editAccountSchema = z
  .object({
    name: z
      .string({
        invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
      })
      .min(1, 'Naziv računa je obavezan')
      .max(255, 'Naziv računa može imati najviše 255 karaktera')
      .optional(),
    type: accountTypeEnum.optional(),
    currentBalance: z.coerce
      .number({
        invalid_type_error: 'Neispravna vrednost (mora biti broj)',
      })
      .min(0, 'Stanje mora biti 0 ili veće')
      .optional(),
  })
  .strict();

export type EditAccountDTO = z.infer<typeof editAccountSchema>;

export const transferFundsSchema = z
  .object({
    fromAccountId: z
      .string({
        required_error: 'Polazni račun je obavezan',
        invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
      })
      .uuid('Polazni račun mora biti izabran'),
    toAccountId: z
      .string({
        required_error: 'Odredišni račun je obavezan',
        invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
      })
      .uuid('Odredišni račun mora biti izabran'),
    amount: z.coerce
      .number({
        invalid_type_error: 'Neispravna vrednost (mora biti broj)',
      })
      .min(1, 'Iznos prebacivanja mora biti najmanje 1'),
  })
  .strict()
  .refine((data) => data.fromAccountId !== data.toAccountId, {
    message: 'Polazni i odredišni račun moraju biti različiti',
    path: ['toAccountId'],
  });

export type TransferFundsDTO = z.infer<typeof transferFundsSchema>;
