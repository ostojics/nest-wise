import NetWorthCard from './net-worth-card';
import SpendingByCategoryCard from './spending-by-category-card';

const DashboardPage = () => {
  return (
    <section className="p-4 space-y-6">
      <div className="grid grid-cols-1 gap-4 lg:gap-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        <NetWorthCard />
        <SpendingByCategoryCard />
      </div>
    </section>
  );
};

export default DashboardPage;
