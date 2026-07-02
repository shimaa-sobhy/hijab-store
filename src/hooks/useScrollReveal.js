import { useCallback, useEffect, useRef, useState } from 'react';

export default function useScrollReveal(options = {}) {
  const { threshold = 0.1, rootMargin = '0px' } = options;
  const [visible, setVisible] = useState(false);
  const [done, setDone] = useState(false);
  const observerRef = useRef(null);
  const timerRef = useRef(null);

  // Cleanup function for observer + timer
  const cleanup = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Callback ref — works with conditionally rendered elements
  const ref = useCallback(
    (node) => {
      // Cleanup previous observer when ref changes
      cleanup();

      if (!node || visible || done) return;

      // Synchronous above-the-fold check — reveal immediately on first paint
      const rect = node.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setVisible(true);
        return;
      }

      // Below the fold — observe with IntersectionObserver
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(true);
            timerRef.current = setTimeout(() => {
              setDone(true);
              observer.unobserve(node);
            }, 800);
          }
        },
        { threshold, rootMargin }
      );

      observer.observe(node);
      observerRef.current = observer;
    },
    [threshold, rootMargin, visible, done, cleanup]
  );

  // Cleanup on unmount
  useEffect(() => cleanup, [cleanup]);

  return [ref, visible, done];
}
