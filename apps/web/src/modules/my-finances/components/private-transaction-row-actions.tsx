import {Button} from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {Loader2, Trash2} from 'lucide-react';
import React from 'react';
import {useDeletePrivateTransaction} from '../hooks/use-delete-private-transaction';
import {DialogClose} from '@radix-ui/react-dialog';

interface PrivateTransactionRowActionsProps {
  transactionId: string;
}

export default function PrivateTransactionRowActions({transactionId}: PrivateTransactionRowActionsProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const deleteMutation = useDeletePrivateTransaction();

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(transactionId, {
      onSettled: () => setIsOpen(false),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="text-red-500 hover:text-red-500"
          title="Obriši privatnu transakciju"
          size="icon"
          aria-label="Obriši"
        >
          {deleteMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
          <span className="sr-only">Obriši privatnu transakciju</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] flex flex-col">
        <DialogHeader className="mb-3">
          <DialogTitle>Obriši privatnu transakciju</DialogTitle>
          <DialogDescription>Da li ste sigurni da želite da obrišete ovu privatnu transakciju?</DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto flex-1 -mx-6 px-6">
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={deleteMutation.isPending}>
                Otkaži
              </Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : 'Obriši'}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
