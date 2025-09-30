import {useQuery} from '@tanstack/react-query';
import {getNetWorthTrendForHousehold} from '@/modules/api/transactions-api';
import {useGetMe} from '@/modules/auth/hooks/use-get-me';
import {queryKeys} from '@/modules/api/query-keys';

export const useGetNetWorthTrendData = () => {
  const {data: me} = useGetMe();

  return useQuery({
    queryKey: queryKeys.transactions.netWorthTrend(),
    queryFn: () => {
      if (!me?.householdId) throw new Error('ID domaćinstva nije dostupan');
      return getNetWorthTrendForHousehold(me.householdId);
    },
    enabled: Boolean(me?.householdId),
  });
};
