import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {ManualTransactionForm} from './manual-transaction-form';
import {AiTransactionCreation} from '../ai-transaction-creation/ai-transaction-creation';
import {DialogTrigger} from '@radix-ui/react-dialog';
import {Button} from '@/components/ui/button';
import {IconReceipt} from '@tabler/icons-react';
import {useCreateTransactionDialog} from '@/contexts/create-transaction-dialog-context';

export function CreateTransactionDialog() {
  const {isOpen, setIsOpen, isManualMode} = useCreateTransactionDialog();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg border-0 font-medium px-4 py-2"
        >
          <IconReceipt className="w-4 h-4" />
          <span>Zabeleži transakciju</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Zabeleži transakciju</DialogTitle>
        </DialogHeader>
        <DialogDescription className="hidden">Kreiraj transakciju</DialogDescription>
        <div className="overflow-y-auto flex-1 -mx-6 px-6">
          {isManualMode ? <ManualTransactionForm /> : <AiTransactionCreation />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
