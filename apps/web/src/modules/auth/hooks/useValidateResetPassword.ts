import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {ResetPasswordDTO, resetPasswordSchema} from '@nest-wise/contracts';

export const useValidateResetPassword = (token = '') => {
  return useForm<ResetPasswordDTO>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
      password: '',
      confirm_password: '',
    },
  });
};
