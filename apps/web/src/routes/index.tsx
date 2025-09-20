import {createFileRoute, redirect} from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: () => <></>,
  beforeLoad: ({context}) => {
    if (!context.isAuthenticated) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({to: '/login'});
    }

    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw redirect({to: '/plan'});
  },
});
