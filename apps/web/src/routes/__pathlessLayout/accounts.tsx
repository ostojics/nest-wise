import AccountsPage from '@/modules/accounts/components/accounts-page';
import {createFileRoute} from '@tanstack/react-router';

export const Route = createFileRoute('/__pathlessLayout/accounts')({
  component: AccountsPage,
});
