import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { state } from '../../state';
import { initMagnetic } from '../../animations/cursorAnimations';
import './Cursor.css';

export default function Cursor() {
  const root = useRef(null);
  const dot = useRef(null);
  const ring = useRef(null);
  const label = useRef(null);

  useEffect(() => {
    if (state.touch) return undefined;
    document.documentElement.classList.add('has-cursor');
    const r = root.current;
    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.08, ease: 'none' });
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.08, ease: 'none' });
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.55, ease: 'power3' });
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.55, ease: 'power3' });
    let px = 0; let py = 0;
    let current = null;

    const set = (mode, text = '', shape = 'circle') => {
      r.dataset.mode = mode; r.dataset.shape = shape;
      label.current.textContent = text;
    };
    const onMove = (e) => {
      r.style.opacity = '1';
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
      state.mx = e.clientX; state.my = e.clientY;
      state.nx = (e.clientX / window.innerWidth) * 2 - 1;
      state.ny = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onOver = (e) => {
      const t = e.target.closest?.('[data-cursor]');
      current = t;
      if (t && t.dataset.cursor) { set('label', t.dataset.cursor, t.dataset.cursorShape || 'circle'); return; }
      if (e.target.closest?.('a, button, input, textarea, [role="button"], [data-magnetic]')) { set('link'); return; }
      set('idle');
    };
    const onDown = () => {
      r.classList.add('is-down');
      if (current?.dataset.cursorDown) label.current.textContent = current.dataset.cursorDown;
    };
    const onUp = () => {
      r.classList.remove('is-down');
      if (current?.dataset.cursor) label.current.textContent = current.dataset.cursor;
    };
    const onLeave = () => { r.style.opacity = '0'; };
    // velocity for other systems
    const tick = () => {
      const v = Math.hypot(state.mx - px, state.my - py);
      state.speed += (v - state.speed) * 0.15;
      px = state.mx; py = state.my;
    };
    gsap.ticker.add(tick);
    const cleanMagnet = initMagnetic();
    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.documentElement.addEventListener('mouseleave', onLeave);
    return () => {
      document.documentElement.classList.remove('has-cursor');
      gsap.ticker.remove(tick);
      cleanMagnet();
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  if (state.touch) return null;
  return (
    <div className="cursor" ref={root} data-mode="idle" data-shape="circle" aria-hidden="true">
      <div className="cursor__ring" ref={ring}><div className="cursor__inner"><span ref={label} className="cursor__label" /></div></div>
      <div className="cursor__dot" ref={dot} />
    </div>
  );
}
