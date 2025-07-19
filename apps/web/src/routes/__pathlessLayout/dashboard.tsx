import {createFileRoute} from '@tanstack/react-router';

export const Route = createFileRoute('/__pathlessLayout/dashboard')({
  component: Index,
});

function Index() {
  return <div>Hello</div>;
}
