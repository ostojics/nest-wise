import {createFileRoute} from '@tanstack/react-router';

export const Route = createFileRoute('/__pathlessLayout/reports/savings')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/__pathlessLayout/reports/savings"!</div>;
}
