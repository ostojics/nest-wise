import {Card, CardAction, CardDescription, CardFooter, CardHeader} from '@/components/ui/card';
import {Skeleton} from '@/components/ui/skeleton';
import {IconWallet} from '@tabler/icons-react';

const NetWorthCardSkeleton = () => {
  return (
    <Card className="flex-1">
      <CardHeader>
        <CardDescription className="flex items-center gap-2">
          <IconWallet className="h-4 w-4" />
          Raspoloživo stanje
        </CardDescription>
        <Skeleton className="h-8 w-48" />
        <CardAction>
          <Skeleton className="h-6 w-20" />
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-40" />
      </CardFooter>
    </Card>
  );
};

export default NetWorthCardSkeleton;
