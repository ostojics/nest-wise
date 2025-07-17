import {useSetupContext} from '../hooks/useSetup';
import Step1 from './step-1';
import Step2 from './step-2';

const SetupPage = () => {
  const {currentStep} = useSetupContext();

  return (
    <section className="flex items-center justify-center h-screen">
      {currentStep === 1 && <Step1 />}
      {currentStep === 2 && <Step2 />}
    </section>
  );
};

export default SetupPage;
