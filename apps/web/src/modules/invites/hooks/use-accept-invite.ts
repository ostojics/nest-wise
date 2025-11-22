import {queryKeys} from '@/modules/api/query-keys';
import {acceptInvite} from '@/modules/api/users-api';
import {ErrorResponse} from '@nest-wise/contracts';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useNavigate} from '@tanstack/react-router';
import {HTTPError} from 'ky';
import {toast} from 'sonner';
import {reportError} from '@/lib/error-reporting';

export const useAcceptInvite = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acceptInvite,
    onSuccess: () => {
      void navigate({to: '/onboarding', reloadDocument: true});
      toast.success('Poziv je uspešno prihvaćen');
      void queryClient.invalidateQueries({queryKey: queryKeys.me()});
    },
    onError: async (error) => {
      const typedError = error as HTTPError<ErrorResponse>;
      const err = await typedError.response.json();

      await reportError(error, {
        feature: 'invite_accept',
      });

      if (err.message) {
        toast.error(err.message);
        return;
      }

      toast.error('Došlo je do neočekivane greške');
    },
  });
};
