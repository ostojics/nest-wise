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
import {Brain, Sparkles} from 'lucide-react';
import {useState, useEffect} from 'react';

interface AiTransactionFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function AiTransactionForm({onSuccess, onCancel}: AiTransactionFormProps) {
  const [isListening, setIsListening] = useState(true);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setIsListening((prev) => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const onSubmit = async (data: Parameters<typeof createTransactionMutation.mutateAsync>[0]) => {
    await createTransactionMutation.mutateAsync(data);
    reset();
    onSuccess();
  };

  const getAccountDisplayName = (accountId: string) => {
    const account = accounts?.find((acc) => acc.id === accountId);
    if (!account) return '';

    const accountType = accountTypes.find((type) => type.value === account.type);
    return `${account.name} (${accountType?.label ?? account.type})`;
  };

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-teal-500/10 border border-blue-200/20 p-4">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 animate-pulse" />

        <div className="relative flex items-center gap-3">
          <div className="relative">
            <div
              className={`w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center transition-all duration-1000 ${isListening ? 'scale-110 shadow-lg shadow-blue-500/30' : 'scale-100'}`}
            >
              <Brain className="w-5 h-5 text-white" />
            </div>

            {isListening && (
              <>
                <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
                <div className="absolute inset-[-4px] rounded-full bg-purple-500/10 animate-ping animation-delay-200" />
              </>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Maya AI Assistant
              </span>
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse animation-delay-100" />
                <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse animation-delay-200" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">I'm ready to help you log your transaction...</p>
          </div>

          <div className="text-blue-500">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
        </div>
      </div>

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
          <Input
            placeholder="e.g., Coffee at Starbucks, Grocery shopping, Gas for car..."
            {...register('description')}
          />
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
    </div>
  );
}
