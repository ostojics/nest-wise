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
      void navigate({to: '/onboarding', reloadDocument: true});
      toast.success('Podešavanje je uspešno završeno');
    },
    onError: () => {
      toast.error('Podešavanje nije uspelo');
    },
  });
};
