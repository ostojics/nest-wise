import {lazy} from 'react';
import {createFileRoute} from '@tanstack/react-router';

const AccountsPage = lazy(() => import('@/modules/accounts/components/accounts-page'));

export const Route = createFileRoute('/__pathlessLayout/accounts')({
  component: AccountsPage,
});
