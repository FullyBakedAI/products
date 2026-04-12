import { useState, useEffect } from 'react';

export function useIsDesktop() {
  const mq = window.matchMedia('(min-width: 1024px)');
  const [isDesktop, setIsDesktop] = useState(mq.matches);
  useEffect(() => {
    const handler = e => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isDesktop;
}
