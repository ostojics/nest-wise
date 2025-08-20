import InvitesPage from '@/modules/invites/components/invite-page';
import {acceptInviteQueryParamsSchema} from '@maya-vault/contracts';
import {createFileRoute} from '@tanstack/react-router';
import z from 'zod';

const pageParamsSchema = acceptInviteQueryParamsSchema
  .pick({
    token: true,
    householdName: true,
  })
  .extend({
    token: z.string().catch(''),
    householdName: z.string().catch(''),
  });

export const Route = createFileRoute('/invites')({
  component: InvitesPage,
  validateSearch: pageParamsSchema,
});
