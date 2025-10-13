import {Button} from '@/components/ui/button';
import {TransactionContract} from '@nest-wise/contracts';
import {Trash2, Pencil} from 'lucide-react';
import React from 'react';
import {EditTransactionDialog} from './edit-transaction-dialog';
import {DeleteTransactionDialog} from './delete-transaction-dialog';

interface TransactionActionsProps {
  transaction: TransactionContract;
}

const TransactionRowActions: React.FC<TransactionActionsProps> = ({transaction}) => {
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);

  return (
    <>
      <Button
        variant="ghost"
        title="Izmeni transakciju"
        size="icon"
        aria-label="Izmeni transakciju"
        onClick={() => setIsEditOpen(true)}
      >
        <Pencil className="size-4" />
        <span className="sr-only">Izmeni transakciju</span>
      </Button>

      <Button
        variant="ghost"
        className="text-red-500 hover:text-red-500"
        title="Obriši transakciju"
        size="icon"
        aria-label="Obriši transakciju"
        onClick={() => setIsDeleteOpen(true)}
      >
        <Trash2 className="size-4" />
        <span className="sr-only">Obriši transakciju</span>
      </Button>

      <EditTransactionDialog transaction={transaction} open={isEditOpen} onOpenChange={setIsEditOpen} />
      <DeleteTransactionDialog transaction={transaction} open={isDeleteOpen} onOpenChange={setIsDeleteOpen} />
    </>
  );
};

export default TransactionRowActions;
