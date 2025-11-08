import {editCategoryBudget} from '@/modules/api/category-budgets';
import {queryKeys} from '@/modules/api/query-keys';
import {EditCategoryBudgetDTO, ErrorResponse} from '@nest-wise/contracts';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {HTTPError} from 'ky';
import {toast} from 'sonner';
import posthog from 'posthog-js';

export const useEditCategoryBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, dto}: {id: string; dto: EditCategoryBudgetDTO}) => editCategoryBudget(id, dto),
    onSuccess: () => {
      toast.success('Budžet kategorije je uspešno ažuriran');
      void queryClient.invalidateQueries({queryKey: queryKeys.categoryBudgets.key()});
    },
    onError: async (error) => {
      const typedError = error as HTTPError<ErrorResponse>;
      const err = await typedError.response.json();

      posthog.captureException(error, {
        context: {
          feature: 'useEditCategoryBudget',
        },
      });

      if (err.message) {
        toast.error(err.message);
        return;
      }

      toast.error('Došlo je do neočekivane greške');
    },
  });
};
