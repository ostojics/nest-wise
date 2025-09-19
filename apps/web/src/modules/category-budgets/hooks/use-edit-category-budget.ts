import {editCategoryBudget} from '@/modules/api/category-budgets';
import {queryKeys} from '@/modules/api/query-keys';
import {EditCategoryBudgetDTO, ErrorResponse} from '@nest-wise/contracts';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useSearch} from '@tanstack/react-router';
import {HTTPError} from 'ky';
import {toast} from 'sonner';

export const useEditCategoryBudget = () => {
  const queryClient = useQueryClient();
  const search = useSearch({from: '/__pathlessLayout/plan'});

  return useMutation({
    mutationFn: ({id, dto}: {id: string; dto: EditCategoryBudgetDTO}) => editCategoryBudget(id, dto),
    onSuccess: () => {
      toast.success('Category budget updated successfully');
      void queryClient.invalidateQueries({queryKey: queryKeys.categoryBudgets.all(search)});
    },
    onError: async (error) => {
      const typedError = error as HTTPError<ErrorResponse>;
      const err = await typedError.response.json();

      if (err.message) {
        toast.error(err.message);
        return;
      }

      toast.error('Unexpected error occurred');
    },
  });
};
