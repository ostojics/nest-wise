import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {CreateTransactionAiHouseholdDTO, createTransactionAiHouseholdSchema} from '@nest-wise/contracts';

export const useValidateCreateAiTransaction = () => {
  return useForm<CreateTransactionAiHouseholdDTO>({
    resolver: zodResolver(createTransactionAiHouseholdSchema),
    defaultValues: {
      accountId: '',
      description: '',
    },
  });
};
