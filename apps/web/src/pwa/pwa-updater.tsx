import {useRegisterSW} from 'virtual:pwa-register/react';
import {toast} from 'sonner';
import {RefreshCw} from 'lucide-react';
import {useEffect} from 'react';

export const PwaUpdater = () => {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  useEffect(() => {
    if (needRefresh) {
      toast('New version available!', {
        description: 'A new version of NestWise is available. Click to update now.',
        duration: Infinity, // Don't auto-dismiss
        action: {
          label: (
            <div className="flex items-center gap-2">
              <RefreshCw className="size-3" />
              Update
            </div>
          ),
          onClick: () => {
            void updateServiceWorker(true);
            setNeedRefresh(false);
          },
        },
        onDismiss: () => {
          setNeedRefresh(false);
        },
      });
    }
  }, [needRefresh, updateServiceWorker, setNeedRefresh]);

  // This component doesn't render anything visible
  return null;
};
