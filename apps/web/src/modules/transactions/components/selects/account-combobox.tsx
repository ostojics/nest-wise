import {useMemo, useState} from 'react';
import {ChevronsUpDown} from 'lucide-react';
import {AccountContract} from '@maya-vault/contracts';

import {Button} from '@/components/ui/button';
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from '@/components/ui/command';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {cn} from '@/lib/utils';
import {accountTypes} from '@/common/constants/account-types';

interface AccountComboboxProps {
  accounts: AccountContract[];
  placeholder?: string;
  className?: string;
}

const AccountCombobox: React.FC<AccountComboboxProps> = ({accounts, placeholder = 'Select account', className}) => {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const typeValueToLabel = useMemo(() => {
    const map = new Map<string, string>();
    accountTypes.forEach((t) => map.set(t.value, t.label));
    return map;
  }, []);

  const selectedLabel = useMemo(() => {
    if (!selectedId) return undefined;
    const selected = accounts?.find((a) => a.id === selectedId);
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
          className={cn('h-9 w-44 justify-between', className)}
        >
          {selectedLabel ?? placeholder}
          <ChevronsUpDown className="ml-2 size-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0">
        <Command>
          <CommandInput placeholder="Search accounts" />
          <CommandList>
            <CommandEmpty>No accounts found.</CommandEmpty>
            <CommandGroup heading="Accounts">
              {accounts?.map((account) => {
                const typeLabel = typeValueToLabel.get(account.type) ?? account.type;
                const keywords = [account.name, account.type, typeLabel].filter(Boolean) as string[];
                return (
                  <CommandItem key={account.id} value={account.id} keywords={keywords} onSelect={handleSelect}>
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
