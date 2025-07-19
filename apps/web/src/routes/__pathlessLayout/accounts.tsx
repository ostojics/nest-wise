import {createFileRoute} from '@tanstack/react-router';

export const Route = createFileRoute('/__pathlessLayout/accounts')({
  component: Accounts,
});

function Accounts() {
  return <div className="p-2">Hello from Accounts!</div>;
}
