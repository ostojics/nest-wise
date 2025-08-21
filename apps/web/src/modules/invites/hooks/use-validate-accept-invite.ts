import {zodResolver} from '@hookform/resolvers/zod';
import {acceptInviteSchema} from '@maya-vault/contracts';
import {useForm} from 'react-hook-form';

interface UseValidateAcceptInviteFormArgs {
  token: string;
}

export const useValidateAcceptInvite = ({token}: UseValidateAcceptInviteFormArgs) => {
  return useForm({
    resolver: zodResolver(acceptInviteSchema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirm_password: '',
      token,
    },
  });
};
