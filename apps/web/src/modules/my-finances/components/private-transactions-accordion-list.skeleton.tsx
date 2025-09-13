import {Skeleton} from '@/components/ui/skeleton';

export default function PrivateTransactionsAccordionListSkeleton() {
  return (
    <div className="rounded-md border bg-card">
      {Array.from({length: 6}).map((_, idx) => (
        <div key={idx} className="border-b px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="mt-2 h-3 w-32" />
            </div>
            <div className="shrink-0 text-right">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="mt-2 h-3 w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
