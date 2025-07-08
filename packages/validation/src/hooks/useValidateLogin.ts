import {useForm} from 'react-hook-form';
import {LoginDTO, loginSchema} from '../schemas/loginSchema';
import {zodResolver} from '@hookform/resolvers/zod';

export const useValidateLogin = () => {
  return useForm<LoginDTO>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });
};
