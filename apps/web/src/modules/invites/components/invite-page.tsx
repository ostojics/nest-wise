import {useSearch} from '@tanstack/react-router';
import AcceptInviteForm from './accept-invite-form';
import InvalidInvite from './invalid-invite';

const InvitesPage = () => {
  const search = useSearch({from: '/invites'});
  const isTokenPresent = Boolean(search.token);

  if (!isTokenPresent) {
    return (
      <section className="flex justify-center items-center mt-[9rem]">
        <InvalidInvite />
      </section>
    );
  }

  return (
    <section className="mx-auto mt-[6rem] flex w-full max-w-6xl flex-col items-center justify-center gap-10 p-0 md:p-6 text-center">
      <div className="flex max-w-2xl flex-col items-center gap-4">
        <h1 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
          Pozvani ste da se pridružite domaćinstvu {search.householdName}
        </h1>
        <p className="text-muted-foreground text-balance text-sm md:text-base">
          Kreirajte svoj nalog kako biste pristupili zajedničkim izveštajima, pratili troškove zajedno i održavali
          finansije domaćinstva organizovanim.
        </p>
      </div>
      <AcceptInviteForm />
    </section>
  );
};

export default InvitesPage;
