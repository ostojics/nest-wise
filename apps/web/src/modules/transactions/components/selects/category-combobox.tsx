import {useMemo, useState} from 'react';
import {ChevronsUpDown} from 'lucide-react';
import {CategoryContract} from '@maya-vault/contracts';

import {Button} from '@/components/ui/button';
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from '@/components/ui/command';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {cn} from '@/lib/utils';

interface CategoryComboboxProps {
  categories: CategoryContract[];
  className?: string;
}

const CategoryCombobox: React.FC<CategoryComboboxProps> = ({categories, className}) => {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedLabel = useMemo(() => {
    if (!selectedId) return undefined;

    const selected = categories.find((c) => c.id === selectedId);
    return selected ? selected.name : undefined;
  }, [categories, selectedId]);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('h-9 min-w-50 justify-between', className)}
        >
          {selectedLabel ?? 'Select category'}
          <ChevronsUpDown className="ml-2 size-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="end" sideOffset={10}>
        <Command>
          <CommandInput placeholder="Search categories" />
          <CommandList>
            <CommandEmpty>No categories found.</CommandEmpty>
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
