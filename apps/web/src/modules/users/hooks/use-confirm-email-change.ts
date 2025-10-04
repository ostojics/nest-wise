import {useMutation, useQueryClient} from '@tanstack/react-query';
import {confirmEmailChange} from '@/modules/api/users-api';
import {ConfirmEmailChangeDTO} from '@nest-wise/contracts';
import {toast} from 'sonner';
import {queryKeys} from '@/modules/api/query-keys';

export const useConfirmEmailChange = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: ConfirmEmailChangeDTO) => confirmEmailChange(dto),
    onSuccess: () => {
      toast.success('E‑pošta je uspešno promenjena');
      void queryClient.invalidateQueries({queryKey: queryKeys.me()});
    },
    onError: () => {
      toast.error('Greška pri potvrdi promene e‑pošte');
    },
  });
};
