import {Input} from '@/components/ui/input';
import {useNavigate, useSearch} from '@tanstack/react-router';
import {useDebouncedCallback} from 'use-debounce';

const TransactionsTableSearch = () => {
  const search = useSearch({from: '/__pathlessLayout/transactions'});
  const navigate = useNavigate();
  const debounced = useDebouncedCallback((value: string) => {
    void navigate({search: (prev) => ({...prev, q: value}), to: '/transactions'});
  }, 350);

  return (
    <Input
      key={search.q ?? 'no-value'}
      className="max-w-sm"
      defaultValue={search.q ?? ''}
      onChange={(e) => debounced(e.target.value)}
      placeholder="Search transactions"
    />
  );
};

export default TransactionsTableSearch;
