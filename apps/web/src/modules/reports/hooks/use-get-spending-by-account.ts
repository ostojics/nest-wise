import {queryKeys} from '@/modules/api/query-keys';
import {spendingByAccountsForHousehold} from '@/modules/api/transactions-api';
import {useGetMe} from '@/modules/auth/hooks/use-get-me';
import {useQuery} from '@tanstack/react-query';
import {useSearch} from '@tanstack/react-router';

export const useGetSpendingByAccount = () => {
  const search = useSearch({from: '/__pathlessLayout/reports/spending'});
  const {data: me} = useGetMe();

  // Use the simplified date parameters
  const queryParams = {
    from: search.from,
    to: search.to,
  };

  return useQuery({
    queryKey: queryKeys.transactions.spendingByAccounts(queryParams),
    queryFn: () => {
      if (!me?.householdId) throw new Error('No household ID available');
      return spendingByAccountsForHousehold(me.householdId, queryParams);
    },
    enabled: Boolean(me?.householdId),
  });
};
