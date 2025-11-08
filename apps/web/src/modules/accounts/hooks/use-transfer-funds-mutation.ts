import {useMutation} from '@tanstack/react-query';
import {transferFundsForHousehold} from '@/modules/api/accounts-api';
import {toast} from 'sonner';
import {useQueryClient} from '@tanstack/react-query';
import {queryKeys} from '@/modules/api/query-keys';
import {HTTPError} from 'ky';
import {ErrorResponse, TransferFundsDTO} from '@nest-wise/contracts';
import posthog from 'posthog-js';

interface UseTransferFundsMutationProps {
  householdId: string;
}

export const useTransferFundsMutation = ({householdId}: UseTransferFundsMutationProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: TransferFundsDTO) => transferFundsForHousehold(householdId, dto),
    onSuccess: () => {
      toast.success('Sredstva su uspešno prebačena');
      void queryClient.invalidateQueries({queryKey: queryKeys.accounts.all()});
    },
    onError: async (error) => {
      const typedError = error as HTTPError<ErrorResponse>;
      const err = await typedError.response.json();

      posthog.captureException(error, {
        context: {
          feature: 'useTransferFundsMutation',
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
