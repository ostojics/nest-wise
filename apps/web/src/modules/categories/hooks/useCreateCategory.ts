import {createCategory, createCategoryForHousehold} from '@/modules/api/categories-api';
import {queryKeys} from '@/modules/api/query-keys';
import {ErrorResponse, CreateCategoryHouseholdDTO} from '@nest-wise/contracts';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {HTTPError} from 'ky';
import {toast} from 'sonner';

export const useCreateCategory = (householdId?: string) => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryHouseholdDTO) => {
      if (householdId) {
        return createCategoryForHousehold(householdId, data);
      }
      // Legacy fallback - reconstruct old DTO
      if (!householdId) {
        throw new Error('Household ID is required');
      }
      return createCategory({...data, householdId});
    },
    onSuccess: () => {
      void client.invalidateQueries({queryKey: queryKeys.categories.all()});
      toast.success('Category created successfully');
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
