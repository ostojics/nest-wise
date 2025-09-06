import NetWorthTrendCard from '@/modules/reports/components/net-worth-trend-card';
import {createFileRoute} from '@tanstack/react-router';

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
