import {updateCategory} from '@/modules/api/categories-api';
import {queryKeys} from '@/modules/api/query-keys';
import {ErrorResponse, UpdateCategoryDTO} from '@nest-wise/contracts';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {HTTPError} from 'ky';
import {toast} from 'sonner';

export const useEditCategoryName = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, dto}: {id: string; dto: UpdateCategoryDTO}) => updateCategory(id, dto),
    onSuccess: () => {
      toast.success('Naziv kategorije je uspešno promenjen');
      void queryClient.invalidateQueries({queryKey: queryKeys.categories.all()});
      void queryClient.invalidateQueries({queryKey: queryKeys.categoryBudgets.key()});
      void queryClient.invalidateQueries({queryKey: queryKeys.transactions.key()});
    },
    onError: async (error) => {
      const typedError = error as HTTPError<ErrorResponse>;
      const err = await typedError.response.json();

      if (err.message) {
        toast.error(err.message);
        return;
      }

      toast.error('Došlo je do neočekivane greške');
    },
  });
};
