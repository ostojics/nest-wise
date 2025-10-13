import {useEffect} from 'react';

/**
 * Registers a beforeunload listener to warn users before leaving the page.
 * @param enabled Whether the listener should be active.
 * @param message The message to display in the confirmation dialog.
 */
export function useBeforeUnload(enabled: boolean, message?: string) {
  useEffect(() => {
    if (!enabled) return;

    const handler = (e: BeforeUnloadEvent) => {
      // Modern browsers require setting returnValue to trigger the prompt
      e.preventDefault();
      return message ?? '';
    };

    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [enabled, message]);
}
