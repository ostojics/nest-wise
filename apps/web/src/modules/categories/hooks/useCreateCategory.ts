import {createCategory} from '@/modules/api/categories-api';
import {queryKeys} from '@/modules/api/query-keys';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';

export const useCreateCategory = () => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      void client.invalidateQueries({queryKey: queryKeys.categories.all()});
      toast.success('Category created successfully');
    },
    onError: () => {
      toast.error('Failed to create category');
    },
  });
};
