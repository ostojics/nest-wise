import {Button} from '@/components/ui/button';
import {Card, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {IconAlertTriangle, IconListDetails} from '@tabler/icons-react';

interface CategoryBudgetsListErrorProps {
  onRetry: () => void;
  disabled?: boolean;
}

const CategoryBudgetsListError = ({onRetry, disabled}: CategoryBudgetsListErrorProps) => {
  return (
    <div className="space-y-4">
      <Card className="@container/card overflow-hidden">
        <CardHeader className="border-b">
          <CardDescription className="flex items-center gap-2">
            <IconListDetails className="h-4 w-4" />
            Category Budgets
          </CardDescription>
          <CardTitle className="text-base text-red-600 dark:text-red-400">Error</CardTitle>
        </CardHeader>
        <CardFooter className="flex items-center justify-between text-sm w-full pt-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconAlertTriangle className="h-4 w-4 text-yellow-500" />
            <span>Failed to load category budgets.</span>
          </div>
          <Button variant="outline" size="sm" onClick={onRetry} disabled={disabled}>
            Retry
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CategoryBudgetsListError;
