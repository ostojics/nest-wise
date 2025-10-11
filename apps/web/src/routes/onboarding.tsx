import OnboardingPage from '@/modules/onboarding/components/onboarding-page';
import {createFileRoute, redirect} from '@tanstack/react-router';

export const Route = createFileRoute('/onboarding')({
  component: OnboardingPage,
  beforeLoad: ({context}) => {
    if (!context.isAuthenticated) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({to: '/login'});
    }
  },
});
