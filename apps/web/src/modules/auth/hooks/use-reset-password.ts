import {resetPassword} from '@/modules/api/auth-api';
import {useMutation} from '@tanstack/react-query';
import {useNavigate} from '@tanstack/react-router';
import {toast} from 'sonner';
import {reportError} from '@/lib/error-reporting';

export const useResetPassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: resetPassword,
    onSuccess: async () => {
      toast.success('Lozinka je uspešno resetovana.');
      await navigate({to: '/login'});
    },
    onError: async (error) => {
      await reportError(error, {
        feature: 'auth_reset_password',
      });

      toast.error('Nevažeći ili istekao token. Pokušajte ponovo.');
    },
  });
};
