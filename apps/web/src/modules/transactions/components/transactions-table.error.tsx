import {Button} from '@/components/ui/button';

export default function TransactionsTableError({onRetry}: {onRetry?: () => void}) {
  return (
    <div className="rounded-md border bg-card p-6 text-center">
      <p className="text-muted-foreground">Nije moguće učitati transakcije.</p>
      {onRetry && (
        <div className="mt-3">
          <Button variant="outline" onClick={onRetry}>
            Pokušaj ponovo
          </Button>
        </div>
      )}
    </div>
  );
}
