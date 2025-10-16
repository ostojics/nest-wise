import {mutationKeys} from '@/modules/api/mutation-keys';
import {confirmAiTransactionSuggestion} from '@/modules/api/transactions-api';
import {useGetMe} from '@/modules/auth/hooks/use-get-me';
import {ConfirmAiTransactionSuggestionHouseholdDTO, ErrorResponse} from '@nest-wise/contracts';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {HTTPError} from 'ky';
import {toast} from 'sonner';

export const useConfirmAiTransaction = () => {
  const client = useQueryClient();
  const {data: me} = useGetMe();

  return useMutation({
    mutationFn: async (confirmation: ConfirmAiTransactionSuggestionHouseholdDTO) => {
      if (!me?.householdId) throw new Error('ID domaćinstva nije dostupan');

      return await confirmAiTransactionSuggestion(me.householdId, confirmation);
    },
    mutationKey: mutationKeys.transactions.confirmAiTransaction(),
    onSuccess: async () => {
      await client.invalidateQueries();
      toast.success('Transakcija je uspešno kreirana');
    },
    onError: async (error) => {
      const typedError = error as HTTPError<ErrorResponse>;
      const err = await typedError.response.json();

      if (err.message) {
        toast.error(err.message);
        return;
      }

      toast.error('Kreiranje transakcije nije uspelo');
    },
  });
};
