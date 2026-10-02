import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { timeline } from '../../data/experience';
import useMediaQuery from '../../hooks/useMediaQuery';
import useReveal from '../../hooks/useReveal';
import './Experience.css';

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
  const root = useRef(null);
  const years = useRef(null);
  const line = useRef(null);
  const [idx, setIdx] = useState(0);
  const pinned = useMediaQuery('(min-width: 900px) and (prefers-reduced-motion: no-preference)');
  useReveal(root);

  useLayoutEffect(() => {
    if (!pinned) return undefined;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root.current.querySelector('.exp2__pin'), start: 'top top', end: `+=${timeline.length * 70}%`, pin: true, anticipatePin: 1,
        onUpdate: (self) => {
          setIdx(Math.min(timeline.length - 1, Math.floor(self.progress * timeline.length)));
          gsap.set(line.current, { scaleY: self.progress });
        },
      });
    }, root);
    return () => ctx.revert();
  }, [pinned]);

  useEffect(() => {
    if (!pinned) return;
    gsap.to(years.current, { yPercent: -(100 / timeline.length) * idx, duration: 0.9, ease: 'power4.inOut' });
  }, [idx, pinned]);

  return (
    <section className={`exp2 ${pinned ? 'is-pinned' : ''}`} id="experience" ref={root}>
      <div className="exp2__pin">
        <div className="sec-head mono"><span>(04) Journey</span><span>{pinned ? `Stage ${idx + 1} / ${timeline.length}` : 'Timeline'}</span></div>
        <h2 className="sr-only">Experience and journey</h2>
        <div className="exp2__body">
          <div className="exp2__yearwin" aria-hidden="true">
            <div className="exp2__years display" ref={years} data-vfx="y">
              {timeline.map((t) => <span key={t.year}>{t.year}</span>)}
            </div>
          </div>
          <div className="exp2__stages">
            <i className="exp2__line" ref={line} aria-hidden="true" />
            {timeline.map((t, i) => (
              <article key={t.year} className={`exp2__stage ${i === idx ? 'is-active' : ''}`} aria-hidden={pinned && i !== idx}>
                <p className="exp2__year display">{t.year}</p>
                <h3 className="display h-md">{t.title}</h3>
                <p className="exp2__blurb">{t.blurb}</p>
                <ul className="exp2__items">
                  {t.items.map((it) => (
                    <li key={it.cat}><span className="mono">{it.cat}</span><p>{it.text}</p></li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
