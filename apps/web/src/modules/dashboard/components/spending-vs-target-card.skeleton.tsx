import {Card, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {Skeleton} from '@/components/ui/skeleton';

const SpendingVsTargetCardSkeleton = () => {
  return (
    <Card className="flex-1">
      <CardHeader>
        <CardDescription className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-8 w-8 rounded-md" />
        </CardDescription>
        <CardTitle>
          <Skeleton className="h-8 w-40" />
        </CardTitle>
        <Skeleton className="h-4 w-32" />
      </CardHeader>
      <CardFooter className="flex-col items-start gap-4 text-sm">
        <div className="w-full space-y-2">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-2.5 w-full" />
        </div>

        <div className="flex justify-between items-center w-full">
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-28" />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SpendingVsTargetCardSkeleton;
