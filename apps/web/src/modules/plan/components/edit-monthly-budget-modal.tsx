import FormError from '@/components/form-error';
import {Button} from '@/components/ui/button';
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {useGetMe} from '@/modules/auth/hooks/useGetMe';
import {useFormatBalance} from '@/modules/formatting/hooks/useFormatBalance';
import {useGetHouseholdById} from '@/modules/households/hooks/useGetHouseholdById';
import {useUpdateHousehold} from '@/modules/households/hooks/useUpdateHousehold';
import {useValidateEditHousehold} from '@maya-vault/validation';
import {Loader2} from 'lucide-react';
import React, {useEffect} from 'react';

interface EditMonthlyBudgetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditMonthlyBudgetModal: React.FC<EditMonthlyBudgetModalProps> = ({open, onOpenChange}) => {
  const {formatBalance} = useFormatBalance();
  const {
    register,
    handleSubmit,
    reset,
    formState: {errors},
  } = useValidateEditHousehold();
  const {data} = useGetMe();
  const {data: household} = useGetHouseholdById(data?.householdId ?? '');

  const updateHouseholdMutation = useUpdateHousehold();

  useEffect(() => {
    if (open) {
      reset({monthlyBudget: household?.monthlyBudget});
    }
  }, [open, reset, household?.monthlyBudget]);

  const onSubmit = (data: {monthlyBudget?: number}) => {
    if (!data.monthlyBudget || !household?.id) return;

    updateHouseholdMutation.mutate(
      {
        id: household.id,
        data: {monthlyBudget: data.monthlyBudget},
      },
      {
        onSuccess: () => {
          reset();
        },
        onSettled: () => {
          onOpenChange(false);
        },
      },
    );
  };

  const handleCancel = () => {
    onOpenChange(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Monthly Budget</DialogTitle>
          <DialogDescription>
            Update your monthly budget target. <br /> Current: {formatBalance(household?.monthlyBudget ?? 0)}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="monthlyBudget">
              Monthly Budget <span className="text-red-500">*</span>
            </Label>
            <Input
              id="monthlyBudget"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              {...register('monthlyBudget', {valueAsNumber: true})}
            />
            {errors.monthlyBudget && <FormError error={errors.monthlyBudget.message ?? ''} />}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateHouseholdMutation.isPending}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700"
            >
              {updateHouseholdMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : 'Update Budget'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMonthlyBudgetModal;
