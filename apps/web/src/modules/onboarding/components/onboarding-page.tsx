import React, {useState} from 'react';
import {useNavigate} from '@tanstack/react-router';
import {Brain, Wallet, Target, Receipt} from 'lucide-react';
import Stepper from './stepper';
import StepCard from './step-card';

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const goToPlan = () => {
    void navigate({to: '/plan'});
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      goToPlan();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <StepCard
              icon={
                <div className="flex gap-4">
                  <Brain className="w-12 h-12 text-primary" />
                  <Wallet className="w-12 h-12 text-primary" />
                  <Target className="w-12 h-12 text-primary" />
                </div>
              }
              title="Dobro došli u NestWise!"
              description="Za 2 minuta: dodajte račun, napravite plan i zabeležite prvu transakciju. Možete preskočiti kad god."
              primaryAction={{
                label: 'Dalje',
                onClick: nextStep,
              }}
              secondaryAction={{
                label: 'Preskočite',
                onClick: goToPlan,
              }}
            />
          </>
        );

      case 2:
        return (
          <StepCard
            icon={<Wallet className="w-16 h-16 text-primary" />}
            title="Dodajte račun"
            description="Račun je mesto gde držite novac (tekući, štednja, kartica, keš). Dodajte bar jedan da bismo mogli da pratimo stanje."
            bullets={[
              {text: 'Otvorite stranicu računi'},
              {text: 'Kliknite „Dodaj račun"'},
              {text: 'Unesite naziv, tip i početno stanje'},
            ]}
            primaryAction={{
              label: 'Dalje',
              onClick: nextStep,
            }}
            secondaryAction={{
              label: 'Preskočite',
              onClick: goToPlan,
            }}
          />
        );

      case 3:
        return (
          <StepCard
            icon={<Target className="w-16 h-16 text-primary" />}
            title="Napravite plan"
            description="Kroz kategorije grupišete troškove, a budžeti vam pomažu da držite potrošnju pod kontrolom."
            bullets={[
              {
                text: 'Kategorije: Dodajte nekoliko kategorija (npr. Hrana, Transport, Režije).',
              },
              {
                text: 'Budžet: Postavite mesečne limite po kategorijama (npr. Hrana: 20.000 RSD).',
              },
            ]}
            primaryAction={{
              label: 'Dalje',
              onClick: nextStep,
            }}
            secondaryAction={{
              label: 'Preskočite',
              onClick: goToPlan,
            }}
          />
        );

      case 4:
        return (
          <StepCard
            icon={<Receipt className="w-16 h-16 text-primary" />}
            title="Zabeležite prvu transakciju"
            description="Transakcije mogu biti rashod ili prihod. Imate dva načina unosa:"
            bullets={[
              {
                text: 'Ručno unošenje - opis, iznos, račun, tip, datum; Ako je rashod → kategorija',
              },
              {
                icon: <Brain className="w-5 h-5 text-primary" />,
                text: 'AI asistent (brže); Samo opišite transakciju, AI će prepoznati iznos, kategoriju i datum.',
              },
            ]}
            primaryAction={{
              label: 'Završite i idite na plan',
              onClick: goToPlan,
            }}
            secondaryAction={{
              label: 'Preskočite',
              onClick: goToPlan,
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen py-8 px-4">
      <div className="w-full max-w-2xl mx-auto space-y-8">
        <Stepper currentStep={currentStep} totalSteps={4} />
        {renderStep()}
      </div>
    </section>
  );
};

export default OnboardingPage;
