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
import {TransactionContract} from '@nest-wise/contracts';
import {Loader2, Trash2, Pencil} from 'lucide-react';
import React from 'react';
import {useDeleteTransaction} from '../hooks/use-delete-transaction';
import {EditTransactionDialog} from './edit-transaction-dialog';

interface TransactionActionsProps {
  transaction: TransactionContract;
}

const TransactionRowActions: React.FC<TransactionActionsProps> = ({transaction}) => {
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const deleteMutation = useDeleteTransaction();

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(transaction.id, {
      onSettled: () => setIsDeleteOpen(false),
    });
  };

  return (
    <>
      <Button
        variant="ghost"
        className="text-blue-500 hover:text-blue-500"
        title="Izmeni transakciju"
        size="icon"
        aria-label="Izmeni transakciju"
        onClick={() => setIsEditOpen(true)}
      >
        <Pencil className="size-4" />
        <span className="sr-only">Izmeni transakciju</span>
      </Button>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="text-red-500 hover:text-red-500"
            title="Obriši transakciju"
            size="icon"
            aria-label="Obriši transakciju"
          >
            {deleteMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
            <span className="sr-only">Obriši transakciju</span>
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader className="mb-3">
            <DialogTitle>Obriši transakciju</DialogTitle>
            <DialogDescription>Da li ste sigurni da želite da obrišete ovu transakciju?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)} disabled={deleteMutation.isPending}>
              Otkaži
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : 'Obriši'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EditTransactionDialog transaction={transaction} open={isEditOpen} onOpenChange={setIsEditOpen} />
    </>
  );
};

export default TransactionRowActions;
