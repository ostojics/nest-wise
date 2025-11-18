import {updateCategory} from '@/modules/api/categories-api';
import {queryKeys} from '@/modules/api/query-keys';
import {ErrorResponse, UpdateCategoryDTO} from '@nest-wise/contracts';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {HTTPError} from 'ky';
import {toast} from 'sonner';

export const useEditCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, dto}: {id: string; dto: UpdateCategoryDTO}) => updateCategory(id, dto),
    onSuccess: () => {
      toast.success('Kategorija je uspešno ažurirana');
      void queryClient.invalidateQueries({queryKey: queryKeys.categories.all()});
      void queryClient.invalidateQueries({queryKey: queryKeys.categoryBudgets.key()});
      void queryClient.invalidateQueries({queryKey: queryKeys.transactions.key()});
    },
    onError: async (error) => {
      const typedError = error as HTTPError<ErrorResponse>;
      const err = await typedError.response.json();

      const {default: posthog} = await import('posthog-js');

      posthog.captureException(error, {
        context: {
          feature: 'category_edit',
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
