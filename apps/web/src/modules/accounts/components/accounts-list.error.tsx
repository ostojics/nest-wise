import {Button} from '@/components/ui/button';

interface AccountsListErrorProps {
  onRetry: () => void;
}

const AccountsListError = ({onRetry}: AccountsListErrorProps) => {
  return (
    <div className="mt-6 flex flex-col items-center justify-center py-12">
      <div className="text-center space-y-3">
        <h3 className="text-lg font-semibold text-foreground">Something went wrong</h3>
        <p className="text-sm text-muted-foreground">We couldn't load your accounts. Please try again.</p>
        <div className="pt-2">
          <Button onClick={onRetry}>Retry</Button>
        </div>
      </div>
    </div>
  );
};

export default AccountsListError;
