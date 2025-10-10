import {Button} from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {TransactionContract} from '@nest-wise/contracts';
import {Loader2} from 'lucide-react';
import React from 'react';
import {useDeleteTransaction} from '../hooks/use-delete-transaction';

interface DeleteTransactionDialogProps {
  transaction: TransactionContract;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteTransactionDialog({transaction, open, onOpenChange}: DeleteTransactionDialogProps) {
  const deleteMutation = useDeleteTransaction();

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(transaction.id, {
      onSettled: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] flex flex-col">
        <DialogHeader className="mb-3">
          <DialogTitle>Obriši transakciju</DialogTitle>
          <DialogDescription>Da li ste sigurni da želite da obrišete ovu transakciju?</DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto flex-1 -mx-6 px-6">
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={deleteMutation.isPending}>
              Otkaži
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : 'Obriši'}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
