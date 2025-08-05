import NetWorthCard from './net-worth-card';
import NetWorthTrendCard from './net-worth-trend-card';
import SpendingByCategoryCard from './spending-by-category-card';
import SpendingVsTargetCard from './spending-vs-target-card';

const DashboardPage = () => {
  return (
    <section className="p-4 space-y-6 @container/dashboard">
      <section className="flex flex-col gap-3">
        <div className="flex flex-col @4xl/dashboard:flex-row gap-3">
          <NetWorthCard />
          <SpendingVsTargetCard />
        </div>
        <SpendingByCategoryCard />
        <NetWorthTrendCard />
      </section>
    </section>
  );
};

export default DashboardPage;
