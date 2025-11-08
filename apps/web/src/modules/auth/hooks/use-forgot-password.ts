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
    onError: async (error) => {
      const {default: posthog} = await import('posthog-js');

      posthog.captureException(error, {
        context: {
          feature: 'auth_forgot_password',
        },
      });

      toast.error('Došlo je do greške prilikom obrade zahteva. Pokušajte ponovo.');
    },
  });
};
