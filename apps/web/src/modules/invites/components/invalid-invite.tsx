import {Card, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {AlertTriangle} from 'lucide-react';

const InvalidInvite = () => {
  return (
    <div className="flex w-full max-w-md flex-col p-4 md:max-w-xl">
      <Card>
        <CardHeader>
          <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <CardTitle>Invalid invite link</CardTitle>
          <CardDescription className="text-balance">
            This invite link is not valid. It may have expired, been used already, or the URL is incomplete.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

export default InvalidInvite;
