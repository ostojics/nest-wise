import {queryKeys} from '@/modules/api/query-keys';
import {updateHousehold} from '@/modules/api/households-api';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';
import {UpdateHouseholdDTO} from '@nest-wise/contracts';

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
      toast.success('Household updated successfully');
    },
    onError: () => {
      toast.error('Failed to update household');
    },
  });
};
