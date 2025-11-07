import {createCategoryForHousehold} from '@/modules/api/categories-api';
import {queryKeys} from '@/modules/api/query-keys';
import {ErrorResponse, CreateCategoryDTO} from '@nest-wise/contracts';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {HTTPError} from 'ky';
import {toast} from 'sonner';
import posthog from 'posthog-js';
import {useGetMe} from '@/modules/auth/hooks/use-get-me';

export const useCreateCategory = (householdId?: string) => {
  const client = useQueryClient();
  const {data: me} = useGetMe();

  return useMutation({
    mutationFn: (data: CreateCategoryDTO) => {
      if (!householdId) {
        throw new Error('Household ID is required');
      }
      return createCategoryForHousehold(householdId, data);
    },
    onSuccess: () => {
      void client.invalidateQueries({queryKey: queryKeys.categories.all()});
      void client.invalidateQueries({queryKey: queryKeys.categoryBudgets.key()});

      toast.success('Kategorija je uspešno kreirana');
    },
    onError: async (error) => {
      const typedError = error as HTTPError<ErrorResponse>;
      const err = await typedError.response.json();

      posthog.captureException(error, {
        context: {
          feature: 'useCreateCategory',
        },
        meta: {
          householdId: me?.householdId,
          userId: me?.id,
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
