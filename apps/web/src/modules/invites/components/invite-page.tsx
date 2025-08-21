import {useSearch} from '@tanstack/react-router';
import AcceptInviteForm from './accept-invite-form';

const InvitesPage = () => {
  const search = useSearch({from: '/invites'});

  return (
    <section className="mx-auto mt-[6rem] flex w-full max-w-6xl flex-col items-center justify-center gap-10 p-0 md:p-6 text-center">
      <div className="flex max-w-2xl flex-col items-center gap-4">
        <h1 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
          You&apos;re invited to join the {search.householdName} household
        </h1>
        <p className="text-muted-foreground text-balance text-sm md:text-base">
          Create your account to access shared budgets, track expenses together, and keep your household&apos;s finances
          organized.
        </p>
      </div>
      <AcceptInviteForm />
    </section>
  );
};

export default InvitesPage;
