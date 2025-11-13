import {createAccountForHousehold} from '@/modules/api/accounts-api';
import {queryKeys} from '@/modules/api/query-keys';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';
import {CreateAccountHouseholdScopedDTO, ErrorResponse} from '@nest-wise/contracts';
import {HTTPError} from 'ky';
import {reportError} from '@/lib/error-reporting';

interface UseCreateAccountMutationProps {
  householdId: string;
}

export const useCreateAccountMutation = ({householdId}: UseCreateAccountMutationProps) => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateAccountHouseholdScopedDTO) => createAccountForHousehold(householdId, dto),
    onSuccess: () => {
      void client.invalidateQueries({queryKey: queryKeys.accounts.all()});
      toast.success('Račun je uspešno kreiran');
    },
    onError: async (error) => {
      const typedError = error as HTTPError<ErrorResponse>;
      const err = await typedError.response.json();

      await reportError(error, {
        feature: 'account_create',
      });

      if (err.message) {
        toast.error(err.message);
        return;
      }

      toast.error('Kreiranje računa nije uspelo');
    },
  });
};
