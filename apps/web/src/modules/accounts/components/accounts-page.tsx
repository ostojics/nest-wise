import {Button} from '@/components/ui/button';
import {IconPlus} from '@tabler/icons-react';

const AccountsPage = () => {
  return (
    <section className="p-4">
      <div className="flex items-center justify-between">
        <Button>
          <IconPlus />
          Add Account
        </Button>
      </div>
    </section>
  );
};

export default AccountsPage;
