import {login} from '@/modules/api/auth-api';
import {queryKeys} from '@/modules/api/query-keys';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useNavigate} from '@tanstack/react-router';
import {toast} from 'sonner';
import posthog from 'posthog-js';

export const useLoginMutation = () => {
  const navigate = useNavigate();
  const client = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: async () => {
      await client.invalidateQueries({queryKey: [queryKeys.me]});
      await navigate({to: '/plan', reloadDocument: true});
    },
    onError: (error) => {
      posthog.captureException(error, {
        context: {
          feature: 'auth_login',
        },
      });

      toast.error('Kredencijali nisu ispravni');
    },
  });
};
