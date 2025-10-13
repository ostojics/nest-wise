import {queryKeys} from '@/modules/api/query-keys';
import {getSpendingTotal} from '@/modules/api/transactions-api';
import {useGetMe} from '@/modules/auth/hooks/use-get-me';
import {GetSpendingSummaryQueryHouseholdDTO} from '@nest-wise/contracts';
import {keepPreviousData, useQuery} from '@tanstack/react-query';

interface UseGetSpendingTotalArgs {
  search: GetSpendingSummaryQueryHouseholdDTO;
}

export const useGetSpendingTotal = ({search}: UseGetSpendingTotalArgs) => {
  const {data: me} = useGetMe();

  return useQuery({
    queryKey: queryKeys.transactions.spendingTotal(search),
    queryFn: async () => {
      if (!me?.householdId) throw new Error('ID domaćinstva nije dostupan');
      return await getSpendingTotal(me.householdId, search);
    },
    enabled: Boolean(me?.householdId),
    placeholderData: keepPreviousData,
  });
};
