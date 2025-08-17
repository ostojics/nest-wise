import UsersListSkeleton from './users-list.skeleton';
import UsersListError from './users-list.error';
import {useGetUsers} from '../hooks/use-get-users';
import UserCard from './user-card';

const UsersList = () => {
  const {data: users, isLoading, isError, refetch, isFetching} = useGetUsers();

  if (isLoading) {
    return <UsersListSkeleton />;
  }

  if (isError) {
    return <UsersListError onRetry={() => refetch()} disabled={isFetching} />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {users?.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
};

export default UsersList;
