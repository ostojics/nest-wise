import {mutationKeys} from '@/modules/api/mutation-keys';
import {requestAiTransactionSuggestion, getAiTransactionSuggestionStatus} from '@/modules/api/transactions-api';
import {useGetMe} from '@/modules/auth/hooks/use-get-me';
import {
  CreateTransactionAiHouseholdDTO,
  AiTransactionJobStatus,
  ErrorResponse,
  AiTransactionSuggestion,
} from '@nest-wise/contracts';
import {useMutation} from '@tanstack/react-query';
import {HTTPError} from 'ky';
import {toast} from 'sonner';

export const useCreateTransactionAISuggestion = () => {
  const {data: me} = useGetMe();

  return useMutation({
    mutationFn: async (transaction: CreateTransactionAiHouseholdDTO): Promise<AiTransactionSuggestion> => {
      if (!me?.householdId) throw new Error('ID domaćinstva nije dostupan');

      // Enqueue the job
      const jobResponse = await requestAiTransactionSuggestion(me.householdId, transaction);

      // Poll for completion
      const maxAttempts = 15; // 30 seconds max (2 second intervals)
      let attempts = 0;

      while (attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const status = await getAiTransactionSuggestionStatus(me.householdId, jobResponse.jobId);

        if (status.status === AiTransactionJobStatus.COMPLETED && status.suggestion) {
          return status.suggestion;
        } else if (status.status === AiTransactionJobStatus.FAILED) {
          throw new Error(status.error ?? 'Obrada predloga transakcije nije uspela');
        }

        attempts++;
      }

      throw new Error('Obrada predloga transakcije je predugo trajala');
    },
    mutationKey: mutationKeys.transactions.createAiTransaction(),
    onError: async (error) => {
      const typedError = error as HTTPError<ErrorResponse>;

      try {
        const err = await typedError.response.json();

        if (err.message) {
          toast.error(err.message);
          return;
        }
      } catch {
        // If JSON parsing fails, fall through to generic error
      }

      toast.error('Obrada predloga transakcije nije uspela');
    },
  });
};
