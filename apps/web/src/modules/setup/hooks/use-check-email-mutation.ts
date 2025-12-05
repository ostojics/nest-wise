import {checkEmailAvailability} from '@/modules/api/auth-api';
import {useMutation} from '@tanstack/react-query';

export const useCheckEmailMutation = () => {
  return useMutation({
    mutationFn: checkEmailAvailability,
    onError: async (error) => {
      const {default: posthog} = await import('posthog-js');

      posthog.captureException(error, {
        context: {
          feature: 'setup_email_check',
        },
      });
    },
  });
};
