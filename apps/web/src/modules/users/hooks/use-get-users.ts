import {queryKeys} from '@/modules/api/query-keys';
import {getUsers} from '@/modules/api/users-api';
import {useQuery} from '@tanstack/react-query';

export const useGetUsers = () => {
  return useQuery({
    queryKey: queryKeys.users.all(),
    queryFn: getUsers,
  });
};
