import {createFileRoute} from '@tanstack/react-router';

export const Route = createFileRoute('/__pathlessLayout/reports/spending')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/__pathlessLayout/reports/spending"!</div>;
}
