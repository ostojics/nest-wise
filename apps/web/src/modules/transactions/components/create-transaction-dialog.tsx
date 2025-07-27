import {Checkbox} from '@/components/ui/checkbox';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from '@/components/ui/dialog';
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Log Transaction</DialogTitle>
          {!isManualMode && (
            <p className="text-sm text-muted-foreground">Just describe the transaction - AI will handle the rest!</p>
          )}
        </DialogHeader>

        <div className="flex items-center space-x-2 pb-4">
          <Checkbox
            id="manual-mode"
            checked={isManualMode}
            onCheckedChange={(checked) => setIsManualMode(checked === true)}
          />
          <Label htmlFor="manual-mode" className="text-sm text-muted-foreground">
            Manual input
          </Label>
        </div>

        {isManualMode ? (
          <ManualTransactionForm onSuccess={handleSuccess} onCancel={handleCancel} />
        ) : (
          <AiTransactionForm onSuccess={handleSuccess} onCancel={handleCancel} />
        )}
      </DialogContent>
    </Dialog>
  );
}
