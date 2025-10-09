import {Brain, Loader2} from 'lucide-react';
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
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-200/20 p-6">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 animate-pulse" />

      <div className="relative flex flex-col items-center gap-4 text-center">
        <div className="relative">
          <div
            className={`w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center transition-all duration-1000 ${isPulsing ? 'scale-110 shadow-lg shadow-emerald-500/30' : 'scale-100'}`}
          >
            <Brain className="w-8 h-8 text-white" />
          </div>

          {isPulsing && (
            <>
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
              <div className="absolute inset-[-4px] rounded-full bg-teal-500/10 animate-ping animation-delay-200" />
            </>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="text-base font-medium bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              NestWise Asistent radi
            </span>
            <Loader2 className="size-4 animate-spin text-emerald-600" />
          </div>
          <p className="text-sm text-muted-foreground max-w-md">{message}</p>
        </div>
      </div>
    </div>
  );
}
