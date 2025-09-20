import {queryKeys} from '@/modules/api/query-keys';
import {getSavingsTrendByHousehold} from '@/modules/api/savings-api';
import {useGetMe} from '@/modules/auth/hooks/useGetMe';
import {useQuery} from '@tanstack/react-query';

export const useGetSavingsTrend = () => {
  const {data: me} = useGetMe();

  return useQuery({
    queryKey: queryKeys.savings.trendByHousehold(me?.householdId ?? ''),
    queryFn: () => getSavingsTrendByHousehold(me?.householdId ?? ''),
    enabled: Boolean(me?.householdId),
  });
};
