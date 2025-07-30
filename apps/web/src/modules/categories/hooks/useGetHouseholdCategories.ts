import {getHouseholdCategories} from '@/modules/api/households-api';
import {queryKeys} from '@/modules/api/query-keys';
import {useQuery} from '@tanstack/react-query';

export const useGetHouseholdCategories = (householdId: string) => {
  return useQuery({
    queryKey: queryKeys.categories.all(),
    queryFn: () => getHouseholdCategories(householdId),
    enabled: !!householdId,
  });
};
