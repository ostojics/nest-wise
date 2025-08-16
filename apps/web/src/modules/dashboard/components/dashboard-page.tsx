import {lazy, Suspense, useState} from 'react';
import NetWorthCard from './net-worth-card';
const NetWorthTrendCard = lazy(() => import('./net-worth-trend-card'));
import SpendingByCategoryCard from './spending-by-category-card';
import SpendingVsTargetCard from './spending-vs-target-card';
import {useIntersectionObserver} from 'usehooks-ts';
import NetWorthTrendCardSkeleton from './net-worth-trend-card.skeleton';

const DashboardPage = () => {
  const {ref} = useIntersectionObserver({
    threshold: 0.5,
    onChange: (isIntersecting) => {
      if (isIntersecting && !isVisible) {
        setIsVisible(true);
      }
    },
  });
  const [isVisible, setIsVisible] = useState(false);

  return (
    <section className="p-4 space-y-6 @container/dashboard">
      <section className="flex flex-col gap-3">
        <div className="flex flex-col @4xl/dashboard:flex-row gap-3">
          <NetWorthCard />
          <SpendingVsTargetCard />
        </div>
        <SpendingByCategoryCard />
        <Suspense fallback={<NetWorthTrendCardSkeleton />}>
          <div ref={ref}>{isVisible && <NetWorthTrendCard />}</div>
        </Suspense>
      </section>
    </section>
  );
};

export default DashboardPage;
