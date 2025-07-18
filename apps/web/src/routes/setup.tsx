import SetupPage from '@/modules/setup/components/setup-page';
import {SetupProvider} from '@/modules/setup/setup-context';
import {createFileRoute} from '@tanstack/react-router';

export const Route = createFileRoute('/setup')({
  component: () => (
    <SetupProvider>
      <SetupPage />
    </SetupProvider>
  ),
});
