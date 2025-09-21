import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {ForgotPasswordDTO, forgotPasswordSchema} from '@nest-wise/contracts';

export const useValidateForgotPassword = () => {
  return useForm<ForgotPasswordDTO>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });
};
