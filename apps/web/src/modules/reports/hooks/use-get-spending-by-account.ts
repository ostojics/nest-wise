import {queryKeys} from '@/modules/api/query-keys';
import {spendingByAccounts} from '@/modules/api/transactions-api';
import {useQuery} from '@tanstack/react-query';
import {useSearch} from '@tanstack/react-router';

export const useGetSpendingByAccount = () => {
  const search = useSearch({from: '/__pathlessLayout/reports/spending'});

  return useQuery({
    queryKey: queryKeys.transactions.spendingByAccounts(search),
    queryFn: () => spendingByAccounts(search),
  });
};
