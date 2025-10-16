import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {confirmAiTransactionSuggestionHouseholdSchema} from '@nest-wise/contracts';

interface UseValidateConfirmAiTransactionDefaultValues {
  accountId?: string;
  categoryId?: string | null;
  type: 'income' | 'expense';
  amount: number;
  transactionDate: string;
  description: string;
  newCategorySuggested: boolean;
  suggestedCategoryName?: string;
}

export const useValidateConfirmAiTransaction = ({
  accountId,
  categoryId,
  type,
  amount,
  transactionDate,
  description,
  newCategorySuggested,
  suggestedCategoryName,
}: UseValidateConfirmAiTransactionDefaultValues) => {
  return useForm({
    resolver: zodResolver(confirmAiTransactionSuggestionHouseholdSchema),
    defaultValues: {
      accountId: accountId ?? '',
      categoryId: categoryId ?? null,
      amount,
      type,
      description,
      transactionDate,
      isReconciled: true,
      newCategorySuggested,
      suggestedCategoryName,
    },
  });
};
