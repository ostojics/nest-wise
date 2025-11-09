import {updateUserPreferences} from '@/modules/api/user-preferences-api';
import {queryKeys} from '@/modules/api/query-keys';
import {UpdateUserPreferencesDTO} from '@nest-wise/contracts';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';

export const useUpdateUserPreferences = () => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateUserPreferencesDTO) => updateUserPreferences(dto),
    onSuccess: () => {
      void client.invalidateQueries({queryKey: queryKeys.userPreferences.all()});
      toast.success('Podešavanja sačuvana');
    },
    onError: async (error) => {
      const {default: posthog} = await import('posthog-js');

      posthog.captureException(error, {
        context: {
          feature: 'user_preferences_update',
        },
      });

      toast.error('Ažuriranje podešavanja nije uspelo');
    },
  });
};
