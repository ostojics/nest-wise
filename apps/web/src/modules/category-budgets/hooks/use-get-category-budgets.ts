import {GetCategoryBudgetsQueryParams} from '@maya-vault/contracts';
import {useQuery} from '@tanstack/react-query';
import {getCategoryBudgets} from '../../api/category-budgets';
import {queryKeys} from '@/modules/api/query-keys';

export const useGetCategoryBudgets = (dto: GetCategoryBudgetsQueryParams) => {
  return useQuery({
    queryKey: queryKeys.categoryBudgets.all(dto),
    queryFn: () => getCategoryBudgets(dto),
  });
};
