import {lazy, Suspense, useState} from 'react';
import DateFromPicker from './selects/date-from';
import DateToPicker from './selects/date-to';
const SpendingByAccountCard = lazy(() => import('./spending-by-account-card'));
import SpendingByCategoryCard from './spending-by-category-card';
import {Label} from '@/components/ui/label';
import {useIntersectionObserver} from 'usehooks-ts';
import SpendingByAccountCardSkeleton from './spending-by-account-card.skeleton';

const SpendingReportPage = () => {
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
    <section>
      <section className="flex flex-col gap-2 flex-1 md:flex-row mb-4 w-[34.375rem] mt-4">
        <div className="flex flex-col gap-1 flex-1">
          <Label htmlFor="dashboard-date-from" className="px-1">
            Date from
          </Label>
          <DateFromPicker />
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <Label htmlFor="dashboard-date-to" className="px-1">
            Date to
          </Label>
          <DateToPicker />
        </div>
      </section>
      <SpendingByCategoryCard />
      <section className="mt-4">
        <Suspense fallback={<SpendingByAccountCardSkeleton />}>
          <div ref={ref}>{isVisible && <SpendingByAccountCard />}</div>
        </Suspense>
      </section>
    </section>
  );
};

export default SpendingReportPage;
