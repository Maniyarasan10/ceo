import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { projects } from '../../data/projects';
import { initHorizontalProjects } from '../../animations/scrollAnimations';
import { navigateTo } from '../../animations/pageTransitions';
import ProjectCard from './ProjectCard';
import CaseStudy from './CaseStudy';
import useReveal from '../../hooks/useReveal';
import { state } from '../../state';
import './Projects.css';

export default function Projects() {
  const root = useRef(null);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(null); // { project, origin }
  const bar = useRef(null);
  const hovering = useRef(false);
  useReveal(root);

  const onProgress = useCallback((p) => {
    if (bar.current) bar.current.style.transform = `scaleX(${p})`;
    if (!hovering.current) setActive(Math.min(projects.length - 1, Math.round(p * (projects.length - 1))));
  }, []);

  useLayoutEffect(() => initHorizontalProjects(root.current, onProgress), [onProgress]);

  // rolling big number
  const numRef = useRef(null);
  useEffect(() => { gsap.to(numRef.current, { yPercent: -active * (100 / projects.length), duration: 0.7, ease: 'power4.out' }); }, [active]);

  const openProject = (project, origin) => setOpen({ project, origin });
  const idx = open ? projects.findIndex((p) => p.id === open.project.id) : 0;
  const tone = projects[active].tone;

  return (
    <section className="projects" id="work" ref={root} style={{ '--tone': tone }}>
      <div className="projects__pin">
        <div className="projects__big display" aria-hidden="true">
          <div className="projects__bignum" ref={numRef}>{projects.map((p) => <span key={p.id}>{p.num}</span>)}</div>
        </div>
        <div className="projects__track" data-vfx="x" onMouseLeave={() => { hovering.current = false; }}>
          <div className="projects__intro">
            <p className="mono">(03) Selected work</p>
            <h2 className="display h-xl" data-reveal>Selected work</h2>
            <p className="projects__hint mono">{state.touch ? 'Scroll the page. Drag a visual sideways to peek behind it. Tap to open.' : 'Scroll to travel. Drag a visual to peek behind it. Click to open.'}</p>
          </div>
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} onOpen={openProject} onHover={(n) => { hovering.current = true; setActive(n); }} />
          ))}
          <div className="projects__outro">
            <p className="display h-lg">Have something<br />in mind?</p>
            <a href="#contact" className="u-link mono" data-magnetic="0.3" onClick={(e) => { e.preventDefault(); navigateTo('contact'); }}>Start a project</a>
          </div>
        </div>
        <div className="projects__progress" aria-hidden="true"><span ref={bar} /></div>
      </div>
      {open && (
        <CaseStudy
          project={open.project} origin={open.origin} index={idx}
          next={projects[(idx + 1) % projects.length]}
          onClose={() => setOpen(null)}
          onNext={(np) => setOpen({ project: np, origin: null })}
        />
      )}
    </section>
  );
}
