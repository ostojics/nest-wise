import LoginPage from '@/modules/auth/components/login-form';
import {createFileRoute} from '@tanstack/react-router';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});
