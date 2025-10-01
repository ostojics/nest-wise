import {useSetupContext} from '../hooks/use-setup';
import {useBeforeUnload} from '@/hooks/use-before-unload';
import Step1 from './step-1';
import Step2 from './step-2';
import Stepper from './stepper';

const SetupPage = () => {
  const {currentStep} = useSetupContext();
  useBeforeUnload(
    true,
    'Your setup is in progress. If you leave this page, your progress may be lost. Please use the link you received to resume.',
  );

  return (
    <section className="flex flex-col items-center justify-center h-screen">
      {currentStep === 1 && <Step1 />}
      {currentStep === 2 && <Step2 />}
      <div>
        <Stepper />
      </div>
    </section>
  );
};

export default SetupPage;
