import {useForm} from 'react-hook-form';
import {LoginDTO, loginSchema} from '../schemas/loginSchema';
import {yupResolver} from '@hookform/resolvers/yup';

export const useValidateLogin = () => {
  return useForm<LoginDTO>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });
};
