import {me} from '@/modules/api/auth-api';
import {queryKeys} from '@/modules/api/query-keys';
import {useQuery} from '@tanstack/react-query';

export const useGetMe = () => {
  return useQuery({
    queryKey: [queryKeys.me],
    queryFn: me,
    retry: 1,
  });
};
