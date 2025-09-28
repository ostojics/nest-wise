import {UserRegistrationDTO, userRegistrationSchema} from '@nest-wise/contracts';
import {useForm} from 'react-hook-form';
import {useLocalizedZodResolver} from '@/hooks/useLocalizedZodResolver';

interface UseValidateStep1Props {
  initialUsername?: string;
  initialEmail?: string;
}

export const useValidateStep1 = (
  {initialUsername, initialEmail}: UseValidateStep1Props = {initialUsername: '', initialEmail: ''},
) => {
  const resolver = useLocalizedZodResolver(userRegistrationSchema);

  return useForm<UserRegistrationDTO>({
    resolver,
    defaultValues: {
      username: initialUsername ?? '',
      email: initialEmail ?? '',
      password: '',
      confirm_password: '',
    },
  });
};
