import {createFileRoute} from '@tanstack/react-router';
import {lazy} from 'react';

const NetWorthTrendCard = lazy(() => import('@/modules/reports/components/net-worth-trend-card'));

export const Route = createFileRoute('/__pathlessLayout/reports/net-worth')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <NetWorthTrendCard />
    </div>
  );
}
