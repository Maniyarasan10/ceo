import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { splitText } from '../../utils/split';
import ProjectVisual from './ProjectVisual';

export default function ProjectCard({ project, index, onOpen, onHover }) {
  const card = useRef(null);
  const title = useRef(null);
  const visual = useRef(null);
  const chars = useRef([]);
  const drag = useRef({ down: false, moved: false, x0: 0 });

  useEffect(() => {
    chars.current = splitText(title.current).chars;
    return undefined;
  }, []);

  useEffect(() => {
    const skew = gsap.quickTo(title.current, 'skewX', { duration: 0.5, ease: 'power3' });
    const el = card.current;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      skew(-((e.clientX - r.left) / r.width - 0.5) * 14);
    };
    el.addEventListener('mousemove', move);
    return () => el.removeEventListener('mousemove', move);
  }, []);

  const enter = () => {
    onHover(index);
    gsap.to(chars.current, { yPercent: -8, scaleY: 1.1, duration: 0.45, stagger: { each: 0.025, from: 'center' }, yoyo: true, repeat: 1, ease: 'power2.out', overwrite: 'auto' });
  };
  const leave = () => gsap.to(title.current, { skewX: 0, duration: 0.6, ease: 'power3.out' });

  // Dragging the artwork slides it away and reveals the hidden layer underneath.
  const down = (e) => { drag.current = { down: true, moved: false, x0: e.clientX }; e.currentTarget.setPointerCapture(e.pointerId); };
  const move = (e) => {
    const d = drag.current; if (!d.down) return;
    const dx = e.clientX - d.x0;
    if (Math.abs(dx) > 6) d.moved = true;
    gsap.to(visual.current, { x: gsap.utils.clamp(-90, 90, dx * 0.55), duration: 0.25, ease: 'power3.out', overwrite: 'auto' });
  };
  const up = (e) => {
    const d = drag.current; if (!d.down) return;
    d.down = false;
    gsap.to(visual.current, { x: 0, duration: 1, ease: 'elastic.out(1, 0.45)' });
    if (!d.moved) onOpen(project, { x: e.clientX, y: e.clientY });
  };

  return (
    <article className="pcard" ref={card} onMouseEnter={enter} onMouseLeave={leave}>
      <header className="pcard__top mono">
        <span>{project.num}</span><span>{project.year}</span>
      </header>
      <div
        className="pcard__media" data-cursor="VIEW" data-cursor-down="DRAG"
        onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
      >
        <ul className="pcard__hidden mono" aria-hidden="true">
          <li>Hidden layer</li>
          {project.hidden.map((h) => <li key={h}>+ {h}</li>)}
        </ul>
        <div className="pcard__clip">
          <div className="pcard__visual" ref={visual}>
            {project.image
              ? <img className="pimg" src={project.image} alt={`${project.title} — product visual`} loading="lazy" decoding="async" draggable="false" />
              : <ProjectVisual pattern={project.pattern} seed={index + 2} />}
          </div>
        </div>
      </div>
      <h3 className="pcard__title display">
        <button ref={title} onClick={(e) => onOpen(project, { x: e.clientX || window.innerWidth / 2, y: e.clientY || window.innerHeight / 2 })} aria-label={`Open case study: ${project.title}`}>{project.title}</button>
      </h3>
      <p className="pcard__desc">{project.short}</p>
      <ul className="pcard__tags mono">
        {project.tags.map((t) => <li key={t}>{t}</li>)}
      </ul>
    </article>
  );
}
