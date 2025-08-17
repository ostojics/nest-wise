import {Skeleton} from '@/components/ui/skeleton';

const UsersListSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {Array.from({length: 6}).map((_, index) => (
        <div key={index} className="space-y-4 rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-56" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default UsersListSkeleton;
