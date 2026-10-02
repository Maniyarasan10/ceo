import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const STAGES = [
  { k: 'Idea', d: 'Find the real problem. Write it down in one sentence before touching any tool.' },
  { k: 'Design', d: 'Sketch flows, type and motion. Decide what the product should feel like.' },
  { k: 'Code', d: 'Ship the smallest working version. Keep it fast, accessible and easy to change.' },
  { k: 'AI', d: 'Add intelligence only where it removes effort: models, retrieval, automation.' },
  { k: 'Product', d: 'Measure, polish and put it in front of people who will tell the truth.' },
];

export default function Pipeline() {
  const [i, setI] = useState(0);
  const [hold, setHold] = useState(false);
  const desc = useRef(null);
  const root = useRef(null);
  const visible = useRef(false);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { visible.current = e.isIntersecting; });
    io.observe(root.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (hold) return undefined;
    const id = setInterval(() => { if (visible.current) setI((n) => (n + 1) % STAGES.length); }, 1900);
    return () => clearInterval(id);
  }, [hold]);

  useEffect(() => {
    gsap.fromTo(desc.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
  }, [i]);

  return (
    <div className="pipe" ref={root} onMouseLeave={() => setHold(false)} style={{ '--p': i / (STAGES.length - 1) }}>
      <div className="pipe__track" aria-hidden="true">
        <span className="pipe__fill" />
        <span className="pipe__packet" />
      </div>
      <ol className="pipe__nodes">
        {STAGES.map((s, n) => (
          <li key={s.k}>
            <button
              className={`pipe__node ${n === i ? 'is-on' : ''} ${n < i ? 'is-done' : ''}`}
              onMouseEnter={() => { setHold(true); setI(n); }}
              onFocus={() => { setHold(true); setI(n); }}
              onClick={() => { setHold(true); setI(n); }}
              aria-pressed={n === i}
            >
              <span className="pipe__dot" />
              <span className="pipe__label display">{s.k}</span>
              <span className="pipe__idx mono">0{n + 1}</span>
            </button>
          </li>
        ))}
      </ol>
      <p className="pipe__desc" ref={desc} aria-live="polite">{STAGES[i].d}</p>
    </div>
  );
}
