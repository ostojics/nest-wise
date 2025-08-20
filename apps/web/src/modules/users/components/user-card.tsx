import React from 'react';
import {UserContract} from '@maya-vault/contracts';
import {Card, CardHeader, CardTitle, CardDescription} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {format} from 'date-fns';

interface UserCardProps {
  user: UserContract;
}

const UserCard: React.FC<UserCardProps> = ({user}) => {
  const joinedOn = format(new Date(user.createdAt), 'MMM dd, yyyy');

  return (
    <Card className="@container/card hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <div className="flex flex-col items-start gap-3 md:gap-0 md:flex-row md:items-center justify-between">
          <div>
            <CardTitle className="text-md font-semibold">{user.username}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">{user.email}</CardDescription>
          </div>
          <Badge variant="outline" className="text-xs">
            {joinedOn}
          </Badge>
        </div>
      </CardHeader>
    </Card>
  );
};

export default UserCard;
