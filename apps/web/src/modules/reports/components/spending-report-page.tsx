import DateFromPicker from './selects/date-from';
import DateToPicker from './selects/date-to';
import SpendingByCategoryCard from './spending-by-category-card';
import {Label} from '@/components/ui/label';

const SpendingReportPage = () => {
  return (
    <section>
      <div className="flex flex-col gap-2 flex-1 md:flex-row mb-4 w-[34.375rem] mt-4">
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
      </div>
      <SpendingByCategoryCard />
    </section>
  );
};

export default SpendingReportPage;
