import {Button} from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {useDeleteCategory} from '@/modules/categories/hooks/use-delete-category';
import {Loader2, Trash2} from 'lucide-react';
import React from 'react';

interface DeleteCategoryDialogProps {
  categoryId: string;
  categoryName: string;
}

const DeleteCategoryDialog: React.FC<DeleteCategoryDialogProps> = ({categoryId, categoryName}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const deleteMutation = useDeleteCategory();

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(categoryId, {
      onSettled: () => setIsOpen(false),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="text-red-500 hover:text-red-500"
          title="Obriši kategoriju"
          size="icon"
          aria-label="Obriši kategoriju"
        >
          {deleteMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
          <span className="sr-only">Obriši kategoriju</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] flex flex-col">
        <DialogHeader className="mb-3">
          <DialogTitle>Obriši kategoriju</DialogTitle>
          <DialogDescription>
            Da li ste sigurni da želite da obrišete kategoriju &quot;{categoryName}&quot;?
            <br />
            Svi budžeti za ovu kategoriju će biti uklonjeni i sve povezane transakcije će postati nekategorisane.
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto flex-1 -mx-6 px-6">
          <div className="space-y-4">
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)} disabled={deleteMutation.isPending}>
                Otkaži
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
                {deleteMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : 'Obriši'}
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteCategoryDialog;
