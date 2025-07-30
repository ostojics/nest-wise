import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip';
import {HelpCircle} from 'lucide-react';

export function AiDescriptionTooltip() {
  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>
        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help hover:text-foreground transition-colors" />
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        <div className="space-y-1">
          <p className="text-xs leading-relaxed">
            Describe your transaction in plain English. Our AI will automatically extract the amount, category, and
            other details.
          </p>
          <p className="text-xs text-muted mt-2">
            <strong>Example:</strong> "Paid $45 for lunch at McDonald's yesterday"
          </p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
