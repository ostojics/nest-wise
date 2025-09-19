import {queryKeys} from '@/modules/api/query-keys';
import {spendingByAccountsForHousehold} from '@/modules/api/transactions-api';
import {useGetMe} from '@/modules/auth/hooks/useGetMe';
import {useQuery} from '@tanstack/react-query';
import {useSearch} from '@tanstack/react-router';

export const useGetSpendingByAccount = () => {
  const search = useSearch({from: '/__pathlessLayout/reports/spending'});
  const {data: me} = useGetMe();

  // Convert legacy parameters to new format
  const queryParams = {
    date_from: search.transactionDate_from,
    date_to: search.transactionDate_to,
  };

  return useQuery({
    queryKey: queryKeys.transactions.spendingByAccounts(search),
    queryFn: () => {
      if (!me?.householdId) throw new Error('No household ID available');
      return spendingByAccountsForHousehold(me.householdId, queryParams);
    },
    enabled: Boolean(me?.householdId),
  });
};
