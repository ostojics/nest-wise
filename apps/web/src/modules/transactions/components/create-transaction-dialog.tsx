import {Checkbox} from '@/components/ui/checkbox';
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {Label} from '@/components/ui/label';
import {AiTransactionForm} from './ai-transaction-form';
import {ManualTransactionForm} from './manual-transaction-form';
import {useState} from 'react';

interface CreateTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTransactionDialog({open, onOpenChange}: CreateTransactionDialogProps) {
  const [isManualMode, setIsManualMode] = useState(false);

  const handleSuccess = () => {
    setIsManualMode(false);
    onOpenChange(false);
  };

  const handleCancel = () => {
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
        <div className="overflow-y-auto flex-1 -mx-6 px-6">
          {isManualMode ? (
            <ManualTransactionForm onSuccess={handleSuccess} onCancel={handleCancel} />
          ) : (
            <AiTransactionForm onSuccess={handleSuccess} onCancel={handleCancel} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
