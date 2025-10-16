import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {TransactionTypeEnum} from '@nest-wise/contracts';
import {dateAtNoon} from '@/lib/utils';
import {z} from 'zod';

interface UseValidateConfirmTransactionDefaultValues {
  accountId?: string;
}

// Custom schema for confirm step that allows optional categoryId for expenses
// This is needed because users might accept the AI-suggested new category
// without selecting anything, and the category will be created on submit
const confirmTransactionSchema = z
  .object({
    accountId: z
      .string({
        required_error: 'Račun je obavezan',
        invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
      })
      .uuid('Račun mora biti izabran'),
    categoryId: z
      .string({
        invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
      })
      .uuid('Kategorija mora biti izabrana')
      .nullable(),
    amount: z.coerce
      .number({
        invalid_type_error: 'Neispravna vrednost (mora biti broj)',
      })
      .min(0.01, 'Iznos mora biti veći od 0')
      .max(10000000, 'Iznos mora biti manji od 10.000.000'),
    type: TransactionTypeEnum,
    description: z
      .string({
        required_error: 'Opis je obavezan',
        invalid_type_error: 'Neispravna vrednost (mora biti tekst)',
      })
      .min(1, 'Opis je obavezan')
      .max(1000, 'Opis može imati najviše 1000 karaktera'),
    transactionDate: z
      .string({
        invalid_type_error: 'Neispravan datum',
      })
      .datetime({message: 'Datum mora biti u ISO 8601 formatu'}),
    isReconciled: z
      .boolean({
        invalid_type_error: 'Neispravna vrednost (mora biti logička vrednost)',
      })
      .default(true),
  })
  .strict()
  .superRefine((val, ctx) => {
    // Income transactions should not have a category
    if (val.type === 'income' && val.categoryId !== null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['categoryId'],
        message: 'Prihodne transakcije ne smeju imati kategoriju',
      });
    }
    // For expenses in confirm step, categoryId is optional (AI might suggest new category)
    // The actual category requirement is handled in onSubmit logic
  });

export const useValidateConfirmTransaction = ({accountId}: UseValidateConfirmTransactionDefaultValues) => {
  return useForm({
    resolver: zodResolver(confirmTransactionSchema),
    defaultValues: {
      accountId: accountId ?? '',
      categoryId: null,
      amount: 0,
      type: 'expense',
      description: '',
      transactionDate: dateAtNoon(new Date()).toISOString(),
      isReconciled: true,
    },
  });
};
