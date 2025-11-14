import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
  CreateBudgetAllocationDTO,
  GetBudgetAllocationQueryParams,
  UpdateBudgetAllocationDTO,
} from '@nest-wise/contracts';
import {
  createBudgetAllocation,
  deleteBudgetAllocation,
  getBudgetAllocation,
  updateBudgetAllocation,
} from '@/modules/api/budget-allocation-api';
import {queryKeys} from '@/modules/api/query-keys';
import {HTTPError} from 'ky';

export const useGetBudgetAllocation = (householdId: string, params?: GetBudgetAllocationQueryParams) => {
  return useQuery({
    queryKey: queryKeys.budgetAllocation.single(householdId, params),
    queryFn: async () => {
      try {
        return await getBudgetAllocation(householdId, params);
      } catch (error) {
        if (error instanceof HTTPError && error.response.status === 404) {
          return null;
        }
        throw error;
      }
    },
  });
};

export const useCreateBudgetAllocation = (householdId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateBudgetAllocationDTO) => createBudgetAllocation(householdId, dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({queryKey: queryKeys.budgetAllocation.key()});
    },
  });
};

export const useUpdateBudgetAllocation = (householdId: string, id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateBudgetAllocationDTO) => updateBudgetAllocation(householdId, id, dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({queryKey: queryKeys.budgetAllocation.key()});
    },
  });
};

export const useDeleteBudgetAllocation = (householdId: string, id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteBudgetAllocation(householdId, id),
    onSuccess: () => {
      void queryClient.invalidateQueries({queryKey: queryKeys.budgetAllocation.key()});
    },
  });
};
