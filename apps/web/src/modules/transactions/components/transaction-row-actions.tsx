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
import {Loader2, Trash2} from 'lucide-react';
import React from 'react';
import {useDeleteTransaction} from '../hooks/use-delete-transaction';

interface TransactionActionsProps {
  transaction: TransactionContract;
}

const TransactionRowActions: React.FC<TransactionActionsProps> = ({transaction}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const deleteMutation = useDeleteTransaction();

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(transaction.id, {
      onSettled: () => setIsOpen(false),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={deleteMutation.isPending}>
            Otkaži
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : 'Obriši'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionRowActions;
