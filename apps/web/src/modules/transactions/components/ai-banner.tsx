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
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-teal-500/10 border border-blue-200/20 p-4">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 animate-pulse" />

      <div className="relative flex items-center gap-3">
        <div className="relative">
          <div
            className={`w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center transition-all duration-1000 ${isListening ? 'scale-110 shadow-lg shadow-blue-500/30' : 'scale-100'}`}
          >
            <Brain className="w-5 h-5 text-white" />
          </div>

          {isListening && (
            <>
              <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
              <div className="absolute inset-[-4px] rounded-full bg-purple-500/10 animate-ping animation-delay-200" />
            </>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              NestWise Assistant
            </span>
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
              <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse animation-delay-100" />
              <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse animation-delay-200" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">I'm ready to help you log your transaction...</p>
        </div>
      </div>
    </div>
  );
};

export default AiBanner;
