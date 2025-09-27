import React from 'react';
import {useSetupContext} from '../hooks/use-setup';
import {CheckIcon} from 'lucide-react';
import {cn} from '@/lib/utils';
import {Button} from '@/components/ui/button';

const steps = [
  {
    id: 1,
    title: 'User Profile',
    description: 'Create your account',
  },
  {
    id: 2,
    title: 'Household Setup',
    description: 'Set up your household',
  },
];

const Stepper = () => {
  const {currentStep, setCurrentStep, userData} = useSetupContext();
  const hasCompletedStep1 = Boolean(userData);

  const handleStepClick = (stepId: number) => {
    setCurrentStep(stepId);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <Button
                onClick={() => handleStepClick(step.id)}
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 hover:scale-105',
                  'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                  currentStep === step.id && 'bg-primary text-primary-foreground shadow-md',
                  currentStep > step.id && 'bg-primary text-primary-foreground',
                  currentStep < step.id && 'bg-muted text-muted-foreground hover:bg-muted/80',
                )}
                disabled={!hasCompletedStep1 && step.id === 2}
              >
                {currentStep > step.id ? <CheckIcon className="w-5 h-5" /> : <span>{step.id}</span>}
              </Button>

              <div className="mt-2 text-center">
                <p
                  className={cn(
                    'text-xs font-medium',
                    currentStep === step.id ? 'text-primary' : 'text-muted-foreground',
                  )}
                >
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
              </div>
            </div>

            {index < steps.length - 1 && (
              <div className="flex-1 mx-4 mb-8">
                <div
                  className={cn(
                    'h-0.5 transition-colors duration-200',
                    currentStep > step.id ? 'bg-primary' : 'bg-border',
                  )}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stepper;
