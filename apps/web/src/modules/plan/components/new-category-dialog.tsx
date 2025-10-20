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
import {Textarea} from '@/components/ui/textarea';
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
        <Button size="sm">Nova kategorija</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] flex flex-col">
        <DialogHeader className="mb-3">
          <DialogTitle>Kreirajte kategoriju</DialogTitle>
          <DialogDescription className="text-balance">
            Dodajte kategoriju za planiranje i praćenje svojih troškova.
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto flex-1 -mx-6 px-6">
          <form onSubmit={handleSubmit(handleCreateCategory)}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="new-category-name">Naziv</Label>
                <Input id="new-category-name" placeholder="npr. Namirnice" {...register('name')} />
                {errors.name?.message && <FormError error={errors.name.message} />}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="new-category-description">Opis (opciono)</Label>
                <Textarea
                  id="new-category-description"
                  placeholder="npr. Hrana i potrepštine iz supermarketa"
                  maxLength={500}
                  {...register('description')}
                />
                {errors.description?.message && <FormError error={errors.description.message} />}
              </div>
            </div>
            <DialogFooter className="mt-10">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Otkažite
                </Button>
              </DialogClose>
              <Button type="submit">Kreirajte</Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewCategoryDialog;
