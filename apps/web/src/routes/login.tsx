import LoginPage from '@/modules/auth/components/login-form';
import {createFileRoute} from '@tanstack/react-router';

export const Route = createFileRoute('/login')({
  component: () => (
    <section className="flex items-center justify-center h-screen w-screen">
      <LoginPage />
    </section>
  ),
});
