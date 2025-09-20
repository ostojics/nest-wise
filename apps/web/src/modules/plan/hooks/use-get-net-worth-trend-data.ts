import {useQuery} from '@tanstack/react-query';
import {getNetWorthTrendForHousehold} from '@/modules/api/transactions-api';
import {useGetMe} from '@/modules/auth/hooks/useGetMe';
import {queryKeys} from '@/modules/api/query-keys';

export const useGetNetWorthTrendData = () => {
  const {data: me} = useGetMe();

  return useQuery({
    queryKey: queryKeys.transactions.netWorthTrend(),
    queryFn: () => {
      if (!me?.householdId) throw new Error('No household ID available');
      return getNetWorthTrendForHousehold(me.householdId);
    },
    enabled: Boolean(me?.householdId),
  });
};
