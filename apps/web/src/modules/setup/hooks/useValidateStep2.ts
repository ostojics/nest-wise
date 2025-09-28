import {CreateHouseholdDTO, createHouseholdSchema} from '@nest-wise/contracts';
import {useForm} from 'react-hook-form';
import {useLocalizedZodResolver} from '@/hooks/useLocalizedZodResolver';

export const useValidateStep2 = () => {
  const resolver = useLocalizedZodResolver(createHouseholdSchema);

  return useForm<CreateHouseholdDTO>({
    resolver,
    defaultValues: {
      name: '',
      currencyCode: '',
    },
  });
};
