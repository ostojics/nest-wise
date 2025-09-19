import {zodResolver} from '@hookform/resolvers/zod';
import {EditCategoryBudgetDTO, editCategoryBudgetSchema} from '@nest-wise/contracts';
import {useForm} from 'react-hook-form';

interface UseValidateEditCategoryBudgetArgs {
  defaultValues: EditCategoryBudgetDTO;
}

export const useValidateEditCategoryBudget = ({defaultValues}: UseValidateEditCategoryBudgetArgs) => {
  return useForm<EditCategoryBudgetDTO>({
    resolver: zodResolver(editCategoryBudgetSchema),
    defaultValues,
  });
};
