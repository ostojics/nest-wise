import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Skeleton} from '@/components/ui/skeleton';

const CategoryBudgetsListSkeleton = () => {
  return (
    <div className="space-y-4">
      <Card className="@container/card overflow-hidden">
        <CardHeader className="border-b">
          <CardTitle className="text-base">Total planned</CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-28" />
          </CardDescription>
        </CardHeader>
        <CardContent className="py-1">
          <Skeleton className="h-7 w-40" />
        </CardContent>
      </Card>

      <div className="rounded-md border bg-card">
        <div className="border-b">
          <div className="grid grid-cols-4 gap-4 px-4 py-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="divide-y">
          {Array.from({length: 6}).map((_, idx) => (
            <div key={idx} className="grid grid-cols-4 gap-4 px-4 py-3">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryBudgetsListSkeleton;
