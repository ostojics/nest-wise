import {Brain} from 'lucide-react';
import {useEffect, useState} from 'react';

const AiBanner = () => {
  const [isListening, setIsListening] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsListening((prev) => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-accent/10 to-chart-3/5 border border-primary/20 p-4">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-chart-3/5 animate-pulse" />

      <div className="relative flex items-center gap-3">
        <div className="relative">
          <div
            className={`w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center transition-all duration-1000`}
          >
            <Brain className="w-5 h-5 text-white" />
          </div>
          {isListening && (
            <>
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
              <div className="absolute inset-[-4px] rounded-full bg-accent/10 animate-ping animation-delay-200" />
            </>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium">NestWise Asistent</span>
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-chart-2 rounded-full animate-pulse" />
              <div className="w-1 h-1 bg-chart-2 rounded-full animate-pulse animation-delay-100" />
              <div className="w-1 h-1 bg-chart-2 rounded-full animate-pulse animation-delay-200" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Spreman sam da vam pomognem da zabeležite transakciju...</p>
        </div>
      </div>
    </div>
  );
};

export default AiBanner;
