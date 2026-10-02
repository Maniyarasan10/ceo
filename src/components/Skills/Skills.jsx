import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { skills } from '../../data/skills';
import useReveal from '../../hooks/useReveal';
import { prefersReducedMotion } from '../../state';
import './Skills.css';

export default function Skills() {
  const root = useRef(null);
  const stage = useRef(null);
  const [active, setActive] = useState(0);
  useReveal(root);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const items = stage.current.querySelectorAll('.skills__tech span');
    gsap.fromTo(items, { yPercent: 115 }, { yPercent: 0, duration: 0.8, stagger: 0.05, ease: 'power4.out', overwrite: true });
  }, [active]);

  const cur = skills[active];
  return (
    <section className="skills" id="stack" ref={root}>
      <div className="sec-head mono"><span>(02) Tech stack</span><span>{String(skills.reduce((n, s) => n + s.items.length, 0))} tools, {skills.length} disciplines</span></div>
      <div className="skills__inner">
        <h2 className="skills__title display h-lg" data-reveal>Tech stack</h2>
        <div className="skills__grid">
          <ul className="skills__cats" aria-label="Skill categories">
            {skills.map((s, i) => (
              <li key={s.id}>
                <button
                  aria-pressed={i === active} id={`tab-${s.id}`} aria-controls="skills-panel"
                  className={`skills__cat display ${i === active ? 'is-on' : ''}`}
                  onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => setActive(i)}
                  data-cursor="EXPLORE" data-cursor-shape="pill"
                >
                  <span className="skills__name">{s.name}</span>
                  <span className="skills__count mono">{s.items.length}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="skills__stage" id="skills-panel" aria-live="polite" ref={stage}>
            <p className="mono skills__label">{cur.name} / in daily use</p>
            <ul className="skills__tech display" key={cur.id}>
              {cur.items.map((t) => <li key={t}><span>{t}</span></li>)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
