import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitText } from '../utils/split';
import { prefersReducedMotion } from '../state';

gsap.registerPlugin(ScrollTrigger);

/** Scroll-triggered mask reveal for every [data-reveal] heading inside `ref`. */
export default function useReveal(ref) {
  useLayoutEffect(() => {
    if (!ref.current || prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      ref.current.querySelectorAll('[data-reveal]').forEach((el) => {
        const { chars } = splitText(el);
        el.setAttribute('data-enter', '');
        gsap.set(chars, { yPercent: 115 });
        ScrollTrigger.create({
          trigger: el, start: 'top 88%', once: true,
          onEnter: () => gsap.to(chars, { yPercent: 0, duration: 1, ease: 'power4.out', stagger: 0.025, overwrite: true }),
        });
      });
    }, ref);
    return () => ctx.revert();
  }, [ref]);
}
