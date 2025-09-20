import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {CreateAccountHouseholdScopedDTO, createAccountHouseholdScopedSchema} from '@nest-wise/contracts';

interface UseValidateCreateAccountProps {
  ownerId: string;
}

export const useValidateCreateAccount = ({ownerId}: UseValidateCreateAccountProps) => {
  return useForm<CreateAccountHouseholdScopedDTO>({
    resolver: zodResolver(createAccountHouseholdScopedSchema),
    defaultValues: {
      name: '',
      type: 'checking',
      ownerId,
      initialBalance: 0,
    },
  });
};
