import {Brain} from 'lucide-react';
import {useEffect, useState} from 'react';

interface AiProcessingStatusProps {
  message?: string;
}

export function AiProcessingStatus({
  message = 'Analiziram opis i kreiram transakciju. Ovo može potrajati nekoliko sekundi...',
}: AiProcessingStatusProps) {
  const [isPulsing, setIsPulsing] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsPulsing((prev) => !prev);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-chart-3/10 via-primary/10 to-chart-3/5 border border-chart-3/20 p-6">
      <div className="absolute inset-0 bg-gradient-to-r from-chart-3/5 to-primary/5 animate-pulse" />

      <div className="relative flex flex-col items-center gap-4 text-center">
        <div className="relative">
          <div
            className={`w-16 h-16 rounded-full bg-gradient-to-br from-chart-3 to-primary flex items-center justify-center transition-all duration-1000`}
          >
            <Brain className="w-8 h-8 text-white" />
          </div>

          {isPulsing && (
            <>
              <div className="absolute inset-0 rounded-full bg-chart-3/20 animate-ping" />
              <div className="absolute inset-[-4px] rounded-full bg-primary/10 animate-ping animation-delay-200" />
            </>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="text-base font-medium bg-gradient-to-r from-chart-3 to-primary bg-clip-text text-transparent">
              Obrada u toku
            </span>
          </div>
          <p className="text-sm text-muted-foreground max-w-md text-balance">{message}</p>
        </div>
      </div>
    </div>
  );
}
