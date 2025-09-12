import MyFinancesPage from '@/modules/my-finances/components/my-finances-page';
import {createFileRoute} from '@tanstack/react-router';

export const Route = createFileRoute('/__pathlessLayout/my-finances')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="p-4">
      <MyFinancesPage />
    </section>
  );
}
