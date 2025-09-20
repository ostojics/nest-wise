import {createAccountForHousehold} from '@/modules/api/accounts-api';
import {queryKeys} from '@/modules/api/query-keys';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';
import {CreateAccountHouseholdScopedDTO, ErrorResponse} from '@nest-wise/contracts';
import {HTTPError} from 'ky';

interface UseCreateAccountMutationProps {
  householdId: string;
  closeDialog: () => void;
}

export const useCreateAccountMutation = ({householdId, closeDialog}: UseCreateAccountMutationProps) => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateAccountHouseholdScopedDTO) => createAccountForHousehold(householdId, dto),
    onSuccess: () => {
      void client.invalidateQueries({queryKey: queryKeys.accounts.all()});
      toast.success('Account created successfully');
      closeDialog();
    },
    onError: async (error) => {
      const typedError = error as HTTPError<ErrorResponse>;
      const err = await typedError.response.json();

      if (err.message) {
        toast.error(err.message);
        return;
      }

      toast.error('Failed to create account');
    },
  });
};
