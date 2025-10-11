import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {cn} from '@/lib/utils';
import React from 'react';

interface BulletPoint {
  icon?: React.ReactNode;
  text: string;
}

interface StepCardProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  bullets?: BulletPoint[];
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const StepCard = ({icon, title, description, bullets, primaryAction, secondaryAction, className}: StepCardProps) => {
  return (
    <Card className={cn('w-full max-w-2xl', className)}>
      <CardHeader>
        {icon && <div className="flex justify-center mb-4">{icon}</div>}
        <CardTitle className="text-center text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {description && <p className="text-center text-muted-foreground">{description}</p>}

        {bullets && bullets.length > 0 && (
          <div className="space-y-3">
            {bullets.map((bullet, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                {bullet.icon && <div className="mt-0.5 flex-shrink-0">{bullet.icon}</div>}
                <p className="text-sm">{bullet.text}</p>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          {primaryAction && (
            <Button onClick={primaryAction.onClick} className="flex-1">
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <Button onClick={secondaryAction.onClick} variant="outline" className="flex-1">
              {secondaryAction.label}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StepCard;
