import {queryKeys} from '@/modules/api/query-keys';
import {getTransactionsForHousehold} from '@/modules/api/transactions-api';
import {useGetMe} from '@/modules/auth/hooks/use-get-me';
import {GetTransactionsQueryHouseholdDTO, TransactionContract} from '@nest-wise/contracts';
import {keepPreviousData, useQuery} from '@tanstack/react-query';

interface UseGetAllTransactionsArgs {
  search: Omit<GetTransactionsQueryHouseholdDTO, 'page' | 'pageSize'>;
}

// TODO: Move this logic to backend endpoints that use the service method
export const useGetAllTransactions = ({search}: UseGetAllTransactionsArgs) => {
  const {data: me} = useGetMe();

  return useQuery({
    queryKey: queryKeys.transactions.allPages(search),
    queryFn: async (): Promise<TransactionContract[]> => {
      const results: TransactionContract[] = [];
      let currentPage = 1;
      const pageSize = 100;
      let hasMore = true;

      while (hasMore) {
        if (!me?.householdId) throw new Error('No household ID available');

        const {data, meta} = await getTransactionsForHousehold(me.householdId, {
          ...search,
          page: currentPage,
          pageSize,
        });

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
