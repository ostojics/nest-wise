import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {CreateCategoryDTO, createCategorySchema} from '@maya-vault/contracts';

interface UseValidateCreateCategoryArgs {
  householdId: string;
}

export const useValidateCreateCategory = ({householdId}: UseValidateCreateCategoryArgs) => {
  return useForm<CreateCategoryDTO>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: '',
      householdId,
      type: 'shared',
    },
  });
};
