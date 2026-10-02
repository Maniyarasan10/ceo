import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { pad } from '../../utils/split';
import { prefersReducedMotion } from '../../state';
import './Loader.css';

const STEPS = ['INITIALIZING', 'LOADING SYSTEM', 'BUILDING EXPERIENCE', 'READY'];

export default function Loader({ onDone }) {
  const root = useRef(null);
  const count = useRef(null);
  const bar = useRef(null);
  const rows = useRef([]);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    const fast = document.readyState === 'complete' && document.fonts?.status === 'loaded';
    const dur = reduced ? 0.15 : fast ? 0.9 : 1.3;
    const fonts = Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 2500))]);
    const c = { v: 0 };
    let last = -1;
    let cancelled = false;
    const ctx = gsap.context(() => {
      gsap.to(c, {
        v: 100, duration: dur, ease: 'power2.inOut',
        onUpdate: () => {
          count.current.textContent = pad(Math.round(c.v), 3);
          gsap.set(bar.current, { scaleX: c.v / 100 });
          const idx = Math.min(3, Math.floor(c.v / 33.4));
          if (idx !== last) {
            last = idx;
            rows.current.forEach((r, i) => r && r.classList.toggle('is-on', i <= idx));
          }
        },
        onComplete: async () => {
          await fonts;
          if (cancelled) return;
          const tl = gsap.timeline();
          tl.to('.loader__row, .loader__count', { yPercent: -120, duration: 0.5, stagger: 0.03, ease: 'power3.in' })
            .add(() => onDone(), '-=0.15')
            .to(root.current, { clipPath: 'inset(0 0 100% 0)', duration: 0.85, ease: 'power4.inOut' }, '<0.1')
            .set(root.current, { display: 'none' });
        },
      });
    }, root);
    return () => { cancelled = true; ctx.revert(); };
  }, [onDone]);

  return (
    <div className="loader" ref={root} role="status" aria-live="polite" aria-label="Loading">
      <ul className="loader__list mono">
        {STEPS.map((s, i) => (
          <li key={s} className="loader__row" ref={(el) => (rows.current[i] = el)}>
            <span>0{i}</span> — {s}
          </li>
        ))}
      </ul>
      <div className="loader__count display" ref={count}>000</div>
      <div className="loader__bar"><span ref={bar} /></div>
    </div>
  );
}
