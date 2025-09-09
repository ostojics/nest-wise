import {Skeleton} from '@/components/ui/skeleton';

export default function CategoryBudgetsAccordionListSkeleton() {
  return (
    <div className="rounded-md border bg-card divide-y">
      {Array.from({length: 6}).map((_, idx) => (
        <div key={idx} className="px-4 py-3">
          <div className="flex items-center justify-between gap-5">
            <div className="min-w-0 flex-1">
              <Skeleton className="h-4 w-40" />
              <div className="mt-2">
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}
