import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { navItems, profile } from '../../data/profile';
import { navigateTo } from '../../animations/pageTransitions';
import { stopScroll, startScroll } from '../../lenisStore';
import './Navigation.css';

gsap.registerPlugin(ScrollTrigger);

export default function Navigation({ ready }) {
  const [active, setActive] = useState('');
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const root = useRef(null);
  const menu = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setCompact(y > 120);
      // while the hero still owns the viewport, Home wins over the section triggers below
      if (y < window.innerHeight * 0.3) setActive('top');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [ready]);

  useEffect(() => {
    if (!ready) return undefined;
    const ctx = gsap.context(() => {
      navItems.forEach(({ id }) => {
        if (id === 'top') return; // handled by the scroll listener in the effect above
        const el = document.getElementById(id);
        if (!el) return;
        ScrollTrigger.create({
          trigger: el, start: 'top 55%', end: 'bottom 55%',
          onToggle: (self) => self.isActive && setActive(id),
        });
      });
      gsap.from(root.current, { yPercent: -120, autoAlpha: 0, duration: 1, ease: 'power4.out', delay: 0.9 });
    });
    return () => ctx.revert();
  }, [ready]);

  useEffect(() => {
    const m = menu.current;
    if (!m) return undefined;
    if (open) {
      stopScroll();
      gsap.set(m, { visibility: 'visible' });
      gsap.fromTo(m, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.7, ease: 'power4.inOut' });
      gsap.fromTo(m.querySelectorAll('.menu__link span'), { yPercent: 110 }, { yPercent: 0, duration: 0.8, stagger: 0.06, delay: 0.25, ease: 'power4.out' });
      const onKey = (e) => { if (e.key === 'Escape') { e.preventDefault(); setOpen(false); } };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }
    startScroll();
    gsap.to(m, { clipPath: 'inset(0 0 100% 0)', duration: 0.55, ease: 'power4.inOut', onComplete: () => gsap.set(m, { visibility: 'hidden' }) });
    return undefined;
  }, [open]);

  const go = (id) => (e) => { e.preventDefault(); setOpen(false); setTimeout(() => navigateTo(id), open ? 450 : 0); };

  return (
    <>
      <header className={`nav ${compact ? 'is-compact' : ''}`} ref={root}>
        <nav className="nav__links" aria-label="Primary">
          {navItems.map(({ id, label }) => (
            <a key={id} href={`#${id}`} className={`nav__link ${active === id ? 'is-active' : ''}`} onClick={go(id)} aria-current={active === id ? 'true' : undefined}>
              <span className="nav__roll"><span>{label}</span><span aria-hidden="true">{label}</span></span>
            </a>
          ))}
        </nav>
        <button
          className={`nav__burger ${open ? 'is-open' : ''}`}
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          <span className="nav__burgerBox" aria-hidden="true"><i /><i /><i /></span>
        </button>
      </header>
      <div className="menu" id="menu" ref={menu} style={{ visibility: 'hidden' }} aria-hidden={!open}>
        <ul>
          {navItems.map(({ id, label }, i) => (
            <li key={id}>
              <a href={`#${id}`} className="menu__link display" onClick={go(id)} tabIndex={open ? 0 : -1}>
                <em className="mono">0{i + 1}</em><span>{label}</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="mono">{profile.email}</p>
      </div>
    </>
  );
}
