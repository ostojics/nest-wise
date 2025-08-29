import CategoryBudgetsList from '@/modules/category-budgets/components/category-budgets-list';
import AvailableBalanceCard from './available-balance-card';
import SpendingVsTargetCard from './spending-vs-target-card';
// const NetWorthTrendCard = lazy(() => import('./net-worth-trend-card'));

const PlanPage = () => {
  // const {ref} = useIntersectionObserver({
  //   threshold: 0.5,
  //   onChange: (isIntersecting) => {
  //     if (isIntersecting && !isVisible) {
  //       setIsVisible(true);
  //     }
  //   },
  // });
  // const [isVisible, setIsVisible] = useState(false);

  return (
    <section className="p-4 space-y-6 @container/dashboard">
      <section className="flex flex-col gap-3">
        <div className="flex flex-col @4xl/dashboard:flex-row gap-3">
          <AvailableBalanceCard />
          <SpendingVsTargetCard />
        </div>
        {/* <SpendingByCategoryCard />
        <Suspense fallback={<NetWorthTrendCardSkeleton />}>
          <div ref={ref}>{isVisible && <NetWorthTrendCard />}</div>
        </Suspense> */}
      </section>
      <CategoryBudgetsList />
    </section>
  );
};

export default PlanPage;
