import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { state } from '../state';

gsap.registerPlugin(ScrollTrigger);

/** Horizontal, pinned project track (desktop, motion allowed). */
export function initHorizontalProjects(root, onProgress) {
  const mm = gsap.matchMedia();
  mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
    const pin = root.querySelector('.projects__pin');
    const track = root.querySelector('.projects__track');
    const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
    const tween = gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: pin, pin: true, scrub: 0.6, start: 'top top', anticipatePin: 1,
        end: () => `+=${dist()}`, invalidateOnRefresh: true,
        onUpdate: (self) => onProgress(self.progress),
      },
    });
    root.querySelectorAll('.pcard__visual').forEach((v) => {
      gsap.fromTo(v, { xPercent: -7 }, {
        xPercent: 7, ease: 'none',
        scrollTrigger: { trigger: v.closest('.pcard'), containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
      });
    });
  });
  return () => mm.revert();
}

/** Velocity-based skew on [data-vfx] elements. Cheap: one ticker, only when moving. */
export function initVelocityFx() {
  const items = [...document.querySelectorAll('[data-vfx]')].map((el) => ({
    el, axis: el.dataset.vfx === 'x' ? 'skewX' : 'skewY', set: gsap.quickSetter(el, el.dataset.vfx === 'x' ? 'skewX' : 'skewY', 'deg'), cur: 0,
  }));
  const grain = document.querySelector('.grain');
  let boost = 0;
  const tick = () => {
    const target = gsap.utils.clamp(-5, 5, state.scrollVel * 0.12);
    boost += (Math.min(1, Math.abs(state.scrollVel) / 40) - boost) * 0.1;
    if (grain) grain.style.opacity = String(0.07 + boost * 0.08);
    items.forEach((it) => {
      const t = it.axis === 'skewX' ? -target : target;
      it.cur += (t - it.cur) * 0.12;
      if (Math.abs(it.cur) > 0.01 || Math.abs(t) > 0.01) it.set(it.cur);
    });
  };
  gsap.ticker.add(tick);
  return () => { gsap.ticker.remove(tick); items.forEach((it) => it.set(0)); };
}
