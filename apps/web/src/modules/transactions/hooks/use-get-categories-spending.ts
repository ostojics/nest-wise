import {queryKeys} from '@/modules/api/query-keys';
import {getCategoriesSpending} from '@/modules/api/transactions-api';
import {useGetMe} from '@/modules/auth/hooks/use-get-me';
import {GetSpendingSummaryQueryHouseholdDTO} from '@nest-wise/contracts';
import {keepPreviousData, useQuery} from '@tanstack/react-query';

interface UseGetCategoriesSpendingArgs {
  search: GetSpendingSummaryQueryHouseholdDTO;
}

export const useGetCategoriesSpending = ({search}: UseGetCategoriesSpendingArgs) => {
  const {data: me} = useGetMe();

  return useQuery({
    queryKey: queryKeys.transactions.categoriesSpending(search),
    queryFn: async () => {
      if (!me?.householdId) throw new Error('ID domaćinstva nije dostupan');
      return await getCategoriesSpending(me.householdId, search);
    },
    enabled: Boolean(me?.householdId),
    placeholderData: keepPreviousData,
  });
};
