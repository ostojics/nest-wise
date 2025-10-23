import UsersPage from '@/modules/users/components/users-page';
import {createFileRoute} from '@tanstack/react-router';

export const Route = createFileRoute('/__pathlessLayout/members')({
  component: UsersPage,
});
