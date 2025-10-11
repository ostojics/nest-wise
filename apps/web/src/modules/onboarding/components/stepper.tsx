import React from 'react';
import {CheckIcon} from 'lucide-react';
import {cn} from '@/lib/utils';

interface StepperProps {
  currentStep: number;
  totalSteps: number;
}

const Stepper = ({currentStep, totalSteps}: StepperProps) => {
  const steps = Array.from({length: totalSteps}, (_, i) => i + 1);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200',
                  currentStep === step && 'bg-primary text-primary-foreground shadow-md',
                  currentStep > step && 'bg-primary text-primary-foreground',
                  currentStep < step && 'bg-muted text-muted-foreground',
                )}
              >
                {currentStep > step ? <CheckIcon className="w-5 h-5" /> : <span>{step}</span>}
              </div>

              <div className="mt-2 text-center">
                <p
                  className={cn('text-xs font-medium', currentStep === step ? 'text-primary' : 'text-muted-foreground')}
                >
                  Корак {step}
                </p>
              </div>
            </div>

            {index < steps.length - 1 && (
              <div className="flex-1 mx-2 mb-8">
                <div
                  className={cn(
                    'h-0.5 transition-colors duration-200',
                    currentStep > step ? 'bg-primary' : 'bg-border',
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
