import {Skeleton} from '@/components/ui/skeleton';

export default function PrivateTransactionsTableSkeleton() {
  return (
    <div className="rounded-md border bg-card">
      <div className="border-b">
        <div className="grid grid-cols-5 gap-4 px-4 py-3">
          {Array.from({length: 5}).map((_, i) => (
            <Skeleton key={i} className="h-4 w-24" />
          ))}
        </div>
      </div>
      <div className="divide-y">
        {Array.from({length: 8}).map((_, idx) => (
          <div key={idx} className="grid grid-cols-5 gap-4 px-4 py-3">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
