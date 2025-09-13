import {Button} from '@/components/ui/button';

export default function PrivateTransactionsAccordionListError({onRetry}: {onRetry?: () => void}) {
  return (
    <div className="rounded-md border bg-card p-6 text-center">
      <p className="text-muted-foreground">Failed to load private transactions.</p>
      {onRetry && (
        <div className="mt-3">
          <Button variant="outline" onClick={onRetry}>
            Retry
          </Button>
        </div>
      )}
    </div>
  );
}
