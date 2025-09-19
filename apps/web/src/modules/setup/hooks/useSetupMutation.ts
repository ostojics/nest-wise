import {setup} from '@/modules/api/auth-api';
import {queryKeys} from '@/modules/api/query-keys';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useNavigate} from '@tanstack/react-router';
import {toast} from 'sonner';

export const useSetupMutation = () => {
  const navigate = useNavigate();
  const client = useQueryClient();

  return useMutation({
    mutationFn: setup,
    onSuccess: async () => {
      await client.invalidateQueries({queryKey: [queryKeys.me]});
      void navigate({to: '/plan', reloadDocument: true});
      toast.success('Setup successful');
    },
    onError: () => {
      toast.error('Setup failed');
    },
  });
};
