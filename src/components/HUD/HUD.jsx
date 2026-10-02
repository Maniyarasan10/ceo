import { useEffect, useRef, useState } from 'react';
import './HUD.css';

export default function HUD() {
  const prog = useRef(null);
  const pct = useRef(null);
  const [mode, setMode] = useState('dark');

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      if (prog.current) prog.current.style.transform = `scaleY(${p})`;
      if (pct.current) pct.current.textContent = `${String(Math.round(p * 100)).padStart(3, '0')}%`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener('scroll', onScroll); };
  }, []);

  const toggle = () => {
    const next = mode === 'dark' ? 'blueprint' : 'dark';
    setMode(next);
    document.documentElement.dataset.mode = next;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'dark' ? '#0A0A0A' : '#FFC21A');
    window.dispatchEvent(new CustomEvent('modechange'));
  };

  const label = mode === 'dark' ? 'DARK' : 'BLUEPRINT';

  return (
    <>
      <div className="hud__progress" aria-hidden="true"><span ref={prog} /></div>
      <button
        className="hud__mode mono"
        onClick={toggle}
        aria-pressed={mode === 'blueprint'}
        data-cursor="MODE"
        aria-label={`SYS / ${label} — switch visual mode`}
      >
        <i className="hud__dot" /> SYS / {label}
      </button>
      <div className="hud__coords mono" aria-hidden="true">
        <span ref={pct}>000%</span>
      </div>
    </>
  );
}
