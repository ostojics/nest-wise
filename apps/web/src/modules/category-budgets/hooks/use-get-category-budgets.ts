import {queryKeys} from '@/modules/api/query-keys';
import {useQuery} from '@tanstack/react-query';
import {useSearch} from '@tanstack/react-router';
import {getCategoryBudgets} from '../../api/category-budgets';
import {useGetMe} from '@/modules/auth/hooks/useGetMe';

export const useGetCategoryBudgets = () => {
  const search = useSearch({from: '/__pathlessLayout/plan'});
  const {data: me} = useGetMe();

  return useQuery({
    queryKey: queryKeys.categoryBudgets.all(search),
    queryFn: () => getCategoryBudgets(me?.householdId ?? '', search),
    enabled: Boolean(me?.householdId),
  });
};
