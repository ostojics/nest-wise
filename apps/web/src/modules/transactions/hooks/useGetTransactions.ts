import {queryKeys} from '@/modules/api/query-keys';
import {getTransactionsForHousehold} from '@/modules/api/transactions-api';
import {useGetMe} from '@/modules/auth/hooks/useGetMe';
import {GetTransactionsQueryHouseholdDTO} from '@nest-wise/contracts';
import {keepPreviousData, useQuery} from '@tanstack/react-query';

interface UseGetTransactionsArgs {
  search: GetTransactionsQueryHouseholdDTO;
}

export const useGetTransactions = ({search}: UseGetTransactionsArgs) => {
  const {data: me} = useGetMe();

  return useQuery({
    queryKey: queryKeys.transactions.all(search),
    queryFn: () => {
      if (!me?.householdId) throw new Error('No household ID available');
      return getTransactionsForHousehold(me.householdId, search);
    },
    enabled: Boolean(me?.householdId),
    placeholderData: keepPreviousData,
  });
};
