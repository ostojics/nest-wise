import {zodResolver} from '@hookform/resolvers/zod';
import {inviteUserSchema} from '@maya-vault/contracts';
import {useForm} from 'react-hook-form';

export const useValidateInviteUser = () => {
  return useForm({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      email: '',
    },
  });
};
