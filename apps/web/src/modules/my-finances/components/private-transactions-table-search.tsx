import {Input} from '@/components/ui/input';
import {useNavigate, useSearch} from '@tanstack/react-router';
import {useDebouncedCallback} from 'use-debounce';

const PrivateTransactionsTableSearch = () => {
  const search = useSearch({from: '/__pathlessLayout/my-finances'});
  const navigate = useNavigate();
  const debounced = useDebouncedCallback((value: string) => {
    void navigate({search: (prev) => ({...prev, q: value !== '' ? value : undefined, page: 1}), to: '/my-finances'});
  }, 350);

  return (
    <Input
      key={search.q ?? 'no-value'}
      className="w-full @xl/transactions-table-actions:max-w-sm"
      defaultValue={search.q ?? ''}
      onChange={(e) => debounced(e.target.value)}
      placeholder="Search private transactions"
    />
  );
};

export default PrivateTransactionsTableSearch;
