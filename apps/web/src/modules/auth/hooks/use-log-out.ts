import {logout} from '@/modules/api/auth-api';
import {queryKeys} from '@/modules/api/query-keys';
import {ErrorResponse} from '@maya-vault/contracts';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useNavigate} from '@tanstack/react-router';
import {HTTPError} from 'ky';
import {toast} from 'sonner';

export const useLogOut = () => {
  const client = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      void client.invalidateQueries({queryKey: [queryKeys.me]});
      void navigate({to: '/login', reloadDocument: true});
    },
    onError: async (error) => {
      const typedError = error as HTTPError<ErrorResponse>;
      const err = await typedError.response.json();

      if (err.message) {
        toast.error(err.message);
        return;
      }

      toast.error('Unexpected error occurred');
    },
  });
};
