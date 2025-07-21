import {useGetMe} from '@/modules/auth/hooks/useGetMe';
import {useGetHouseholdById} from '@/modules/households/hooks/useGetHouseholdById';
import {useValidateCreateAccount, CreateAccountDTO} from '@maya-vault/validation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import FormError from '@/components/form-error';
import {Loader2, PlusIcon, Wallet, CreditCard, PiggyBank, TrendingUp, Banknote, Package} from 'lucide-react';
import {useState} from 'react';

interface CreateAccountProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const accountTypes = [
  {value: 'checking', label: 'Checking Account', icon: Wallet, description: 'Daily transactions and expenses'},
  {value: 'savings', label: 'Savings Account', icon: PiggyBank, description: 'Long-term savings and goals'},
  {value: 'credit_card', label: 'Credit Card', icon: CreditCard, description: 'Credit purchases and balances'},
  {value: 'investment', label: 'Investment Account', icon: TrendingUp, description: 'Stocks, bonds, and investments'},
  {value: 'cash', label: 'Cash', icon: Banknote, description: 'Physical cash and petty cash'},
  {value: 'other', label: 'Other', icon: Package, description: 'Custom account type'},
];

const CreateAccount = ({open, onOpenChange}: CreateAccountProps) => {
  const {data} = useGetMe();
  const {data: household} = useGetHouseholdById(data?.householdId ?? '');
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: {errors},
  } = useValidateCreateAccount({householdId: household?.id ?? '', ownerId: data?.id ?? ''});

  const selectedType = watch('type');

  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    } else {
      setIsOpen(newOpen);
    }

    if (!newOpen) {
      reset();
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (_data: CreateAccountDTO) => {
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      handleOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTypeChange = (value: string) => {
    setValue('type', value as CreateAccountDTO['type']);
  };

  const selectedAccountType = accountTypes.find((type) => type.value === selectedType);
  const isDialogOpen = open ?? isOpen;

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="w-4 h-4" />
          Add Account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Create New Account
          </DialogTitle>
          <DialogDescription className="text-left">
            Add a new financial account to track your money across different sources and goals.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="name" className="text-sm font-medium">
              Account Name
            </Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="e.g., Chase Checking, Emergency Fund"
              className="w-full"
            />
            {errors.name && <FormError error={errors.name.message ?? 'Invalid account name'} />}
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Account Type</Label>
            <Select value={selectedType} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                {accountTypes.map((type) => {
                  return (
                    <SelectItem key={type.value} value={type.value} className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col">
                          <span className="font-medium">{type.label}</span>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {errors.type && <FormError error={errors.type.message ?? ''} />}
          </div>

          {selectedAccountType && (
            <div className="p-3 bg-muted/50 rounded-lg border">
              <div className="flex items-center gap-2">
                <selectedAccountType.icon className="w-4 h-4 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{selectedAccountType.label}</p>
                  <p className="text-xs text-muted-foreground">{selectedAccountType.description}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Label htmlFor="initialBalance" className="text-sm font-medium">
              Initial Balance
            </Label>
            <div className="relative">
              <Input
                id="initialBalance"
                type="number"
                step="0.01"
                min="0"
                {...register('initialBalance')}
                placeholder="0.00"
              />
            </div>
            {errors.initialBalance && <FormError error={errors.initialBalance.message ?? ''} />}
            <p className="text-xs text-muted-foreground">
              Enter the current balance of this account. You can update this later.
            </p>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !selectedType}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>Create Account</>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAccount;
