import {getHouseholdAccounts} from '@/modules/api/households-api';
import {queryKeys} from '@/modules/api/query-keys';
import {useGetMe} from '@/modules/auth/hooks/use-get-me';
import {useQuery} from '@tanstack/react-query';

export const useGetHouseholdAccounts = () => {
  const {data: me} = useGetMe();

  return useQuery({
    queryKey: queryKeys.accounts.all(),
    queryFn: () => getHouseholdAccounts(me?.householdId ?? ''),
    enabled: Boolean(me?.householdId),
  });
};
