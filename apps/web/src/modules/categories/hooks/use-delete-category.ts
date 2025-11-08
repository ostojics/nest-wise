import {deleteCategory} from '@/modules/api/categories-api';
import {ErrorResponse} from '@nest-wise/contracts';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {HTTPError} from 'ky';
import {toast} from 'sonner';

export const useDeleteCategory = () => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => deleteCategory(id),
    onSuccess: async () => {
      await client.invalidateQueries();
      toast.success('Kategorija je obrisana');
    },
    onError: async (error) => {
      const typedError = error as HTTPError<ErrorResponse>;
      const err = await typedError.response.json();

      const {default: posthog} = await import('posthog-js');

      posthog.captureException(error, {
        context: {
          feature: 'category_delete',
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
