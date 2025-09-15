import {getHouseholdCategories} from '@/modules/api/households-api';
import {queryKeys} from '@/modules/api/query-keys';
import {useGetMe} from '@/modules/auth/hooks/useGetMe';
import {useQuery} from '@tanstack/react-query';

export const useGetHouseholdCategories = () => {
  const {data: me} = useGetMe();

  return useQuery({
    queryKey: queryKeys.categories.all(),
    queryFn: () => getHouseholdCategories(me?.householdId ?? ''),
    enabled: Boolean(me?.householdId),
  });
};
