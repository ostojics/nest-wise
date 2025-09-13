import {queryKeys} from '@/modules/api/query-keys';
import {getTransactions} from '@/modules/api/transactions-api';
import {useGetMe} from '@/modules/auth/hooks/useGetMe';
import {GetTransactionsQueryDTO} from '@maya-vault/contracts';
import {keepPreviousData, useQuery} from '@tanstack/react-query';

interface UseGetTransactionsArgs {
  search: GetTransactionsQueryDTO;
}

export const useGetTransactions = ({search}: UseGetTransactionsArgs) => {
  const {data: me} = useGetMe();

  return useQuery({
    queryKey: queryKeys.transactions.all(search),
    queryFn: () => getTransactions({...search, householdId: me?.householdId}),
    enabled: Boolean(me?.householdId),
    placeholderData: keepPreviousData,
  });
};
