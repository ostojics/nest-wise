import {zodResolver} from '@hookform/resolvers/zod';
import {EditCategoryBudgetDTO, editCategoryBudgetSchema} from '@maya-vault/contracts';
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
