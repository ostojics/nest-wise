import {createAccount} from '@/modules/api/accounts-api';
import {queryKeys} from '@/modules/api/query-keys';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';

interface UseCreateAccountMutationProps {
  closeDialog: () => void;
}

export const useCreateAccountMutation = ({closeDialog}: UseCreateAccountMutationProps) => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: createAccount,
    onSuccess: () => {
      void client.invalidateQueries({queryKey: queryKeys.accounts.all()});
      toast.success('Account created successfully');
      closeDialog();
    },
    onError: () => {
      toast.error('Failed to create account');
    },
  });
};
