import {useMutation} from '@tanstack/react-query';
import {sendHelp} from '@/modules/api/emails-api';
import {toast} from 'sonner';
import {ErrorResponse, HelpRequestDTO} from '@nest-wise/contracts';
import {HTTPError} from 'ky';
import posthog from 'posthog-js';
import {useGetMe} from '@/modules/auth/hooks/use-get-me';

export const useSendHelp = () => {
  const {data: me} = useGetMe();

  return useMutation({
    mutationFn: (dto: HelpRequestDTO) => sendHelp(dto),
    onSuccess: () => {
      toast.success('Poruka je poslata');
    },
    onError: async (error) => {
      const typedError = error as HTTPError<ErrorResponse>;
      const err = await typedError.response.json();

      posthog.captureException(error, {
        context: {
          feature: 'useSendHelp',
        },
        meta: {
          householdId: me?.householdId,
          userId: me?.id,
        },
      });

      if (err.message) {
        toast.error(err.message);
        return;
      }

      toast.error('Došlo je do neočekivane greške');
    },
  });
};
