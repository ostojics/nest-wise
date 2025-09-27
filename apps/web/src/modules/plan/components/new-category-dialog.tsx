import FormError from '@/components/form-error';
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
import {Label} from '@/components/ui/label';
import {queryKeys} from '@/modules/api/query-keys';
import {useGetMe} from '@/modules/auth/hooks/use-get-me';
import {useValidateCreateCategory} from '@/modules/categories/hooks/use-validate-create-category';
import {useCreateCategory} from '@/modules/categories/hooks/use-create-category';
import {CreateCategoryDTO} from '@nest-wise/contracts';
import {useQueryClient} from '@tanstack/react-query';
import {useSearch} from '@tanstack/react-router';
import {useState} from 'react';

const NewCategoryDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {data: me} = useGetMe();
  const {
    register,
    handleSubmit,
    reset,
    formState: {errors},
  } = useValidateCreateCategory({householdId: me?.householdId ?? ''});
  const mutation = useCreateCategory(me?.householdId);
  const client = useQueryClient();
  const search = useSearch({from: '/__pathlessLayout/plan'});

  const handleCreateCategory = async (data: CreateCategoryDTO) => {
    await mutation.mutateAsync(data, {
      onSuccess: () => {
        void client.invalidateQueries({queryKey: queryKeys.categoryBudgets.all(search)});
      },
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
        <Button size="sm">New Category</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="mb-3">
          <DialogTitle>Create category</DialogTitle>
          <DialogDescription className="text-balance">
            Add a category to plan and track your spending.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleCreateCategory)}>
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-2 w-full">
              <Label htmlFor="new-category-name">Name</Label>
              <Input id="new-category-name" placeholder="e.g. Groceries" {...register('name')} />
              {errors.name?.message && <FormError error={errors.name.message} />}
            </div>
          </div>
          <DialogFooter className="mt-10">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewCategoryDialog;
