import {Checkbox} from '@/components/ui/checkbox';
import {Label} from '@/components/ui/label';
import {useCreateTransactionDialog} from '@/contexts/create-transaction-dialog-context';

export function TransactionModeToggle() {
  const {isManualMode, setIsManualMode} = useCreateTransactionDialog();

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="manual-mode"
        checked={isManualMode}
        onCheckedChange={(checked) => setIsManualMode(checked === true)}
      />
      <Label htmlFor="manual-mode" className="text-sm text-muted-foreground">
        Ručni unos
      </Label>
    </div>
  );
}
