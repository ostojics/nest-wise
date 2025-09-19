import {UserRegistrationDTO, userRegistrationSchema} from '@nest-wise/contracts';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';

interface UseValidateStep1Props {
  initialUsername?: string;
  initialEmail?: string;
}

export const useValidateStep1 = (
  {initialUsername, initialEmail}: UseValidateStep1Props = {initialUsername: '', initialEmail: ''},
) => {
  return useForm<UserRegistrationDTO>({
    resolver: zodResolver(userRegistrationSchema),
    defaultValues: {
      username: initialUsername ?? '',
      email: initialEmail ?? '',
      password: '',
      confirm_password: '',
    },
  });
};
