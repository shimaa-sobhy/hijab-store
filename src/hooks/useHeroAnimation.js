import { useEffect, useRef } from 'react';

export default function useHeroAnimation() {
  const bgRef = useRef(null);

  useEffect(() => {
    const bg = bgRef.current;
    if (!bg) return;

    const isMobile = window.innerWidth < 768;
    const fps = isMobile ? 30 : 60;
    const interval = 1000 / fps;
    const LOAD_MS = 1400;
    let startTime = null;
    let lastFrame = null;
    let rafId = null;

    bg.style.opacity = '0';

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      if (lastFrame === null) lastFrame = timestamp;
      const elapsed = timestamp - lastFrame;

      if (elapsed >= interval) {
        lastFrame = timestamp - (elapsed % interval);
        const tSec = (timestamp - startTime) / 1000;
        const tMs = timestamp - startTime;

        // Initial load: fade in + dramatic zoom settle (1.2x → 1x over 2.2s)
        const raw = Math.min(1, tMs / LOAD_MS);
        const load = 1 - Math.pow(1 - raw, 3);
        const settleZoom = 1 + 0.2 * (1 - load);

        // Continuous Ken Burns (≈9s cycle)
        const kenZoom = 1 + Math.sin(tSec * 0.7) * (isMobile ? 0.03 : 0.08);
        const combined = settleZoom + (kenZoom - 1) * load;

        // Floating & parallax (fade in during load)
        const floatX = isMobile ? 0 : Math.sin(tSec * 0.25) * 0.6;
        const floatY = isMobile ? 0 : Math.cos(tSec * 0.35) * 0.5;
        const parallax = window.scrollY * 0.12;
        const moveFactor = Math.min(1, raw * 2.5);

        bg.style.transform = `translate3d(${floatX * moveFactor}%, ${(floatY - parallax) * moveFactor}px, 0) scale(${combined})`;
        bg.style.opacity = String(Math.min(1, raw * 2.5));

        // Brightness breathing + subtle contrast
        const breathe = 1 + Math.sin(tSec * 0.5) * (isMobile ? 0.03 : 0.06) * load;
        bg.style.filter = `brightness(${breathe}) contrast(1.025)`;
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafId);
  }, []);

  return bgRef;
}
