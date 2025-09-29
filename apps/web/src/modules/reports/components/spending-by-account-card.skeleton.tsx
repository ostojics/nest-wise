import {Card, CardContent, CardDescription, CardFooter, CardHeader} from '@/components/ui/card';
import {Skeleton} from '@/components/ui/skeleton';
import {IconChartPie} from '@tabler/icons-react';

const SpendingByAccountCardSkeleton = () => {
  return (
    <Card className="@container/card group flex flex-col">
      <CardHeader className="flex justify-between items-center">
        <CardDescription className="flex items-center gap-2">
          <IconChartPie className="h-4 w-4" />
          Troškovi po računu
        </CardDescription>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-8 w-28" />
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="mx-auto aspect-square max-h-[23.75rem] @[300px]/card:max-h-[34.375rem] w-full">
          <Skeleton className="h-full w-full rounded-md" />
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm pt-4">
        <Skeleton className="h-4 w-40" />
      </CardFooter>
    </Card>
  );
};

export default SpendingByAccountCardSkeleton;
