import UsersListSkeleton from './users-list.skeleton';
import UsersListError from './users-list.error';
import {useGetHouseholdUsers} from '../hooks/use-get-users';
import UserCard from './user-card';
import InviteUserDialog from './invite-user-dialog';

const UsersList = () => {
  const {data: users, isLoading, isError, refetch, isFetching} = useGetHouseholdUsers();

  if (isLoading) {
    return <UsersListSkeleton />;
  }

  if (isError) {
    return <UsersListError onRetry={() => refetch()} disabled={isFetching} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-start">
        <InviteUserDialog />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {users?.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default UsersList;
