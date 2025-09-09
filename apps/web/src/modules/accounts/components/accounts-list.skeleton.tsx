import {Skeleton} from '@/components/ui/skeleton';

const AccountsListSkeleton = () => {
  const Card = () => (
    <div className="space-y-4 rounded-xl border p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-20" />
      </div>
    </div>
  );

  const Section = () => (
    <div>
      <Skeleton className="h-6 w-40" />
      <div className="mt-4 grid grid-cols-2 gap-4 @5xl/main:grid-cols-3">
        {Array.from({length: 6}).map((_, index) => (
          <Card key={index} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="mt-6 space-y-8">
      <Section />
      <Section />
    </div>
  );
};

export default AccountsListSkeleton;
