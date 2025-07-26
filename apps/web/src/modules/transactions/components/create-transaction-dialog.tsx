import {Button} from '@/components/ui/button';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {useGetHouseholdAccounts} from '@/modules/accounts/hooks/useGetHouseholdAccounts';
import {useGetMe} from '@/modules/auth/hooks/useGetMe';
import {useCreateCategory} from '@/modules/categories/hooks/useCreateCategory';
import {useGetHouseholdCategories} from '@/modules/categories/hooks/useGetHouseholdCategories';
import {useGetHouseholdById} from '@/modules/households/hooks/useGetHouseholdById';
import {useCreateTransaction} from '@/modules/transactions/hooks/useCreateTransaction';
import {accountTypes} from '@/common/constants/account-types';
import {useValidateCreateTransaction} from '@maya-vault/validation';
import {Plus} from 'lucide-react';
import {useState} from 'react';

interface CreateTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTransactionDialog({open, onOpenChange}: CreateTransactionDialogProps) {
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const {data: me} = useGetMe();
  const {data: household} = useGetHouseholdById(me?.householdId ?? '');
  const {data: accounts} = useGetHouseholdAccounts(household?.id ?? '');
  const {data: categories} = useGetHouseholdCategories(household?.id ?? '');

  const createTransactionMutation = useCreateTransaction();
  const createCategoryMutation = useCreateCategory();

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

  const watchedCategoryId = watch('categoryId');

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim() || !household?.id) return;

    try {
      const newCategory = await createCategoryMutation.mutateAsync({
        name: newCategoryName.trim(),
        householdId: household.id,
      });
      setValue('categoryId', newCategory.id);
      setNewCategoryName('');
      setShowCreateCategory(false);
    } catch {
      // Error is handled by the mutation
    }
  };

  const onSubmit = async (data: Parameters<typeof createTransactionMutation.mutateAsync>[0]) => {
    try {
      await createTransactionMutation.mutateAsync(data);
      reset();
      onOpenChange(false);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Log Transaction</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="accountId">Account</Label>
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

          <div className="space-y-2">
            <Label htmlFor="categoryId">Category</Label>
            {showCreateCategory ? (
              <div className="flex gap-2">
                <Input
                  placeholder="Enter category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      void handleCreateCategory();
                    }
                    if (e.key === 'Escape') {
                      setShowCreateCategory(false);
                      setNewCategoryName('');
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => void handleCreateCategory()}
                  disabled={!newCategoryName.trim() || createCategoryMutation.isPending}
                >
                  Create
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCreateCategory(false);
                    setNewCategoryName('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Select value={watchedCategoryId} onValueChange={(value) => setValue('categoryId', value)}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories && categories.length > 0 ? (
                      categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">
                        No categories available. Create one using the + button.
                      </div>
                    )}
                  </SelectContent>
                </Select>
                <Button type="button" variant="outline" size="icon" onClick={() => setShowCreateCategory(true)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
            {errors.categoryId && <p className="text-sm text-red-500">{errors.categoryId.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={watch('type')} onValueChange={(value) => setValue('type', value as 'income' | 'expense')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="income">Income</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input type="number" step="0.01" min="0.01" placeholder="0.00" {...register('amount')} />
            {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input placeholder="Transaction description (optional)" {...register('description')} />
            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || createTransactionMutation.isPending}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700"
            >
              {isSubmitting || createTransactionMutation.isPending ? 'Creating...' : 'Create Transaction'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
