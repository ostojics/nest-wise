import {createAiTransactionForHousehold, getAiTransactionJobStatus} from '@/modules/api/transactions-api';
import {useGetMe} from '@/modules/auth/hooks/use-get-me';
import {CreateTransactionAiHouseholdDTO, AiTransactionJobStatus} from '@nest-wise/contracts';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';

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
    onSuccess: async () => {
      await client.invalidateQueries();
      toast.success('Transakcija je uspešno obrađena');
    },
    onError: () => {
      toast.error('Obrada transakcije nije uspela');
    },
  });
};
