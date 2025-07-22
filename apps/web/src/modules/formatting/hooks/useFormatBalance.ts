import {useGetMe} from '@/modules/auth/hooks/useGetMe';
import {useGetHouseholdById} from '@/modules/households/hooks/useGetHouseholdById';

export const useFormatBalance = () => {
  const {data: me} = useGetMe();
  const {data: household, isLoading} = useGetHouseholdById(me?.householdId ?? '');

  const formatBalance = (amount: number): string => {
    if (isLoading) return '';

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: household?.currencyCode ?? 'USD',
    }).format(amount);
  };

  return {formatBalance};
};
