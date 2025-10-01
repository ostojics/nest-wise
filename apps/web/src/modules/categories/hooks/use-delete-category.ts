import {deleteCategory} from '@/modules/api/categories-api';
import {queryKeys} from '@/modules/api/query-keys';
import {ErrorResponse} from '@nest-wise/contracts';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {HTTPError} from 'ky';
import {toast} from 'sonner';

export const useDeleteCategory = () => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => deleteCategory(id),
    onSuccess: async () => {
      const promises = [
        client.invalidateQueries({queryKey: queryKeys.categories.all()}),
        client.invalidateQueries({queryKey: queryKeys.categoryBudgets.key()}),
        client.invalidateQueries({queryKey: queryKeys.transactions.key()}),
      ];

      await Promise.all(promises);
      toast.success('Kategorija je obrisana');
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
