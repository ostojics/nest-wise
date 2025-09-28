import {LoginDTO, loginSchema} from '@nest-wise/contracts';
import {useForm} from 'react-hook-form';
import {useLocalizedZodResolver} from '@/hooks/useLocalizedZodResolver';

export const useValidateLogin = () => {
  const resolver = useLocalizedZodResolver(loginSchema);

  return useForm<LoginDTO>({
    resolver,
    defaultValues: {
      email: '',
      password: '',
    },
  });
};
