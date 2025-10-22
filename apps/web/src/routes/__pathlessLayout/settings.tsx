import {lazy} from 'react';
import {createFileRoute} from '@tanstack/react-router';

const SettingsPage = lazy(() => import('@/modules/settings/components/settings-page'));

export const Route = createFileRoute('/__pathlessLayout/settings')({
  component: SettingsPage,
});
