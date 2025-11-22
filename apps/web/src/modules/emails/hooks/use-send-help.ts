import {useMutation} from '@tanstack/react-query';
import {sendHelp} from '@/modules/api/emails-api';
import {toast} from 'sonner';
import {ErrorResponse, HelpRequestDTO} from '@nest-wise/contracts';
import {HTTPError} from 'ky';
import {reportError} from '@/lib/error-reporting';

export const useSendHelp = () => {
  return useMutation({
    mutationFn: (dto: HelpRequestDTO) => sendHelp(dto),
    onSuccess: () => {
      toast.success('Poruka je poslata');
    },
    onError: async (error) => {
      const typedError = error as HTTPError<ErrorResponse>;
      const err = await typedError.response.json();

      await reportError(error, {
        feature: 'email_send_help',
      });

      if (err.message) {
        toast.error(err.message);
        return;
      }

      toast.error('Došlo je do neočekivane greške');
    },
  });
};
