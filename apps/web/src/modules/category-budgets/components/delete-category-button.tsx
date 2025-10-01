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

interface DeleteCategoryButtonProps {
  categoryId: string;
  categoryName: string;
  enableTrigger?: boolean;
}

const DeleteCategoryButton: React.FC<DeleteCategoryButtonProps> = ({
  categoryId,
  categoryName,
  enableTrigger = true,
}) => {
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
          disabled={!enableTrigger}
        >
          {deleteMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
          <span className="sr-only">Obriši kategoriju</span>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader className="mb-3">
          <DialogTitle>Obriši kategoriju</DialogTitle>
          <DialogDescription>
            Da li ste sigurni da želite da obrišete kategoriju &quot;{categoryName}&quot;? Svi budžeti za ovu kategoriju
            će biti uklonjeni i sve povezane transakcije će postati nekategorisane.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={deleteMutation.isPending}>
            Otkaži
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : 'Obriši'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteCategoryButton;
