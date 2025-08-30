import {useState} from 'react';

import {Button} from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';

interface EditCategoryBudgetDialogProps {
  initialValue: number;
}

const EditCategoryBudgetDialog = ({initialValue}: EditCategoryBudgetDialogProps) => {
  const [value, setValue] = useState<number>(initialValue);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit planned amount</DialogTitle>
          <DialogDescription>Set how much you plan to spend for this category in the selected month.</DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-3">
          <Input
            inputMode="decimal"
            type="number"
            min={0}
            value={Number.isNaN(value) ? '' : value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="max-w-[220px]"
          />
          <div className="text-muted-foreground text-sm">Planned amount</div>
        </div>
        <DialogFooter>
          <Button>Save</Button>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditCategoryBudgetDialog;
