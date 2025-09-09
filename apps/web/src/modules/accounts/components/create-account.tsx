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
import {Loader2, PlusIcon, Wallet} from 'lucide-react';
import {useCreateAccountMutation} from '../hooks/useCreateAccountMutation';
import {useState} from 'react';
import SelectedAccountType from './selected-account-type';
import {useValidateCreateAccount} from '../hooks/use-validate-create-account';
import {CreateAccountDTO} from '@maya-vault/contracts';

const CreateAccount = () => {
  const {data} = useGetMe();
  const {data: household} = useGetHouseholdById(data?.householdId ?? '');
  const [isOpen, setIsOpen] = useState(false);
  const mutation = useCreateAccountMutation({
    closeDialog: () => setIsOpen(false),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: {errors},
  } = useValidateCreateAccount({householdId: household?.id ?? '', ownerId: data?.id ?? ''});

  const onSubmit = (data: CreateAccountDTO) => {
    mutation.mutate(data, {
      onSettled: () => {
        reset();
      },
    });
  };

  const handleTypeChange = (value: string) => {
    setValue('type', value as CreateAccountDTO['type']);
  };

  const handleVariantChange = (value: string) => {
    setValue('variant', value as CreateAccountDTO['variant']);
  };

  const selectedType = watch('type');
  const selectedVariant = watch('variant');

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
          <div className="space-y-3">
            <Label className="text-sm font-medium">Account Visibility</Label>
            <Select value={selectedVariant} onValueChange={handleVariantChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select visibility (shared or private)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="shared" className="cursor-pointer">
                  Shared
                </SelectItem>
                <SelectItem value="private" className="cursor-pointer">
                  Private
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.variant && <FormError error={errors.variant.message ?? ''} />}
          </div>
          <SelectedAccountType type={selectedType} />
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
              <Button type="button" variant="outline" disabled={mutation.isPending}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
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
