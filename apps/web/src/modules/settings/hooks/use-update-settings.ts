import {updateHousehold} from '@/modules/api/households-api';
import {queryKeys} from '@/modules/api/query-keys';
import {useGetMe} from '@/modules/auth/hooks/use-get-me';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';

export const useUpdateSettings = () => {
  const client = useQueryClient();
  const {data: me} = useGetMe();

  return useMutation({
    mutationFn: ({id, data}: {id: string; data: {name?: string}}) => updateHousehold(id, data),
    onSuccess: (_, {id}) => {
      void client.invalidateQueries({queryKey: queryKeys.households.single(id)});
      toast.success('Podešavanja sačuvana');
    },
    onError: async (error) => {
      const {default: posthog} = await import('posthog-js');

      posthog.captureException(error, {
        context: {
          feature: 'settings_update',
        },
        meta: {
          householdId: me?.householdId,
          userId: me?.id,
        },
      });

      toast.error('Ažuriranje podešavanja nije uspelo');
    },
  });
};
