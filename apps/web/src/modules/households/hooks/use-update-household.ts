import {queryKeys} from '@/modules/api/query-keys';
import {updateHousehold} from '@/modules/api/households-api';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';
import {UpdateHouseholdDTO} from '@nest-wise/contracts';
import {reportError} from '@/lib/error-reporting';

interface UpdateHouseholdParams {
  id: string;
  data: UpdateHouseholdDTO;
}

export const useUpdateHousehold = () => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: ({id, data}: UpdateHouseholdParams) => updateHousehold(id, data),
    onSuccess: (_, {id}) => {
      void client.invalidateQueries({queryKey: queryKeys.households.single(id)});
      toast.success('Domaćinstvo je uspešno ažurirano');
    },
    onError: async (error) => {
      await reportError(error, {
        feature: 'household_update',
      });

      toast.error('Ažuriranje domaćinstva nije uspelo');
    },
  });
};
