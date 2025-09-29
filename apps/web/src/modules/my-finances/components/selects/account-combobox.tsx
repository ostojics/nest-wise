import {useMemo, useState} from 'react';
import {ChevronsUpDown} from 'lucide-react';
import {AccountContract} from '@nest-wise/contracts';

import {Button} from '@/components/ui/button';
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from '@/components/ui/command';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {cn} from '@/lib/utils';
import {useNavigate, useSearch} from '@tanstack/react-router';

interface AccountComboboxProps {
  accounts: AccountContract[];
  className?: string;
}

const AccountCombobox: React.FC<AccountComboboxProps> = ({accounts, className}) => {
  const search = useSearch({from: '/__pathlessLayout/my-finances'});
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const selectedLabel = useMemo(() => {
    const selectedId = search.accountId;
    if (!selectedId) return null;

    const selected = accounts.find((a) => a.id === selectedId);
    return selected ? selected.name : null;
  }, [accounts, search.accountId]);

  const handleSelect = (id: string) => {
    void navigate({search: (prev) => ({...prev, accountId: id}), to: '/my-finances'});
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
          {selectedLabel ?? 'Izaberi račun'}
          <ChevronsUpDown className="ml-2 size-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="end" sideOffset={10}>
        <Command>
          <CommandInput placeholder="Pretraži račune" />
          <CommandList>
            <CommandEmpty>Nema pronađenih računa.</CommandEmpty>
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
