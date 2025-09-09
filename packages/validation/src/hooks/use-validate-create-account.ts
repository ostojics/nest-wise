import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {CreateAccountDTO, createAccountSchema} from '../schemas';

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
      householdId,
      ownerId,
    },
  });
};
