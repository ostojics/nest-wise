import {createFileRoute} from '@tanstack/react-router';
import {lazy} from 'react';

const SavingsTrendCard = lazy(() => import('@/modules/reports/components/savings-trend-card'));

export const Route = createFileRoute('/__pathlessLayout/reports/savings')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <SavingsTrendCard />
    </div>
  );
}
