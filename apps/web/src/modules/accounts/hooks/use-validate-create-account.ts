import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {CreateAccountDTO, createAccountSchema} from '@maya-vault/contracts';

interface UseValidateCreateAccountProps {
  householdId: string;
  ownerId: string;
}

export const useValidateCreateAccount = ({householdId, ownerId}: UseValidateCreateAccountProps) => {
  return useForm<CreateAccountDTO>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      name: '',
      type: 'checking',
      variant: 'shared',
      householdId,
      ownerId,
    },
  });
};
