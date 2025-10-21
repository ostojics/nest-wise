import * as React from 'react';
import {Textarea} from '@/components/ui/textarea';

export interface TextareaWithCounterProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxLength: number;
  valueLength: number;
}

const TextareaWithCounter = React.forwardRef<HTMLTextAreaElement, TextareaWithCounterProps>(
  ({maxLength, className, valueLength, ...props}, ref) => {
    const remaining = maxLength - valueLength;

    return (
      <div className="space-y-1">
        <Textarea ref={ref} className={className} maxLength={maxLength} {...props} />
        <div className="text-xs text-muted-foreground text-right">
          {remaining} {remaining === 1 ? 'karakter preostao' : 'karaktera preostalo'}
        </div>
      </div>
    );
  },
);

TextareaWithCounter.displayName = 'TextareaWithCounter';

export {TextareaWithCounter};
