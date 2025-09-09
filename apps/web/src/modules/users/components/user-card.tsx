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
    <Card className="@container/user-card hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <div className="flex flex-col items-start gap-3 @lg/user-card:gap-0 @lg/user-card:flex-row  justify-between">
          <div>
            <CardTitle className="text-md font-semibold max-w-[18.75rem] break-all">{user.username}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground max-w-[13.75rem] break-all">
              {user.email}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Joined at</span>
            <Badge variant="outline" className="text-xs whitespace-nowrap">
              {joinedOn}
            </Badge>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default UserCard;
