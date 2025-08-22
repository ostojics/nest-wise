import {z} from 'zod';

export const accountTypeEnum = z.enum(['checking', 'savings', 'credit_card', 'investment', 'cash', 'other'], {
  errorMap: () => ({
    message: 'Account type must be one of: checking, savings, credit_card, investment, cash, other',
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

export const editAccountSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Account name is required')
      .max(255, 'Account name must be 255 characters or less')
      .optional(),
    type: accountTypeEnum.optional(),
    currentBalance: z.coerce.number().min(0, 'Balance must be 0 or greater').optional(),
  })
  .strict();

export type EditAccountDTO = z.infer<typeof editAccountSchema>;
