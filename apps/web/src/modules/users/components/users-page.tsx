import UsersList from './users-list';
import TextBanner from '@/components/text-banner';

const UsersPage = () => {
  return (
    <section className="p-4 space-y-4">
      <TextBanner aria-label="Članovi" text="Upravljajte članovima vašeg domaćinstva i šaljite pozivnice." />
      <UsersList />
    </section>
  );
};

export default UsersPage;
