import {getUserPreferences} from '@/modules/api/user-preferences-api';
import {queryKeys} from '@/modules/api/query-keys';
import {useQuery} from '@tanstack/react-query';
import {useGetMe} from '@/modules/auth/hooks/use-get-me';

export const useGetUserPreferences = () => {
  const {data: me} = useGetMe();

  return useQuery({
    queryKey: queryKeys.userPreferences.all(),
    queryFn: getUserPreferences,
    enabled: !!me,
  });
};
