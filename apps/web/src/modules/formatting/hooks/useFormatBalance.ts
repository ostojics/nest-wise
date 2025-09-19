import {useGetHouseholdById} from '@/modules/households/hooks/useGetHouseholdById';

export const useFormatBalance = () => {
  const {data: household, isLoading} = useGetHouseholdById();

  const formatBalance = (amount: number): string => {
    if (isLoading) return '';

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: household?.currencyCode ?? 'USD',
    }).format(amount);
  };

  return {formatBalance};
};
