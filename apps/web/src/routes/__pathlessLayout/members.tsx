import {lazy} from 'react';
import {createFileRoute} from '@tanstack/react-router';

const UsersPage = lazy(() => import('@/modules/users/components/users-page'));

export const Route = createFileRoute('/__pathlessLayout/members')({
  component: UsersPage,
});
