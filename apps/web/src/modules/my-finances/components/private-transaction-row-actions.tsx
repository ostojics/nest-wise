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
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant="ghost" className="text-red-500 hover:text-red-500" size="icon" aria-label="Delete">
              {deleteMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
              <span className="sr-only">Delete private transaction</span>
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Delete transaction</TooltipContent>
      </Tooltip>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete private transaction</DialogTitle>
          <DialogDescription>Are you sure you want to delete this private transaction?</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={deleteMutation.isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
