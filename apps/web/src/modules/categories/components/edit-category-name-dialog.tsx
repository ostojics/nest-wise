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
import FormError from '@/components/form-error';
import {UpdateCategoryDTO} from '@nest-wise/contracts';
import {Loader2} from 'lucide-react';
import {useState} from 'react';
import {useEditCategoryName} from '../hooks/use-edit-category-name';
import {useValidateEditCategory} from '../hooks/use-validate-edit-category';

interface EditCategoryNameDialogProps {
  categoryId: string;
  currentName: string;
}

const EditCategoryNameDialog = ({categoryId, currentName}: EditCategoryNameDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: {errors},
    reset,
  } = useValidateEditCategory({defaultValues: {name: currentName}});
  const mutation = useEditCategoryName();

  const handleEditCategoryName = async (data: UpdateCategoryDTO) => {
    await mutation.mutateAsync(
      {id: categoryId, dto: data},
      {
        onSettled: () => {
          setIsOpen(false);
        },
      },
    );
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
        <Button size="sm" variant="outline">
          Preimenuj
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] flex flex-col">
        <DialogHeader className="mb-3">
          <DialogTitle>Preimenujte kategoriju</DialogTitle>
          <DialogDescription>
            Promenite naziv ove kategorije. Ova izmena se primenjuje na sve povezane podatke.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleEditCategoryName)}>
          <div className="overflow-y-auto flex-1 -mx-6 px-6">
            <div className="flex items-center gap-3">
              <div className="flex flex-col gap-2 flex-1">
                <Label htmlFor="edit-category-name">Naziv kategorije</Label>
                <Input id="edit-category-name" type="text" {...register('name')} />
                {errors.name?.message && <FormError error={errors.name.message} />}
              </div>
            </div>
          </div>
          <DialogFooter className="mt-10">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={mutation.isPending}>
                Otkaži
              </Button>
            </DialogClose>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? <Loader2 className="size-4 animate-spin" /> : 'Sačuvaj'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCategoryNameDialog;
