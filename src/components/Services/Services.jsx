import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { services } from '../../data/services';
import useReveal from '../../hooks/useReveal';
import { prefersReducedMotion, state } from '../../state';
import { cssVar } from '../../utils/split';
import { drawers } from './visuals';
import './Services.css';

export default function Services() {
  const root = useRef(null);
  const canvas = useRef(null);
  const [active, setActive] = useState(0);
  const mode = useRef(0);
  const fade = useRef({ v: 1 });
  const ptr = useRef({ x: 0.5, y: 0.5 });
  useReveal(root);

  useEffect(() => {
    mode.current = active;
    fade.current.v = 0;
    gsap.to(fade.current, { v: 1, duration: 0.8, ease: 'power2.out' });
  }, [active]);

  useEffect(() => {
    const el = canvas.current; const box = root.current;
    const ctx = el.getContext('2d');
    if (!ctx) return undefined;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0; let h = 0; let raf = 0; let visible = false;
    let colors = { fg: cssVar('--fg'), accent: cssVar('--accent') };
    const size = () => { w = box.clientWidth; h = box.clientHeight; el.width = w * dpr; el.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    size();
    const draw = (now) => {
      raf = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, w, h);
      ctx.globalAlpha = fade.current.v;
      drawers[mode.current](ctx, w, h, now / 1000, ptr.current, colors);
      ctx.globalAlpha = 1;
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf && !prefersReducedMotion()) raf = requestAnimationFrame(draw);
      if (!visible) { cancelAnimationFrame(raf); raf = 0; }
    });
    io.observe(box);
    if (prefersReducedMotion()) draw(1500);
    const ro = new ResizeObserver(() => { size(); if (prefersReducedMotion()) draw(1500); }); ro.observe(box);
    const move = (e) => { const r = box.getBoundingClientRect(); ptr.current.x = (e.clientX - r.left) / r.width; ptr.current.y = (e.clientY - r.top) / r.height; };
    box.addEventListener('pointermove', move);
    const onMode = () => { colors = { fg: cssVar('--fg'), accent: cssVar('--accent') }; };
    window.addEventListener('modechange', onMode);
    return () => { cancelAnimationFrame(raf); raf = 0; io.disconnect(); ro.disconnect(); box.removeEventListener('pointermove', move); window.removeEventListener('modechange', onMode); };
  }, []);

  return (
    <section className="services" id="services" ref={root}>
      <canvas ref={canvas} className="services__canvas" aria-hidden="true" />
      <div className="sec-head mono"><span>(05) What I build</span><span>{state.touch ? 'Tap a service to change the field' : 'Hover a service to change the field'}</span></div>
      <div className="services__inner">
        <h2 className="display h-lg" data-reveal>What I build</h2>
        <ul className="services__list">
          {services.map((s, i) => (
            <li key={s.id}>
              <button
                className={`services__row ${i === active ? 'is-on' : ''}`}
                onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => setActive(i)}
                aria-pressed={i === active} data-cursor="SEE" data-cursor-shape="pill"
              >
                <span className="services__n mono">0{i + 1}</span>
                <span className="services__name display">{s.name}</span>
                <span className="services__desc">
                  <span>{s.desc}</span>
                  <span className="mono">{s.tags.join('  /  ')}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
