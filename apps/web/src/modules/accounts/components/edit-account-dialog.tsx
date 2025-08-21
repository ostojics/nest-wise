import {accountTypes} from '@/common/constants/account-types';
import {Button} from '@/components/ui/button';
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {AccountContract} from '@maya-vault/contracts';
import {DialogTrigger} from '@radix-ui/react-dialog';
import {Pencil} from 'lucide-react';
import React from 'react';

interface EditAccountDialogProps {
  account: AccountContract;
}

const EditAccountDialog: React.FC<EditAccountDialogProps> = ({account}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [name, setName] = React.useState(account.name);
  const [type, setType] = React.useState<string>(account.type);
  const [currentBalance, setCurrentBalance] = React.useState<string>(String(account.currentBalance));

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" title="Edit account" size="icon" aria-label="Edit account">
            <Pencil className="size-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Account</DialogTitle>
          </DialogHeader>
          <form>
            <div className="flex flex-col gap-6 py-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-account-name">Name</Label>
                <Input id="edit-account-name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-account-type">Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger id="edit-account-type" className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {accountTypes.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-account-balance">Current Balance</Label>
                <Input
                  id="edit-account-balance"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  value={currentBalance}
                  onChange={(e) => setCurrentBalance(e.target.value)}
                />
              </div>
            </div>
          </form>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditAccountDialog;
