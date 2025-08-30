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
import {useValidateEditCategoryBudget} from '../hooks/use-validate-edit-category-budget';
import {Label} from '@/components/ui/label';
import FormError from '@/components/form-error';
import {EditCategoryBudgetDTO} from '@maya-vault/contracts';
import {useEditCategoryBudget} from '../hooks/use-edit-category-budget';
import {useState} from 'react';
import {Loader2} from 'lucide-react';

interface EditCategoryBudgetDialogProps {
  plannedAmount: number;
  categoryBudgetId: string;
  enableTrigger?: boolean;
}

const EditCategoryBudgetDialog = ({
  plannedAmount,
  enableTrigger = true,
  categoryBudgetId,
}: EditCategoryBudgetDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useValidateEditCategoryBudget({defaultValues: {plannedAmount}});
  const mutation = useEditCategoryBudget();

  const handleEditCategoryBudget = async (data: EditCategoryBudgetDTO) => {
    await mutation.mutateAsync(
      {id: categoryBudgetId, dto: data},
      {
        onSettled: () => {
          setIsOpen(false);
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" disabled={!enableTrigger}>
          Assign
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="mb-3">
          <DialogTitle>Assign planned amount</DialogTitle>
          <DialogDescription>Set how much you plan to spend for this category in the selected month.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleEditCategoryBudget)}>
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-account-name">Planned amount</Label>
              <Input
                id="edit-planned-amount"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                {...register('plannedAmount', {required: true})}
              />
              {errors.plannedAmount?.message && <FormError error={errors.plannedAmount.message} />}
            </div>
          </div>
          <DialogFooter className="mt-10">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={mutation.isPending}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? <Loader2 className="size-4 animate-spin" /> : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCategoryBudgetDialog;
