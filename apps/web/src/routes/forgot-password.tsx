import ForgotPasswordForm from '@/modules/auth/components/forgot-password-form';
import {createFileRoute} from '@tanstack/react-router';

export const Route = createFileRoute('/forgot-password')({
  component: () => (
    <section className="flex items-center justify-center h-screen w-screen">
      <ForgotPasswordForm />
    </section>
  ),
});
