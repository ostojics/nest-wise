import DashboardPage from '@/modules/dashboard/components/dashboard-page';
import {createFileRoute} from '@tanstack/react-router';

export const Route = createFileRoute('/__pathlessLayout/dashboard')({
  component: DashboardPage,
});
