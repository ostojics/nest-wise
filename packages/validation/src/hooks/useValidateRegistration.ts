import {useForm} from 'react-hook-form';
import {UserRegistrationDTO, userRegistrationSchema} from '../schemas/auth';
import {zodResolver} from '@hookform/resolvers/zod';

export const useValidateRegistration = () => {
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
