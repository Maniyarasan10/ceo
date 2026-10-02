import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitText, clamp } from '../utils/split';
import { state } from '../state';

gsap.registerPlugin(ScrollTrigger);

/** Prepare hero text (split + hidden) before first paint. */
export function prepareHero(root) {
  const lines = [...root.querySelectorAll('[data-hero-line]')];
  const chars = lines.flatMap((l) => splitText(l).chars);
  gsap.set(chars, { yPercent: 115 });
  gsap.set(root.querySelectorAll('[data-hero-fade]'), { autoAlpha: 0, y: 24 });
  gsap.set(root.querySelector('.hero__bg'), { autoAlpha: 0 });
  gsap.set(root.querySelector('.hero__cue-line'), { scaleY: 0 });
  return chars;
}

/** The cinematic hero entrance, played once the loader leaves. */
export function playHeroIntro(root, chars) {
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
  tl.to(root.querySelector('.hero__bg'), { autoAlpha: 1, duration: 1.1, ease: 'power2.out' }, 0)
    .to(chars, { yPercent: 0, duration: 1.15, stagger: { each: 0.035, from: 'start' } }, 0.1)
    .to(root.querySelectorAll('[data-hero-fade]'), { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.09 }, 0.75)
    .to(root.querySelector('.hero__cue-line'), { scaleY: 1, duration: 1, transformOrigin: 'top' }, 1.1);
  return tl;
}

/** Scroll-linked hero depth (kept gentle). */
export function heroScroll(root) {
  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.to(root.querySelector('.hero__title'), {
      yPercent: -14, ease: 'none',
      scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true },
    });
    gsap.to(root.querySelector('.hero__bg'), {
      yPercent: 12, scale: 1.08, ease: 'none',
      scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true },
    });
  });
  return () => mm.revert();
}

const smooth = (a, b, v) => {
  const t = clamp((v - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
const mix = (a, b, t) => Math.round(a + (b - a) * t);
const WHITE = [245, 245, 245];
const AMBER = [255, 194, 26];

/**
 * Cursor-reactive name: the hollow letters fill with white, then flash amber where
 * the pointer actually is. A 400px glyph is expensive to repaint, so the colours are
 * quantised and CSS eases each step — the ticker only writes on a change.
 * Returns a cleanup.
 */
export function heroNameReactive(root, chars) {
  const line = root.querySelector('[data-hero-name]');
  if (!line || !chars.length || state.touch) return () => {};
  const REACH = 150; // px of influence around a letter
  const STEP = 1 / 16;
  const glyphs = chars.filter((el) => line.contains(el)).map((el) => ({ el, cx: 0, cy: 0, cur: 0, key: -1 }));
  if (!glyphs.length) return () => {};

  // letter centres in the line's own layout space, so scrolling never forces a re-measure
  const place = () => glyphs.forEach((g) => {
    g.cx = g.el.offsetLeft + g.el.offsetWidth / 2;
    g.cy = g.el.offsetTop + g.el.offsetHeight / 2;
  });
  place();
  const ro = new ResizeObserver(place);
  ro.observe(line);
  let onScreen = true;
  const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; });
  io.observe(line);

  const paint = (g, fill, amber) => {
    const f = Math.round(fill / STEP);
    const a = Math.round(amber / STEP);
    const key = f * 100 + a;
    if (key === g.key) return;
    g.key = key;
    const c = WHITE.map((w, i) => mix(w, AMBER[i], a * STEP));
    g.el.style.webkitTextFillColor = `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${(f * STEP).toFixed(3)})`;
    g.el.style.webkitTextStrokeColor = `rgba(245, 245, 245, ${(0.5 * (1 - f * STEP)).toFixed(3)})`;
  };

  const tick = () => {
    if (!onScreen || (!state.mx && !state.my)) return;
    const r = line.getBoundingClientRect();
    const near = state.mx > r.left - REACH && state.mx < r.right + REACH
      && state.my > r.top - REACH && state.my < r.bottom + REACH;
    for (let i = 0; i < glyphs.length; i += 1) {
      const g = glyphs[i];
      const d = near ? Math.hypot(state.mx - (r.left + g.cx), state.my - (r.top + g.cy)) : REACH * 2;
      g.cur += (clamp(1 - d / REACH, 0, 1) - g.cur) * 0.3;
      paint(g, smooth(0.05, 0.45, g.cur), smooth(0.55, 1, g.cur));
    }
  };
  gsap.ticker.add(tick);

  return () => { gsap.ticker.remove(tick); ro.disconnect(); io.disconnect(); };
}
