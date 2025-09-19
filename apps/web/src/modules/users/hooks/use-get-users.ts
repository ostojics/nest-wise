import {queryKeys} from '@/modules/api/query-keys';
import {getUsers, getHouseholdUsers} from '@/modules/api/users-api';
import {useQuery} from '@tanstack/react-query';
import {useGetMe} from '@/modules/auth/hooks/useGetMe';

export const useGetUsers = () => {
  return useQuery({
    queryKey: queryKeys.users.all(),
    queryFn: getUsers,
  });
};

export const useGetHouseholdUsers = () => {
  const {data: me} = useGetMe();

  return useQuery({
    queryKey: queryKeys.users.byHousehold(me?.householdId || ''),
    queryFn: () => getHouseholdUsers(me!.householdId),
    enabled: !!me?.householdId,
  });
};
