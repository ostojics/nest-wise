import {queryKeys} from '@/modules/api/query-keys';
import {useQuery} from '@tanstack/react-query';
import {useSearch} from '@tanstack/react-router';
import {getCategoryBudgets} from '../../api/category-budgets';

export const useGetCategoryBudgets = () => {
  const search = useSearch({from: '/__pathlessLayout/plan'});

  return useQuery({
    queryKey: queryKeys.categoryBudgets.all(search),
    queryFn: () => getCategoryBudgets(search),
  });
};
