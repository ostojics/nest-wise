import {getHouseholdById} from '@/modules/api/households-api';
import {queryKeys} from '@/modules/api/query-keys';
import {useGetMe} from '@/modules/auth/hooks/useGetMe';
import {useQuery} from '@tanstack/react-query';

export const useGetHouseholdById = () => {
  const {data: me} = useGetMe();

  return useQuery({
    queryKey: queryKeys.households.single(me?.householdId ?? ''),
    queryFn: () => getHouseholdById(me?.householdId ?? ''),
    enabled: !!me?.householdId,
  });
};
