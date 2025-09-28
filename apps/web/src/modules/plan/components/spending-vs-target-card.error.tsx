import {Button} from '@/components/ui/button';
import {Card, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {IconAlertTriangle, IconTarget} from '@tabler/icons-react';

interface SpendingVsTargetCardErrorProps {
  onRetry: () => void;
}

const SpendingVsTargetCardError = ({onRetry}: SpendingVsTargetCardErrorProps) => {
  return (
    <Card className="flex-1">
      <CardHeader>
        <CardDescription className="flex items-center gap-2">
          <IconTarget className="h-4 w-4" />
          Monthly Budget
        </CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl transition-colors text-red-600 dark:text-red-400">
          Error
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <IconAlertTriangle className="h-4 w-4 text-yellow-500" />
          <span>Nije moguće učitati potrošnju.</span>
        </div>
        <Button variant="outline" size="sm" onClick={onRetry}>
          Retry
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SpendingVsTargetCardError;
