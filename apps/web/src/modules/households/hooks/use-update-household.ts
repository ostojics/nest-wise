import {queryKeys} from '@/modules/api/query-keys';
import {updateHousehold} from '@/modules/api/households-api';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';
import {UpdateHouseholdDTO} from '@nest-wise/contracts';
import posthog from 'posthog-js';
import {useGetMe} from '@/modules/auth/hooks/use-get-me';

interface UpdateHouseholdParams {
  id: string;
  data: UpdateHouseholdDTO;
}

export const useUpdateHousehold = () => {
  const client = useQueryClient();
  const {data: me} = useGetMe();

  return useMutation({
    mutationFn: ({id, data}: UpdateHouseholdParams) => updateHousehold(id, data),
    onSuccess: (_, {id}) => {
      void client.invalidateQueries({queryKey: queryKeys.households.single(id)});
      toast.success('Domaćinstvo je uspešno ažurirano');
    },
    onError: (error) => {
      posthog.captureException(error, {
        context: {
          feature: 'useUpdateHousehold',
        },
        meta: {
          householdId: me?.householdId,
          userId: me?.id,
        },
      });

      toast.error('Ažuriranje domaćinstva nije uspelo');
    },
  });
};
