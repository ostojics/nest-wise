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
import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip';
import {TransactionContract} from '@maya-vault/contracts';
import {Loader2, Trash2} from 'lucide-react';
import React from 'react';
import {useDeleteTransaction} from '../hooks/useDeleteTransaction';

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
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="text-red-500 hover:text-red-500"
              size="icon"
              aria-label="Delete transaction"
            >
              {deleteMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
              <span className="sr-only">Delete transaction</span>
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Delete transaction</TooltipContent>
      </Tooltip>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete transaction</DialogTitle>
          <DialogDescription>Are you sure you want to delete this transaction?</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={deleteMutation.isPending}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionRowActions;
