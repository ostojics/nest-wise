import {accountTypes} from '@/common/constants/account-types';
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
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {useGetMe} from '@/modules/auth/hooks/useGetMe';
import {useGetHouseholdById} from '@/modules/households/hooks/useGetHouseholdById';
import {CreateAccountDTO, useValidateCreateAccount} from '@maya-vault/validation';
import {Loader2, PlusIcon, Wallet} from 'lucide-react';
import {useState} from 'react';

const CreateAccount = () => {
  const {data} = useGetMe();
  const {data: household} = useGetHouseholdById(data?.householdId ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: {errors},
  } = useValidateCreateAccount({householdId: household?.id ?? '', ownerId: data?.id ?? ''});

  const onSubmit = async (_data: CreateAccountDTO) => {
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTypeChange = (value: string) => {
    setValue('type', value as CreateAccountDTO['type']);
  };

  const selectedType = watch('type');
  const selectedAccountType = accountTypes.find((type) => type.value === selectedType);

  return (
    <Dialog>
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
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={() => reset()} disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
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
