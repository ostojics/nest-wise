import {createTransactionForHousehold} from '@/modules/api/transactions-api';
import {useGetMe} from '@/modules/auth/hooks/use-get-me';
import {CreateTransactionHouseholdDTO} from '@nest-wise/contracts';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';

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
    onError: () => {
      toast.error('Kreiranje transakcije nije uspelo');
    },
  });
};
