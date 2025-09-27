import {queryKeys} from '@/modules/api/query-keys';
import {getHouseholdUsers} from '@/modules/api/users-api';
import {useQuery} from '@tanstack/react-query';
import {useGetMe} from '@/modules/auth/hooks/use-get-me';

export const useGetHouseholdUsers = () => {
  const {data: me} = useGetMe();

  return useQuery({
    queryKey: queryKeys.users.byHousehold(me?.householdId ?? ''),
    queryFn: () => getHouseholdUsers(me?.householdId ?? ''),
    enabled: !!me?.householdId,
  });
};
