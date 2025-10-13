import {Card, CardContent, CardDescription, CardFooter, CardHeader} from '@/components/ui/card';
import {Skeleton} from '@/components/ui/skeleton';
import {IconTrendingUp} from '@tabler/icons-react';

const NetWorthTrendCardSkeleton = () => {
  return (
    <Card className="@container/card group flex flex-col @xl/main:col-span-2">
      <CardHeader className="items-center pb-0">
        <CardDescription className="flex items-center gap-2">
          <IconTrendingUp className="h-4 w-4" />
          Trend ukupnog kapitala
        </CardDescription>
        <Skeleton className="h-6 w-40" />
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="mx-auto aspect-[2/1] max-h-[300px] w-full">
          <Skeleton className="h-full w-full rounded-md" />
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm pt-4">
        <Skeleton className="h-4 w-56" />
      </CardFooter>
    </Card>
  );
};

export default NetWorthTrendCardSkeleton;
