import {Button} from '@/components/ui/button';
import {Card, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {IconAlertTriangle, IconPigMoney} from '@tabler/icons-react';

interface SavingsTrendCardErrorProps {
  onRetry: () => void;
}

const SavingsTrendCardError = ({onRetry}: SavingsTrendCardErrorProps) => {
  return (
    <Card className="@container/card group flex flex-col @xl/main:col-span-2">
      <CardHeader className="items-center pb-0">
        <CardDescription className="flex items-center gap-2">
          <IconPigMoney className="h-4 w-4" />
          Trend štednje
        </CardDescription>
        <CardTitle className="text-lg font-semibold transition-colors text-red-600 dark:text-red-400">Greška</CardTitle>
      </CardHeader>
      <CardFooter className="flex items-center justify-between text-sm w-full pt-4">
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

export default SavingsTrendCardError;
