import EmailChangeConfirmation from '@/modules/users/components/email-change-confirmation';
import {createFileRoute} from '@tanstack/react-router';
import z from 'zod';

const emailChangeQueryParamsSchema = z.object({
  token: z.string().catch(''),
});

export const Route = createFileRoute('/email-change')({
  component: EmailChangePage,
  validateSearch: emailChangeQueryParamsSchema,
});

function EmailChangePage() {
  const search = Route.useSearch();

  return <EmailChangeConfirmation token={search.token} />;
}
