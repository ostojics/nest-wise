import {useQuery} from '@tanstack/react-query';
import {getNetWorthTrend} from '@/modules/api/transactions-api';
import {queryKeys} from '@/modules/api/query-keys';

export const useGetNetWorthTrendData = () => {
  return useQuery({
    queryKey: queryKeys.transactions.netWorthTrend(),
    queryFn: () => getNetWorthTrend(),
  });
};
