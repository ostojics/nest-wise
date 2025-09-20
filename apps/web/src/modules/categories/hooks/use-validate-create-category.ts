import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {CreateCategoryHouseholdDTO, createCategoryHouseholdSchema} from '@nest-wise/contracts';

interface UseValidateCreateCategoryArgs {
  householdId: string;
}

export const useValidateCreateCategory = ({householdId: _householdId}: UseValidateCreateCategoryArgs) => {
  return useForm<CreateCategoryHouseholdDTO>({
    resolver: zodResolver(createCategoryHouseholdSchema),
    defaultValues: {
      name: '',
    },
  });
};
