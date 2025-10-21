import * as React from 'react';
import {Textarea} from '@/components/ui/textarea';

export interface TextareaWithCounterProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxLength: number;
}

const TextareaWithCounter = React.forwardRef<HTMLTextAreaElement, TextareaWithCounterProps>(
  ({maxLength, className, ...props}, ref) => {
    const [currentLength, setCurrentLength] = React.useState(0);

    // Update length when value changes
    React.useEffect(() => {
      if (props.value !== undefined) {
        const valueStr = typeof props.value === 'string' ? props.value : String(props.value);
        setCurrentLength(valueStr.length);
      }
    }, [props.value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCurrentLength(e.target.value.length);
      props.onChange?.(e);
    };

    const remaining = maxLength - currentLength;

    return (
      <div className="space-y-1">
        <Textarea ref={ref} className={className} maxLength={maxLength} onChange={handleChange} {...props} />
        <div className="text-xs text-muted-foreground text-right">
          {remaining} {remaining === 1 ? 'karakter preostao' : 'karaktera preostalo'}
        </div>
      </div>
    );
  },
);

TextareaWithCounter.displayName = 'TextareaWithCounter';

export {TextareaWithCounter};
