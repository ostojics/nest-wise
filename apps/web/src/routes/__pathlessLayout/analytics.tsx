import {createFileRoute} from '@tanstack/react-router';

export const Route = createFileRoute('/__pathlessLayout/analytics')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/__pathlessLayout/analytics"!</div>;
}
