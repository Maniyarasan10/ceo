import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollToEl } from '../lenisStore';
import { prefersReducedMotion } from '../state';

gsap.registerPlugin(ScrollTrigger);

let refs = null;
let busy = false;

export function registerTransition(r) { refs = r; return () => { refs = null; }; }

function replayEnter(target) {
  const chars = target.querySelectorAll('[data-enter] .char');
  if (!chars.length) return;
  gsap.fromTo(chars, { yPercent: 115 }, { yPercent: 0, duration: 0.9, stagger: 0.015, ease: 'power4.out', overwrite: true });
}

/** Masked, staggered page transition between sections. */
export function navigateTo(id) {
  const target = document.getElementById(id);
  if (!target) return;
  if (prefersReducedMotion() || !refs) { scrollToEl(target, { immediate: true }); return; }
  if (busy) return;
  busy = true;
  const { root, cols, label } = refs;
  label.textContent = id;
  gsap.set(root, { autoAlpha: 1 });
  gsap.timeline({ onComplete: () => { busy = false; gsap.set(root, { autoAlpha: 0 }); } })
    .set(cols, { scaleY: 0, transformOrigin: '50% 100%' })
    .to(cols, { scaleY: 1, duration: 0.45, ease: 'power4.inOut', stagger: { each: 0.045, from: 'center' } })
    .fromTo(label, { yPercent: 110 }, { yPercent: 0, duration: 0.4, ease: 'power3.out' }, '-=0.25')
    .add(() => { scrollToEl(target, { immediate: true }); ScrollTrigger.update(); })
    .set(cols, { transformOrigin: '50% 0%' })
    .to(label, { yPercent: -110, duration: 0.35, ease: 'power3.in' }, '+=0.05')
    .to(cols, { scaleY: 0, duration: 0.5, ease: 'power4.inOut', stagger: { each: 0.045, from: 'edges' } }, '<0.1')
    .add(() => replayEnter(target), '-=0.35');
}
