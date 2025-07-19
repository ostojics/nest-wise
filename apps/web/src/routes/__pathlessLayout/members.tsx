import {createFileRoute} from '@tanstack/react-router';

export const Route = createFileRoute('/__pathlessLayout/members')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/__pathlessLayout/members"!</div>;
}
