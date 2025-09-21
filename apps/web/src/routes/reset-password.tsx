import ResetPasswordForm from '@/modules/auth/components/reset-password-form';
import {resetPasswordQueryParamsSchema} from '@nest-wise/contracts';
import {createFileRoute} from '@tanstack/react-router';
import z from 'zod';

const pageParamsSchema = resetPasswordQueryParamsSchema.extend({
  token: z.string().catch(''),
});

export const Route = createFileRoute('/reset-password')({
  component: ResetPasswordPage,
  validateSearch: pageParamsSchema,
});

function ResetPasswordPage() {
  const search = Route.useSearch();

  if (!search.token) {
    return (
      <section className="flex items-center justify-center h-screen w-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Invalid Reset Link</h1>
          <p className="text-gray-600 mt-2">The password reset link is invalid or missing.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex items-center justify-center h-screen w-screen">
      <ResetPasswordForm token={search.token} />
    </section>
  );
}
