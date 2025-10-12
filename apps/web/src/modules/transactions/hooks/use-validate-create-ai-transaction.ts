import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {CreateTransactionAiHouseholdDTO, createTransactionAiHouseholdSchema} from '@nest-wise/contracts';
import {dateAtNoon} from '@/lib/utils';

interface UseValidateCreateAiTransactionDefaultValues {
  accountId?: string;
}

export const useValidateCreateAiTransaction = ({accountId}: UseValidateCreateAiTransactionDefaultValues) => {
  return useForm<CreateTransactionAiHouseholdDTO>({
    resolver: zodResolver(createTransactionAiHouseholdSchema),
    defaultValues: {
      accountId: accountId ?? '',
      description: '',
      currentDate: dateAtNoon(new Date()).toISOString(),
    },
  });
};
