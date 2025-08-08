import {useMemo, useState} from 'react';
import {ChevronsUpDown} from 'lucide-react';
import {AccountContract} from '@maya-vault/contracts';

import {Button} from '@/components/ui/button';
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from '@/components/ui/command';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {cn} from '@/lib/utils';

interface AccountComboboxProps {
  accounts: AccountContract[];
  className?: string;
}

const AccountCombobox: React.FC<AccountComboboxProps> = ({accounts, className}) => {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedLabel = useMemo(() => {
    if (!selectedId) return undefined;
    const selected = accounts.find((a) => a.id === selectedId);
    return selected ? selected.name : undefined;
  }, [accounts, selectedId]);

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
          {selectedLabel ?? 'Select account'}
          <ChevronsUpDown className="ml-2 size-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="end" sideOffset={10}>
        <Command>
          <CommandInput placeholder="Search accounts" />
          <CommandList>
            <CommandEmpty>No accounts found.</CommandEmpty>
            <CommandGroup>
              {accounts.map((account) => {
                return (
                  <CommandItem key={account.id} value={account.name} onSelect={() => handleSelect(account.id)}>
                    <span className="truncate">{account.name}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default AccountCombobox;
