import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {confirmAiTransactionSuggestionHouseholdSchema} from '@nest-wise/contracts';
import {dateAtNoon} from '@/lib/utils';

interface UseValidateConfirmAiTransactionDefaultValues {
  accountId?: string;
}

export const useValidateConfirmAiTransaction = ({accountId}: UseValidateConfirmAiTransactionDefaultValues) => {
  return useForm({
    resolver: zodResolver(confirmAiTransactionSuggestionHouseholdSchema),
    defaultValues: {
      accountId: accountId ?? '',
      categoryId: null,
      amount: 0,
      type: 'expense',
      description: '',
      transactionDate: dateAtNoon(new Date()).toISOString(),
      isReconciled: true,
      newCategorySuggested: false,
      suggestedCategoryName: undefined,
    },
  });
};
