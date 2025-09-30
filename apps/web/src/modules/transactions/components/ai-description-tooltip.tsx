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
            Opišite transakciju jednostavnim rečima. Naš AI će automatski prepoznati iznos, kategoriju i ostale detalje.
          </p>
          <p className="text-xs text-muted mt-2">
            <strong>Primer:</strong> "Juče sam potrošio/la 3000 RSD u Lidlu"
          </p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
