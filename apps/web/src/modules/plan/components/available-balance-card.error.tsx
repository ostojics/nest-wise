import {Card, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {IconAlertTriangle, IconWallet} from '@tabler/icons-react';

interface AvailableBalanceCardErrorProps {
  onRetry: () => void;
}

const AvailableBalanceCardError = ({onRetry}: AvailableBalanceCardErrorProps) => {
  return (
    <Card className="group flex-1 hover:shadow-md transition-all duration-200">
      <CardHeader>
        <CardDescription className="flex items-center gap-2">
          <IconWallet className="h-4 w-4" />
          Available Balance
        </CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl transition-colors text-red-600 dark:text-red-400">
          Error
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm w-full">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconAlertTriangle className="h-4 w-4 text-yellow-500" />
            <span>Failed to load available balance.</span>
          </div>
          <Button variant="outline" size="sm" onClick={onRetry}>
            Retry
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AvailableBalanceCardError;
