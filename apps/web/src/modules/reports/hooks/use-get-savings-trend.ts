import {queryKeys} from '@/modules/api/query-keys';
import {getSavingsTrend} from '@/modules/api/savings-api';
import {useQuery} from '@tanstack/react-query';

export const useGetSavingsTrend = () => {
  return useQuery({
    queryKey: queryKeys.savings.trend(),
    queryFn: getSavingsTrend,
  });
};
