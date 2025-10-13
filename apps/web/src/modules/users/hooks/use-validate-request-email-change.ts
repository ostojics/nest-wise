import {zodResolver} from '@hookform/resolvers/zod';
import {requestEmailChangeSchema} from '@nest-wise/contracts';
import {useForm} from 'react-hook-form';

export const useValidateRequestEmailChange = () => {
  return useForm({
    resolver: zodResolver(requestEmailChangeSchema),
    defaultValues: {
      newEmail: '',
    },
  });
};
