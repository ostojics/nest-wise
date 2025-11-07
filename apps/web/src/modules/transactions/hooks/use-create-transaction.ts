import {createTransactionForHousehold} from '@/modules/api/transactions-api';
import {useGetMe} from '@/modules/auth/hooks/use-get-me';
import {CreateTransactionHouseholdDTO, ErrorResponse} from '@nest-wise/contracts';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {HTTPError} from 'ky';
import {toast} from 'sonner';
import posthog from 'posthog-js';

export const useCreateTransaction = () => {
  const client = useQueryClient();
  const {data: me} = useGetMe();

  return useMutation({
    mutationFn: (transaction: CreateTransactionHouseholdDTO) => {
      if (!me?.householdId) throw new Error('ID domaćinstva nije dostupan');
      return createTransactionForHousehold(me.householdId, transaction);
    },
    onSuccess: () => {
      void client.invalidateQueries();

      toast.success('Transakcija je uspešno kreirana');
    },
    onError: async (error) => {
      const typedError = error as HTTPError<ErrorResponse>;
      const err = await typedError.response.json();

      posthog.captureException(error, {
        context: {
          feature: 'useCreateTransaction',
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

      toast.error('Kreiranje transakcije nije uspelo');
    },
  });
};
