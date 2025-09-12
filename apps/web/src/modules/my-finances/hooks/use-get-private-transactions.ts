import {getPrivateTransactions} from '@/modules/api/private-transactions';
import {queryKeys} from '@/modules/api/query-keys';
import {useGetMe} from '@/modules/auth/hooks/useGetMe';
import {useQuery} from '@tanstack/react-query';
import {useSearch} from '@tanstack/react-router';

export const useGetPrivateTransactions = () => {
  const search = useSearch({from: '/__pathlessLayout/my-finances'});
  const {data: me} = useGetMe();

  return useQuery({
    queryKey: queryKeys.privateTransactions.all({...search, householdId: me?.householdId ?? ''}),
    queryFn: () => getPrivateTransactions({...search, householdId: me?.householdId ?? ''}),
    enabled: Boolean(me?.householdId),
  });
};
