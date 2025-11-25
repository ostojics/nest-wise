import {useMemo, useState} from 'react';
import {ChevronsUpDown} from 'lucide-react';
import {CategoryContract} from '@nest-wise/contracts';

import {Button} from '@/components/ui/button';
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from '@/components/ui/command';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {cn} from '@/lib/utils';
import {useNavigate, useSearch} from '@tanstack/react-router';

interface CategoryComboboxProps {
  categories: CategoryContract[];
  className?: string;
}

const CategoryCombobox: React.FC<CategoryComboboxProps> = ({categories, className}) => {
  const [open, setOpen] = useState(false);
  const search = useSearch({from: '/__pathlessLayout/transactions'});
  const navigate = useNavigate();

  const selectedLabel = useMemo(() => {
    const selectedId = search.categoryId;
    if (!selectedId) return null;

    const selected = categories.find((c) => c.id === selectedId);
    return selected ? selected.name : null;
  }, [categories, search.categoryId]);

  const handleSelect = (id: string) => {
    void navigate({search: (prev) => ({...prev, categoryId: id, page: 1}), to: '/transactions'});
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'h-9 justify-between bg-background/50 border-border/50 hover:bg-background hover:text-foreground font-normal text-muted-foreground',
            className,
          )}
        >
          <span className="truncate">{selectedLabel ?? 'Izaberi kategoriju'}</span>
          <ChevronsUpDown className="ml-2 size-4 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="end" sideOffset={10}>
        <Command>
          <CommandInput placeholder="Pretraži kategorije" />
          <CommandList>
            <CommandEmpty>Nema pronađenih kategorija.</CommandEmpty>
            <CommandGroup>
              {categories.map((category) => (
                <CommandItem key={category.id} value={category.id} keywords={[category.name]} onSelect={handleSelect}>
                  <span className="truncate">{category.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CategoryCombobox;
