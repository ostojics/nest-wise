import {zodResolver} from '@hookform/resolvers/zod';
import {acceptInviteSchema} from '@nest-wise/contracts';
import {useForm} from 'react-hook-form';

interface UseValidateAcceptInviteFormArgs {
  token: string;
  email: string;
}

export const useValidateAcceptInvite = ({token, email}: UseValidateAcceptInviteFormArgs) => {
  return useForm({
    resolver: zodResolver(acceptInviteSchema),
    defaultValues: {
      email,
      username: '',
      password: '',
      confirm_password: '',
      token,
    },
  });
};
