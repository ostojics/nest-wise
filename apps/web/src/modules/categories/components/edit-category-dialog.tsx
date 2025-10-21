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
import {TextareaWithCounter} from '@/components/textarea-with-counter';
import FormError from '@/components/form-error';
import {UpdateCategoryDTO} from '@nest-wise/contracts';
import {Loader2} from 'lucide-react';
import {useState} from 'react';
import {useEditCategoryName} from '../hooks/use-edit-category-name';
import {useValidateEditCategory} from '../hooks/use-validate-edit-category';

interface EditCategoryDialogProps {
  categoryId: string;
  currentName: string;
  currentDescription?: string | null;
}

const EditCategoryDialog = ({categoryId, currentName, currentDescription}: EditCategoryDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: {errors},
    reset,
  } = useValidateEditCategory({defaultValues: {name: currentName, description: currentDescription ?? ''}});
  const mutation = useEditCategoryName();

  const handleEditCategory = async (data: UpdateCategoryDTO) => {
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
          Izmeni
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] flex flex-col">
        <DialogHeader className="mb-3">
          <DialogTitle>Izmenite kategoriju</DialogTitle>
          <DialogDescription>
            Promenite naziv ili opis ove kategorije. Ova izmena se primenjuje na sve povezane podatke.
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto flex-1 -mx-6 px-6">
          <form onSubmit={handleSubmit(handleEditCategory)}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-category-name">Naziv kategorije</Label>
                <Input id="edit-category-name" type="text" {...register('name')} />
                {errors.name?.message && <FormError error={errors.name.message} />}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-category-description">Opis (opciono)</Label>
                <TextareaWithCounter
                  id="edit-category-description"
                  placeholder="npr. Hrana i potrepštine iz supermarketa"
                  maxLength={500}
                  {...register('description')}
                />
                {errors.description?.message && <FormError error={errors.description.message} />}
                <p className="text-xs text-muted-foreground">
                  Opis transakcije će znatno poboljšati preciznost AI asistenta
                </p>
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditCategoryDialog;
