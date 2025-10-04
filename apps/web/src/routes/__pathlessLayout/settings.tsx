import SettingsPage from '@/modules/settings/components/settings-page';
import {createFileRoute} from '@tanstack/react-router';

export const Route = createFileRoute('/__pathlessLayout/settings')({
  component: SettingsPage,
});
