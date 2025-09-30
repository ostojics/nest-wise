import {Button} from '@/components/ui/button';
import {Card, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {IconAlertTriangle, IconChartPie} from '@tabler/icons-react';

interface SpendingByCategoryCardErrorProps {
  onRetry: () => void;
}

const SpendingByCategoryCardError = ({onRetry}: SpendingByCategoryCardErrorProps) => {
  return (
    <Card className="@container/card group flex flex-col">
      <CardHeader>
        <CardDescription className="flex items-center gap-2">
          <IconChartPie className="h-4 w-4" />
          Troškovi po kategoriji
        </CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl transition-colors text-red-600 dark:text-red-400">
          Greška
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <IconAlertTriangle className="h-4 w-4 text-yellow-500" />
          <span>Nije moguće učitati grafikon.</span>
        </div>
        <Button variant="outline" size="sm" onClick={onRetry}>
          Pokušaj ponovo
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SpendingByCategoryCardError;
