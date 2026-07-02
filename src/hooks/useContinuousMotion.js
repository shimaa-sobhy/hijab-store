import { useRef, useEffect } from 'react';

export default function useContinuousMotion(config = {}) {
  const ref = useRef(null);
  const cfgRef = useRef(config);
  cfgRef.current = config;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    const { delay = 0, floatY = {}, driftX = {}, breathe = {}, rotate = {} } = cfgRef.current;
    const startTime = performance.now() + delay * 1000;
    let rafId;

    function tick(now) {
      const elapsed = now - startTime;
      if (elapsed < 0) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      const t = elapsed / 1000;
      const yOff = (floatY.amp || 0) * Math.sin(2 * Math.PI * t / (floatY.period || 1));
      const xOff = (driftX.amp || 0) * Math.sin(2 * Math.PI * t / (driftX.period || 1));
      const bMin = breathe.min ?? 1;
      const bMax = breathe.max ?? 1;
      const scale = bMin + (bMax - bMin) * (0.5 + 0.5 * Math.sin(2 * Math.PI * t / (breathe.period || 1)));
      const rot = (rotate.amp || 0) * Math.sin(2 * Math.PI * t / (rotate.period || 1));

      el.style.transform = `translate3d(${xOff}px, ${yOff}px, 0) scale(${scale}) rotate(${rot}deg)`;
      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return ref;
}
