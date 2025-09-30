import {useMemo, useState} from 'react';
import {AccountContract} from '@nest-wise/contracts';
import {Button} from '@/components/ui/button';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from '@/components/ui/command';
import {ChevronsUpDown} from 'lucide-react';
import {cn} from '@/lib/utils';

interface AccountSelectProps {
  accounts: AccountContract[];
  value?: string;
  onChange: (accountId: string) => void;
  placeholder?: string; // pass Serbian from callers where needed
  className?: string;
  excludeId?: string;
}

const AccountSelect: React.FC<AccountSelectProps> = ({
  accounts,
  value,
  onChange,
  placeholder,
  className,
  excludeId,
}) => {
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!excludeId) return accounts;

    return accounts.filter((a) => a.id !== excludeId);
  }, [accounts, excludeId]);

  const selectedLabel = useMemo(() => {
    if (!value) return null;

    const selected = accounts.find((a) => a.id === value);
    return selected ? selected.name : null;
  }, [accounts, value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('h-9 min-w-50 justify-between', className)}
        >
          {selectedLabel ?? placeholder ?? 'Izaberite račun'}
          <ChevronsUpDown className="ml-2 size-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end" sideOffset={10}>
        <Command>
          <CommandInput placeholder="Pretražite račune" />
          <CommandList>
            <CommandEmpty>Nema pronađenih računa.</CommandEmpty>
            <CommandGroup>
              {filtered.map((account) => {
                return (
                  <CommandItem
                    key={account.id}
                    value={account.name}
                    onSelect={() => {
                      onChange(account.id);
                      setOpen(false);
                    }}
                  >
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

export default AccountSelect;
