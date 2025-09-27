import {zodResolver} from '@hookform/resolvers/zod';
import {CreateHouseholdDTO, createHouseholdSchema} from '@nest-wise/contracts';
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
