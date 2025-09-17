import {queryKeys} from '@/modules/api/query-keys';
import {getTransactions} from '@/modules/api/transactions-api';
import {useGetMe} from '@/modules/auth/hooks/useGetMe';
import {GetTransactionsQueryDTO, TransactionContract} from '@maya-vault/contracts';
import {keepPreviousData, useQuery} from '@tanstack/react-query';

interface UseGetAllTransactionsArgs {
  search: Omit<GetTransactionsQueryDTO, 'page' | 'pageSize'>;
}

// TODO: Move this logic to a backend endpoint that uses the service method
export const useGetAllTransactions = ({search}: UseGetAllTransactionsArgs) => {
  const {data: me} = useGetMe();

  return useQuery({
    queryKey: queryKeys.transactions.allPages({...search, householdId: me?.householdId}),
    queryFn: async (): Promise<TransactionContract[]> => {
      const results: TransactionContract[] = [];
      let currentPage = 1;
      const pageSize = 100;
      let hasMore = true;

      while (hasMore) {
        const {data, meta} = await getTransactions({
          ...search,
          householdId: me?.householdId,
          page: currentPage,
          pageSize,
        } as GetTransactionsQueryDTO);

        results.push(...data);
        hasMore = currentPage < meta.totalPages;
        currentPage += 1;
      }

      return results;
    },
    enabled: Boolean(me?.householdId),
    placeholderData: keepPreviousData,
  });
};
