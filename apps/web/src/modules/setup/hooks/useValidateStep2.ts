import {zodResolver} from '@hookform/resolvers/zod';
import {CreateHouseholdDTO, createHouseholdSchema} from '@maya-vault/validation';
import {useForm} from 'react-hook-form';

export const useValidateStep2 = () => {
  return useForm<CreateHouseholdDTO>({
    resolver: zodResolver(createHouseholdSchema),
    defaultValues: {
      name: '',
      currencyCode: '',
    },
  });
};
