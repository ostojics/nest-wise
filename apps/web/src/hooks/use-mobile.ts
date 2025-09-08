import {useEffect, useState} from 'react';

const MOBILE_BREAKPOINT = 768;
export const TABLET_BREAKPOINT = 1024;

export function useIsMobile(breakpoint: number = MOBILE_BREAKPOINT) {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    mql.addEventListener('change', onChange);
    setIsMobile(window.innerWidth < breakpoint);
    return () => mql.removeEventListener('change', onChange);
  }, [breakpoint]);

  return !!isMobile;
}
