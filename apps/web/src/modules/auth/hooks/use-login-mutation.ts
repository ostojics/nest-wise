import {login} from '@/modules/api/auth-api';
import {queryKeys} from '@/modules/api/query-keys';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useNavigate} from '@tanstack/react-router';
import {toast} from 'sonner';

export const useLoginMutation = () => {
  const navigate = useNavigate();
  const client = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: async () => {
      await client.invalidateQueries({queryKey: [queryKeys.me]});
      await navigate({to: '/plan', reloadDocument: true});
    },
    onError: () => {
      toast.error('Invalid credentials');
    },
  });
};
