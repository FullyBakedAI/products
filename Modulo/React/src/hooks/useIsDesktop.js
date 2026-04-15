import { useState, useEffect, useRef } from 'react';

const QUERY = '(min-width: 1024px)';

export function useIsDesktop() {
  const mqRef = useRef(window.matchMedia(QUERY));
  const [isDesktop, setIsDesktop] = useState(mqRef.current.matches);

  useEffect(() => {
    const mq = mqRef.current;
    const handler = e => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return isDesktop;
}
