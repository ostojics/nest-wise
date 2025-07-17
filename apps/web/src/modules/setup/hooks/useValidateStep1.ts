import {UserRegistrationDTO, userRegistrationSchema} from '@maya-vault/validation';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';

export const useValidateStep1 = () => {
  return useForm<UserRegistrationDTO>({
    resolver: zodResolver(userRegistrationSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirm_password: '',
    },
  });
};
