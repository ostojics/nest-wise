import FormError from '@/components/form-error';
import {Button} from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {TransferFundsDTO} from '@nest-wise/contracts';
import {ArrowLeftRight, Loader2, Wallet} from 'lucide-react';
import {useState} from 'react';
import {useTransferFundsMutation} from '../hooks/use-transfer-funds-mutation';
import {useValidateTransferFunds} from '../hooks/use-validate-transfer-funds';
import {useGetHouseholdAccounts} from '../hooks/useGetHouseholdAccounts';
import AccountSelect from './account-select';

const TransferFundsDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {data: accounts = []} = useGetHouseholdAccounts();
  const mutation = useTransferFundsMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: {errors},
  } = useValidateTransferFunds();

  const fromAccountId = watch('fromAccountId');
  const toAccountId = watch('toAccountId');

  const handleTransferFunds = async (data: TransferFundsDTO) => {
    await mutation.mutateAsync(data, {
      onSettled: () => {
        setIsOpen(false);
        reset();
      },
    });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          reset();
        }
        setIsOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <ArrowLeftRight className="w-4 h-4" />
          Transfer funds
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Transfer Funds
          </DialogTitle>
          <DialogDescription className="text-left">
            Move money between your accounts. Select the source and destination accounts and enter an amount.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleTransferFunds)} className="space-y-6">
          <div className="space-y-3">
            <Label className="text-sm font-medium">From account</Label>
            <AccountSelect
              accounts={accounts}
              value={fromAccountId}
              onChange={(id) => setValue('fromAccountId', id, {shouldValidate: true})}
              placeholder="Select source account"
              className="w-full"
              excludeId={toAccountId}
            />
            {errors.fromAccountId && <FormError error={errors.fromAccountId.message ?? ''} />}
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">To account</Label>
            <AccountSelect
              accounts={accounts}
              value={toAccountId}
              onChange={(id) => setValue('toAccountId', id, {shouldValidate: true})}
              placeholder="Select destination account"
              className="w-full"
              excludeId={fromAccountId}
            />
            {errors.toAccountId && <FormError error={errors.toAccountId.message ?? ''} />}
          </div>

          <div className="space-y-3">
            <Label htmlFor="amount" className="text-sm font-medium">
              Amount
            </Label>
            <div className="relative">
              <Input id="amount" type="number" step="0.01" placeholder="0.00" {...register('amount')} />
            </div>
            {errors.amount && <FormError error={errors.amount.message ?? ''} />}
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={mutation.isPending}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? <Loader2 className="size-4 animate-spin" /> : 'Transfer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransferFundsDialog;
