import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { splitText } from '../../utils/split';
import { stopScroll, startScroll } from '../../lenisStore';
import { prefersReducedMotion, state } from '../../state';
import ProjectVisual from './ProjectVisual';

export default function CaseStudy({ project, origin, index, next, onClose, onNext }) {
  const root = useRef(null);
  const title = useRef(null);
  const closing = useRef(false);
  // we push one history entry for the whole dialog session, so "Next project"
  // swaps content in place instead of stacking an entry per project
  const pushed = useRef(false);
  // keep the popstate handler from calling a stale onClose
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // browser / hardware Back must close the dialog, not leave the site
  useEffect(() => {
    window.history.pushState({ cs: project.id }, '');
    pushed.current = true;
    const onPop = () => { pushed.current = false; onCloseRef.current(); };
    window.addEventListener('popstate', onPop);
    return () => {
      window.removeEventListener('popstate', onPop);
      // unmounted without popping (programmatic close): drop our entry so the
      // visitor isn't left needing one extra Back press to return to the site
      if (pushed.current) { pushed.current = false; window.history.back(); }
    };
  }, []);

  // Scroll lock, chrome hiding and focus restore belong to the dialog *session*,
  // so they run once. Previously they lived in the animation effect, which
  // re-runs on "Next project" and so restarted Lenis mid-dialog.
  useEffect(() => {
    stopScroll();
    document.documentElement.classList.add('has-dialog');
    const prev = document.activeElement;
    root.current.querySelector('.cs__close').focus();
    return () => {
      document.documentElement.classList.remove('has-dialog');
      startScroll();
      prev?.focus?.();
    };
  }, []);

  // open animation only, re-run per project so the new title re-animates
  useEffect(() => {
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      const { chars } = splitText(title.current);
      const x = origin?.x ?? window.innerWidth / 2; const y = origin?.y ?? window.innerHeight / 2;
      const tl = gsap.timeline();
      tl.fromTo(root.current, { clipPath: `circle(0px at ${x}px ${y}px)` }, { clipPath: `circle(150% at ${x}px ${y}px)`, duration: reduced ? 0.01 : 0.95, ease: 'power4.inOut' });
      if (!reduced) {
        tl.fromTo(chars, { yPercent: 115 }, { yPercent: 0, duration: 0.9, stagger: 0.03, ease: 'power4.out' }, '-=0.4')
          .fromTo('.cs__rise', { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.07, ease: 'power3.out' }, '-=0.6');
      }
    }, root);
    return () => ctx.revert();
  }, [project.id, origin]);

  const close = (fromPop = false) => {
    if (closing.current) return; closing.current = true;
    gsap.to(root.current, {
      clipPath: 'circle(0px at 50% 50%)',
      duration: prefersReducedMotion() ? 0.01 : 0.7,
      ease: 'power4.inOut',
      onComplete: () => {
        // when closing by tap/esc, hand back the entry we pushed so Back stays level
        if (!fromPop && pushed.current) { pushed.current = false; window.history.back(); }
        onCloseRef.current();
      },
    });
  };
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') { // simple focus trap
        const f = root.current.querySelectorAll('button, a[href]');
        const first = f[0]; const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="cs" ref={root} role="dialog" aria-modal="true" aria-label={`${project.title} case study`} data-lenis-prevent>
      <div className="cs__bar">
        <button className="cs__close mono" onClick={() => close()} data-cursor="CLOSE">
          {state.touch && (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          )}
          {state.touch ? 'Back' : 'Close (Esc)'}
        </button>
      </div>
      <div className="cs__hero">
        <h2 className="cs__title display" ref={title}>{project.title}</h2>
        <div className="cs__art cs__rise">
          {project.image
            ? <img className="cs__img" src={project.image} alt={`${project.title} — product visual`} decoding="async" draggable="false" />
            : <ProjectVisual pattern={project.pattern} seed={index + 2} />}
        </div>
      </div>
      <dl className="cs__meta cs__rise">
        <div><dt className="mono">Focus</dt><dd>{project.year}</dd></div>
        <div><dt className="mono">Role</dt><dd>{project.role}</dd></div>
        <div><dt className="mono">Stack</dt><dd>{project.tags.join(', ')}</dd></div>
      </dl>
      <div className="cs__body">
        <p className="cs__lead cs__rise">{project.overview}</p>
        <div className="cs__cols">
          {[['Challenge', project.challenge], ['Solution', project.solution], ['Outcome', project.outcome]].map(([h, t]) => (
            <section key={h} className="cs__rise"><h3 className="mono">{h}</h3><p>{t}</p></section>
          ))}
        </div>
      </div>
      <button className="cs__next cs__rise" onClick={() => onNext(next)} data-cursor="NEXT">
        <span className="mono">Next project</span>
        <span className="display">{next.title}</span>
      </button>
    </div>
  );
}
