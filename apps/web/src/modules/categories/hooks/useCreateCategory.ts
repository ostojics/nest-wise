import {createCategory} from '@/modules/api/categories-api';
import {useMutation} from '@tanstack/react-query';
import {toast} from 'sonner';

export const useCreateCategory = () => {
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      toast.success('Category created successfully');
    },
    onError: () => {
      toast.error('Failed to create category');
    },
  });
};
