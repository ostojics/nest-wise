import OnboardingPage from '@/modules/onboarding/components/onboarding-page';
import {createFileRoute} from '@tanstack/react-router';

export const Route = createFileRoute('/onboarding')({
  component: OnboardingPage,
});
