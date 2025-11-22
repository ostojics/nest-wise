import {createPrivateTransaction} from '@/modules/api/private-transactions';
import {ErrorResponse} from '@nest-wise/contracts';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {HTTPError} from 'ky';
import {toast} from 'sonner';
import {reportError} from '@/lib/error-reporting';

export const useCreatePrivateTransaction = () => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: createPrivateTransaction,
    onSuccess: () => {
      void client.invalidateQueries();
      toast.success('Privatna transakcija je uspešno kreirana');
    },
    onError: async (error) => {
      const typedError = error as HTTPError<ErrorResponse>;
      const err = await typedError.response.json();

      await reportError(error, {
        feature: 'private_transaction_create',
      });

      if (err.message) {
        toast.error(err.message);
        return;
      }

      toast.error('Došlo je do neočekivane greške');
    },
  });
};
