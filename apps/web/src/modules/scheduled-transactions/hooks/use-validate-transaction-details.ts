import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {z} from 'zod';

// Step 1 schema - transaction details
export const transactionDetailsSchema = z.object({
  accountId: z.string().uuid({message: 'Račun je obavezan'}),
  categoryId: z.string().uuid().nullable(),
  type: z.enum(['income', 'expense'], {message: 'Tip transakcije je obavezan'}),
  amount: z.number().positive({message: 'Iznos mora biti pozitivan broj'}),
  description: z.string().max(256, {message: 'Opis ne sme biti duži od 256 karaktera'}).nullable(),
});

export type TransactionDetailsFormData = z.infer<typeof transactionDetailsSchema>;

interface UseValidateTransactionDetailsDefaultValues {
  accountId?: string;
}

export const useValidateTransactionDetails = ({accountId}: UseValidateTransactionDetailsDefaultValues = {}) => {
  return useForm<TransactionDetailsFormData>({
    resolver: zodResolver(transactionDetailsSchema),
    mode: 'onSubmit',
    defaultValues: {
      accountId: accountId ?? '',
      categoryId: null,
      amount: 0,
      type: 'expense',
      description: null,
    },
  });
};
