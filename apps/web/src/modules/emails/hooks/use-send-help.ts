import {useMutation} from '@tanstack/react-query';
import {sendHelp} from '@/modules/api/emails-api';
import {toast} from 'sonner';
import {ErrorResponse, HelpRequestDTO} from '@nest-wise/contracts';
import {HTTPError} from 'ky';

export const useSendHelp = () => {
  return useMutation({
    mutationFn: (dto: HelpRequestDTO) => sendHelp(dto),
    onSuccess: () => {
      toast.success('Poruka je poslata');
    },
    onError: async (error) => {
      const typedError = error as HTTPError<ErrorResponse>;
      try {
        const err = await typedError.response.json();

        if (err.message) {
          toast.error(err.message);
          return;
        }
      } catch {
        // Ignore parsing errors
      }

      toast.error('Došlo je do neočekivane greške');
    },
  });
};
