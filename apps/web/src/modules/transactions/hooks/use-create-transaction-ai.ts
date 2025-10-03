import {createAiTransactionForHousehold} from '@/modules/api/transactions-api';
import {useGetMe} from '@/modules/auth/hooks/use-get-me';
import {CreateTransactionAiHouseholdDTO} from '@nest-wise/contracts';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';

export const useCreateTransactionAI = () => {
  const client = useQueryClient();
  const {data: me} = useGetMe();

  return useMutation({
    mutationFn: (transaction: CreateTransactionAiHouseholdDTO) => {
      if (!me?.householdId) throw new Error('ID domaćinstva nije dostupan');
      return createAiTransactionForHousehold(me.householdId, transaction);
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
