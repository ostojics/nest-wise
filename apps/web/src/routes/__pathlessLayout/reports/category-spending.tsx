import {createFileRoute} from '@tanstack/react-router';

export const Route = createFileRoute('/__pathlessLayout/reports/category-spending')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/__pathlessLayout/reports/category-spending"!</div>;
}
