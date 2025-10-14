import {Checkbox} from '@/components/ui/checkbox';
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {Label} from '@/components/ui/label';
import {ManualTransactionForm} from './manual-transaction-form';
import {useState} from 'react';
import {useMutationState} from '@tanstack/react-query';
import {mutationKeys} from '@/modules/api/mutation-keys';
import {CreateTransactionDialogProvider} from './create-transaction-dialog.context';
import {AiTransactionCreation} from '../ai-transaction-creation';

interface CreateTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTransactionDialog({open, onOpenChange}: CreateTransactionDialogProps) {
  const [isManualMode, setIsManualMode] = useState(false);
  const pendingStatuses = useMutationState({
    filters: {mutationKey: mutationKeys.transactions.createAiTransaction()},
    select: (mutation) => mutation.state.status === 'pending',
  });
  const isLatestPending = pendingStatuses.at(-1) ?? false;

  const handleSuccess = () => {
    setIsManualMode(false);
    onOpenChange(false);
  };

  const handleClose = () => {
    setIsManualMode(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Zabeleži transakciju</DialogTitle>
          {!isManualMode && (
            <p className="text-sm text-muted-foreground text-balance">
              Samo opišite transakciju, AI će uraditi ostalo.
            </p>
          )}
        </DialogHeader>
        <DialogDescription className="hidden">Kreiraj transakciju</DialogDescription>
        <CreateTransactionDialogProvider
          isManual={isManualMode}
          setManual={setIsManualMode}
          onClose={handleClose}
          onSuccess={handleSuccess}
        >
          {!isLatestPending && (
            <div className="flex items-center space-x-2 pb-4">
              <Checkbox
                id="manual-mode"
                checked={isManualMode}
                onCheckedChange={(checked) => setIsManualMode(checked === true)}
              />
              <Label htmlFor="manual-mode" className="text-sm text-muted-foreground">
                Ručni unos
              </Label>
            </div>
          )}
          <div className="overflow-y-auto flex-1 -mx-6 px-6">
            {isManualMode ? <ManualTransactionForm /> : <AiTransactionCreation />}
          </div>
        </CreateTransactionDialogProvider>
      </DialogContent>
    </Dialog>
  );
}
