import React, {useState} from 'react';
import {useNavigate} from '@tanstack/react-router';
import {Brain, Wallet, Target, Receipt} from 'lucide-react';
import Stepper from './stepper';
import StepCard from './step-card';
import TextBanner from '@/components/text-banner';
import {Button} from '@/components/ui/button';

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const goToPlan = () => {
    void navigate({to: '/plan'});
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <TextBanner
              text="Добро дошли у NestWise! За 2 минута бићете спремни: додајте рачун, направите план и забележите прву трансакцију."
              className="max-w-2xl"
            />
            <StepCard
              icon={
                <div className="flex gap-4">
                  <Brain className="w-12 h-12 text-primary" />
                  <Wallet className="w-12 h-12 text-primary" />
                  <Target className="w-12 h-12 text-primary" />
                </div>
              }
              title="Добро дошли у NestWise!"
              description="За 2 минута: додајте рачун, направите план и забележите прву трансакцију. Можете прескочити кад год."
              primaryAction={{
                label: 'Крени даље',
                onClick: nextStep,
              }}
              secondaryAction={{
                label: 'Прескочи',
                onClick: goToPlan,
              }}
            />
          </>
        );

      case 2:
        return (
          <StepCard
            icon={<Wallet className="w-16 h-16 text-primary" />}
            title="Додајте рачун"
            description="Рачун је место где држите новац (текући, штедња, картица, кеш). Додајте бар један да бисмо могли да пратимо стање."
            bullets={[
              {text: 'Отворите страницу Рачуни'},
              {text: 'Кликните „Додај рачун"'},
              {text: 'Унесите назив, тип и почетно стање'},
            ]}
            primaryAction={{
              label: 'Отвори „Рачуни"',
              onClick: () => {
                void navigate({to: '/accounts'});
              },
            }}
            secondaryAction={{
              label: 'Даље',
              onClick: nextStep,
            }}
          />
        );

      case 3:
        return (
          <StepCard
            icon={<Target className="w-16 h-16 text-primary" />}
            title="Направите план"
            description="Кроз категорије групишете трошкове, а буџети вам помажу да држите потрошњу под контролом."
            bullets={[
              {
                text: 'Категорије — Додајте неколико категорија (нпр. Храна, Транспорт, Режије).',
              },
              {
                text: 'Буџети — Поставите месечне лимите по категоријама (нпр. Храна: 30.000 РСД).',
              },
            ]}
            primaryAction={{
              label: 'Отвори „План"',
              onClick: () => {
                void navigate({to: '/plan'});
              },
            }}
            secondaryAction={{
              label: 'Даље',
              onClick: nextStep,
            }}
          />
        );

      case 4:
        return (
          <StepCard
            icon={<Receipt className="w-16 h-16 text-primary" />}
            title="Забележите прву трансакцију"
            description="Трансакције могу бити Рашод или Приход. Имате два начина уноса:"
            bullets={[
              {
                text: 'Ручно уношење — Опис, Износ, Рачун, Тип, Датум; ако је Рашод → Категорија',
              },
              {
                icon: <Brain className="w-5 h-5 text-primary" />,
                text: 'AI асистент (брже) — Само опишите трансакцију, AI ће препознати износ, категорију и датум — Ви потврдите.',
              },
            ]}
            primaryAction={{
              label: 'Отвори „Трансакције"',
              onClick: () => {
                void navigate({to: '/transactions'});
              },
            }}
            secondaryAction={{
              label: 'Заврши и иди на план',
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
      <div className="w-full max-w-4xl space-y-8">
        <Stepper currentStep={currentStep} totalSteps={4} />
        {renderStep()}
        <div className="flex justify-center pt-4">
          <Button variant="ghost" onClick={goToPlan} className="text-muted-foreground">
            Прескочи
          </Button>
        </div>
      </div>
    </section>
  );
};

export default OnboardingPage;
