import {Skeleton} from '@/components/ui/skeleton';

export default function TransactionsAccordionListSkeleton() {
  return (
    <div className="rounded-md border bg-card divide-y">
      {Array.from({length: 8}).map((_, idx) => (
        <div key={idx} className="px-4 py-3">
          <div className="flex items-center justify-between gap-5">
            <div className="min-w-0 flex-1">
              <Skeleton className="h-4 w-48" />
              <div className="mt-2">
                <Skeleton className="h-3 w-28" />
              </div>
            </div>
            <div className="flex flex-col items-end">
              <Skeleton className="h-4 w-20" />
              <div className="mt-2">
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
