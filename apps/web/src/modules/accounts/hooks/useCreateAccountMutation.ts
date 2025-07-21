import {createAccount} from '@/modules/api/accounts-api';
import {useMutation} from '@tanstack/react-query';
import {toast} from 'sonner';

export const useCreateAccountMutation = () => {
  return useMutation({
    mutationFn: createAccount,
    onSuccess: () => {
      toast.success('Account created successfully');
    },
    onError: () => {
      toast.error('Failed to create account');
    },
  });
};
