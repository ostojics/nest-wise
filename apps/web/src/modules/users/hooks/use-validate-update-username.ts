import {zodResolver} from '@hookform/resolvers/zod';
import {updateUsernameSchema} from '@nest-wise/contracts';
import {useForm} from 'react-hook-form';

export const useValidateUpdateUsername = () => {
  return useForm({
    resolver: zodResolver(updateUsernameSchema),
    defaultValues: {
      username: '',
    },
  });
};
