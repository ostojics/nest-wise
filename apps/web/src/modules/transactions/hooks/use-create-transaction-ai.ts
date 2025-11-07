import {mutationKeys} from '@/modules/api/mutation-keys';
import {createAiTransactionForHousehold, getAiTransactionJobStatus} from '@/modules/api/transactions-api';
import {useGetMe} from '@/modules/auth/hooks/use-get-me';
import {CreateTransactionAiHouseholdDTO, AiTransactionJobStatus, ErrorResponse} from '@nest-wise/contracts';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {HTTPError} from 'ky';
import {toast} from 'sonner';
import posthog from 'posthog-js';

export const useCreateTransactionAI = () => {
  const client = useQueryClient();
  const {data: me} = useGetMe();

  return useMutation({
    mutationFn: async (transaction: CreateTransactionAiHouseholdDTO) => {
      if (!me?.householdId) throw new Error('ID domaćinstva nije dostupan');

      // Enqueue the job
      const jobResponse = await createAiTransactionForHousehold(me.householdId, transaction);

      // Poll for completion
      const maxAttempts = 15; // 30 seconds max (2 second intervals)
      let attempts = 0;

      while (attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const status = await getAiTransactionJobStatus(me.householdId, jobResponse.jobId);

        if (status.status === AiTransactionJobStatus.COMPLETED) {
          return status.transaction;
        } else if (status.status === AiTransactionJobStatus.FAILED) {
          throw new Error(status.error ?? 'Obrada transakcije nije uspela');
        }

        attempts++;
      }

      throw new Error('Obrada transakcije je predugo trajala');
    },
    mutationKey: mutationKeys.transactions.createAiTransaction(),
    onSuccess: async () => {
      await client.invalidateQueries();
      toast.success('Transakcija je uspešno obrađena');
    },
    onError: async (error) => {
      const typedError = error as HTTPError<ErrorResponse>;
      const err = await typedError.response.json();

      posthog.captureException(error, {
        context: {
          feature: 'useCreateTransactionAI',
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

      toast.error('Obrada transakcije nije uspela');
    },
  });
};
