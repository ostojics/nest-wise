import {useQuery} from '@tanstack/react-query';
import {getActiveHouseholdAccounts} from '@/modules/api/households-api';
import {useGetMe} from '@/modules/auth/hooks/use-get-me';
import {queryKeys} from '@/modules/api/query-keys';

export const useGetActiveHouseholdAccounts = () => {
  const {data: me} = useGetMe();

  return useQuery({
    queryKey: [...queryKeys.accounts.all(), 'active'],
    queryFn: () => getActiveHouseholdAccounts(me?.householdId ?? ''),
    enabled: Boolean(me?.householdId),
  });
};
