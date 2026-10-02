import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { setLenis } from '../lenisStore';
import { state, prefersReducedMotion } from '../state';

gsap.registerPlugin(ScrollTrigger);

export default function useLenis() {
  useEffect(() => {
    if (prefersReducedMotion()) return undefined; // native scrolling
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    setLenis(lenis);
    lenis.stop(); // released by the loader
    lenis.on('scroll', (e) => { ScrollTrigger.update(); state.scrollVel = e.velocity; });
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);
}
