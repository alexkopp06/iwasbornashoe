'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type LenisContextType = Lenis | null;

const LenisContext = createContext<LenisContextType>(null);

export function useLenis(): LenisContextType {
  return useContext(LenisContext);
}

interface SmoothScrollProps {
  children: React.ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {

    // Na dotykových zařízeních (telefony, tablety) je nativní scroll
    // plynulejší než Lenis. Lenis by konkuroval gesture recognizeru
    // prohlížeče a způsoboval sekání animací.
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const instance = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.8,
      infinite: false
    });

    lenisRef.current = instance;
    setLenis(instance);

    /* ─── PROPOJENÍ S SCROLLTRIGGER ─── */
    instance.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time: number) => {
      instance.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    /* ─── VISIBILITY HANDLER ─── */
    const onVisibility = () => {
      if (document.hidden) instance.stop();
      else instance.start();
    };

    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      instance.destroy();
      gsap.ticker.remove(instance.raf);
    };

  }, []);

  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  );
}
