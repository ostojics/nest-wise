import {logout} from '@/modules/api/auth-api';
import {ErrorResponse} from '@nest-wise/contracts';
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
      void client.invalidateQueries({refetchType: 'none'});
      void navigate({to: '/login', reloadDocument: true});
    },
    onError: async (error) => {
      const typedError = error as HTTPError<ErrorResponse>;
      const err = await typedError.response.json();

      if (err.message) {
        toast.error(err.message);
        return;
      }

      toast.error('Neočekivana greška, pokušajte ponovo.');
    },
  });
};
