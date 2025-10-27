import {Button} from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {useDeleteScheduledTransaction} from '../hooks/use-scheduled-transactions';

interface DeleteScheduledTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transactionId: string;
  description: string;
}

export default function DeleteScheduledTransactionDialog({
  open,
  onOpenChange,
  transactionId,
  description,
}: DeleteScheduledTransactionDialogProps) {
  const deleteMutation = useDeleteScheduledTransaction();

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(transactionId, {
      onSettled: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Brisanje zakazane transakcije</DialogTitle>
          <DialogDescription>
            Da li ste sigurni da želite da obrišete zakazanu transakciju &quot;{description}&quot;?
            <br />
            Ova radnja se ne može poništiti.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={deleteMutation.isPending}>
              Otkaži
            </Button>
          </DialogClose>
          <Button variant="destructive" onClick={() => void handleDelete()} disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? 'Brisanje...' : 'Obriši'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
