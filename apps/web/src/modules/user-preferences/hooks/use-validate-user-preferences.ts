import {updateUserPreferencesSchema} from '@nest-wise/contracts';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {z} from 'zod';

export const useValidateUserPreferences = () => {
  return useForm<z.infer<typeof updateUserPreferencesSchema>>({
    resolver: zodResolver(updateUserPreferencesSchema),
    defaultValues: {
      automaticLogout: false,
    },
  });
};
