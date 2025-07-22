import {getHouseholdAccounts} from '@/modules/api/households-api';
import {queryKeys} from '@/modules/api/query-keys';
import {useQuery} from '@tanstack/react-query';

export const useGetHouseholdAccounts = (householdId: string) => {
  return useQuery({
    queryKey: queryKeys.accounts.all(),
    queryFn: () => getHouseholdAccounts(householdId),
    enabled: !!householdId,
  });
};
