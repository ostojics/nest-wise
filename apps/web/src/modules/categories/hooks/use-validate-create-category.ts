import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {CreateCategoryDTO, createCategorySchema} from '@nest-wise/contracts';

interface UseValidateCreateCategoryArgs {
  householdId: string;
}

export const useValidateCreateCategory = ({householdId: _householdId}: UseValidateCreateCategoryArgs) => {
  return useForm<CreateCategoryDTO>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: '',
      description: '',
      isDefault: false,
    },
  });
};
