import {useMutation} from '@tanstack/react-query';
import {sendHelp} from '@/modules/api/emails-api';
import {toast} from 'sonner';
import {HelpRequestDTO} from '@nest-wise/contracts';

export const useSendHelp = () => {
  return useMutation({
    mutationFn: (dto: HelpRequestDTO) => sendHelp(dto),
    onSuccess: () => {
      toast.success('Poruka je poslata');
    },
    onError: () => {
      toast.error('Došlo je do greške prilikom slanja poruke');
    },
  });
};
