import {zodResolver} from '@hookform/resolvers/zod';
import {UpdateCategoryDTO, updateCategorySchema} from '@nest-wise/contracts';
import {useForm} from 'react-hook-form';

interface UseValidateEditCategoryArgs {
  defaultValues: UpdateCategoryDTO;
}

export const useValidateEditCategory = ({defaultValues}: UseValidateEditCategoryArgs) => {
  return useForm<UpdateCategoryDTO>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues,
  });
};
