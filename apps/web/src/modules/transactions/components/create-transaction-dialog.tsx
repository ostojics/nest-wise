import {Checkbox} from '@/components/ui/checkbox';
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {Label} from '@/components/ui/label';
import {ManualTransactionForm} from './manual-transaction-form';
import {useMutationState} from '@tanstack/react-query';
import {mutationKeys} from '@/modules/api/mutation-keys';
import {AiTransactionCreation} from '../ai-transaction-creation/ai-transaction-creation';
import {DialogTrigger} from '@radix-ui/react-dialog';
import {Button} from '@/components/ui/button';
import {IconReceipt} from '@tabler/icons-react';
import {useCreateTransactionDialog} from './create-transaction-dialog.context';

export function CreateTransactionDialog() {
  const {isOpen, setIsOpen, isManualMode, setIsManualMode} = useCreateTransactionDialog();
  const statuses = useMutationState({
    filters: {mutationKey: mutationKeys.transactions.createAiTransactionSuggestion()},
    select: (mutation) => mutation.state.status,
  });
  const latestStatus = statuses.at(-1);

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
          {!isManualMode && (
            <p className="text-sm text-muted-foreground text-balance">
              Samo opišite transakciju, AI će uraditi ostalo.
            </p>
          )}
        </DialogHeader>
        <DialogDescription className="hidden">Kreiraj transakciju</DialogDescription>
        <div className="flex items-center space-x-2 pb-4">
          <Checkbox
            disabled={latestStatus === 'pending' || latestStatus === 'success'}
            id="manual-mode"
            checked={isManualMode}
            onCheckedChange={(checked) => setIsManualMode(checked === true)}
          />
          <Label htmlFor="manual-mode" className="text-sm text-muted-foreground">
            Ručni unos
          </Label>
        </div>
        <div className="overflow-y-auto flex-1 -mx-6 px-6">
          {isManualMode ? <ManualTransactionForm /> : <AiTransactionCreation />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
