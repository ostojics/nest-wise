import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {useGetHouseholdAccounts} from '@/modules/accounts/hooks/useGetHouseholdAccounts';
import {useGetMe} from '@/modules/auth/hooks/useGetMe';
import {useGetHouseholdById} from '@/modules/households/hooks/useGetHouseholdById';
import {useCreateTransaction} from '@/modules/transactions/hooks/useCreateTransaction';
import {accountTypes} from '@/common/constants/account-types';
import {useValidateCreateTransaction} from '@maya-vault/validation';

interface AiTransactionFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function AiTransactionForm({onSuccess, onCancel}: AiTransactionFormProps) {
  const {data: me} = useGetMe();
  const {data: household} = useGetHouseholdById(me?.householdId ?? '');
  const {data: accounts} = useGetHouseholdAccounts(household?.id ?? '');

  const createTransactionMutation = useCreateTransaction();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: {errors, isSubmitting},
  } = useValidateCreateTransaction({
    householdId: household?.id ?? '',
  });

  const onSubmit = async (data: Parameters<typeof createTransactionMutation.mutateAsync>[0]) => {
    try {
      await createTransactionMutation.mutateAsync(data);
      reset();
      onSuccess();
    } catch {
      // Error is handled by the mutation
    }
  };

  const getAccountDisplayName = (accountId: string) => {
    const account = accounts?.find((acc) => acc.id === accountId);
    if (!account) return '';

    const accountType = accountTypes.find((type) => type.value === account.type);
    return `${account.name} (${accountType?.label ?? account.type})`;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Account Selection */}
      <div className="space-y-2">
        <Label htmlFor="accountId">
          Account <span className="text-red-500">*</span>
        </Label>
        <Select value={watch('accountId')} onValueChange={(value) => setValue('accountId', value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select account" />
          </SelectTrigger>
          <SelectContent>
            {accounts?.map((account) => (
              <SelectItem key={account.id} value={account.id}>
                {getAccountDisplayName(account.id)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.accountId && <p className="text-sm text-red-500">{errors.accountId.message}</p>}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">
          What did you spend on? <span className="text-red-500">*</span>
        </Label>
        <Input placeholder="e.g., Coffee at Starbucks, Grocery shopping, Gas for car..." {...register('description')} />
        {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
      </div>

      {/* Amount */}
      <div className="space-y-2">
        <Label htmlFor="amount">
          Amount <span className="text-red-500">*</span>
        </Label>
        <Input type="number" step="0.01" min="0.01" placeholder="0.00" {...register('amount')} />
        {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || createTransactionMutation.isPending}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700"
        >
          {isSubmitting || createTransactionMutation.isPending ? 'Processing...' : 'Log Transaction'}
        </Button>
      </div>
    </form>
  );
}
