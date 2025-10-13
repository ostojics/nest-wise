import {forgotPassword} from '@/modules/api/auth-api';
import {useMutation} from '@tanstack/react-query';
import {useNavigate} from '@tanstack/react-router';
import {toast} from 'sonner';

export const useForgotPassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: async () => {
      toast.success('Ukoliko nalog postoji, poslat je email za resetovanje lozinke');
      await navigate({to: '/login'});
    },
    onError: () => {
      toast.error('Došlo je do greške prilikom obrade zahteva. Pokušajte ponovo.');
    },
  });
};
