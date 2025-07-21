import {getHouseholdById} from '@/modules/api/households-api';
import {queryKeys} from '@/modules/api/query-keys';
import {useQuery} from '@tanstack/react-query';

export const useGetHouseholdById = (id: string) => {
  return useQuery({
    queryKey: queryKeys.households.single(id),
    queryFn: () => getHouseholdById(id),
    enabled: !!id,
  });
};
