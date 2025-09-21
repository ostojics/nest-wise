import SetupPage from '@/modules/setup/components/setup-page';
import {SetupProvider} from '@/modules/setup/setup-context';
import {createFileRoute} from '@tanstack/react-router';
import {z} from 'zod';

const setupSearchSchema = z.object({
  key: z.string().optional(),
});

export const Route = createFileRoute('/setup')({
  validateSearch: setupSearchSchema,
  component: SetupComponent,
});

function SetupComponent() {
  const {key} = Route.useSearch();

  return (
    <SetupProvider licenseKey={key}>
      <SetupPage />
    </SetupProvider>
  );
}
