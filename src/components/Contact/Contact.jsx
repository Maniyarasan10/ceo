import { useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitText } from '../../utils/split';
import { profile } from '../../data/profile';
import { prefersReducedMotion, state } from '../../state';
import './Contact.css';

gsap.registerPlugin(ScrollTrigger);
const LINES = ["LET'S BUILD", 'SOMETHING', 'MEANINGFUL.'];

export default function Contact() {
  const root = useRef(null);
  const chars = useRef([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      chars.current = [...root.current.querySelectorAll('.contact__line')].flatMap((l) => splitText(l).chars);
      if (prefersReducedMotion()) return;
      gsap.set(chars.current, { yPercent: 115 });
      ScrollTrigger.create({
        trigger: root.current, start: 'top 60%', once: true,
        onEnter: () => gsap.to(chars.current, { yPercent: 0, duration: 1.1, stagger: 0.02, ease: 'power4.out' }),
      });
      root.current.querySelector('.contact__title').setAttribute('data-enter', '');
    }, root);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (state.touch || prefersReducedMotion()) return undefined;
    const box = root.current;
    let raf = 0; let ev = null;
    const run = () => {
      raf = 0;
      const { clientX: mx, clientY: my } = ev;
      const boxRect = box.getBoundingClientRect();
      box.style.setProperty('--mx', `${mx - boxRect.left}px`);
      box.style.setProperty('--my', `${my - boxRect.top}px`);
      chars.current.forEach((c) => {
        const r = c.getBoundingClientRect();
        const dx = mx - (r.left + r.width / 2); const dy = my - (r.top + r.height / 2);
        const d = Math.hypot(dx, dy);
        // the display glyphs are huge, so the falloff has to scale with them
        const R = Math.max(260, r.width * 1.7 + r.height * 0.9);
        const k = Math.max(0, 1 - d / R);
        c.style.setProperty('--hot', k.toFixed(3));
        gsap.to(c, { y: -k * 34, scaleY: 1 + k * 0.28, skewX: -(dx / R) * 14 * k, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
      });
    };
    const move = (e) => { ev = e; if (!raf) raf = requestAnimationFrame(run); };
    const leave = () => {
      chars.current.forEach((c) => c.style.setProperty('--hot', '0'));
      gsap.to(chars.current, { y: 0, scaleY: 1, skewX: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)', stagger: 0.005, overwrite: 'auto' });
    };
    box.addEventListener('mousemove', move); box.addEventListener('mouseleave', leave);
    return () => { cancelAnimationFrame(raf); box.removeEventListener('mousemove', move); box.removeEventListener('mouseleave', leave); };
  }, []);

  return (
    <section className="contact" id="contact" ref={root}>
      <div className="sec-head mono"><span>(06) Contact</span><span>Have an idea, product, or problem worth solving?</span></div>
      <div className="contact__inner">
        <h2 className="contact__title display" aria-label="Let's build something meaningful.">
          {LINES.map((l) => <span key={l} className="contact__line">{l}</span>)}
        </h2>
        <div className="contact__row">
          <a className="contact__start" href={`mailto:${profile.email}?subject=New%20project`} data-magnetic="0.45" data-cursor="" >
            <span>Start a project</span>
          </a>
          <ul className="contact__links">
            {profile.links.map((l) => (
              <li key={l.label}>
                <a className="contact__link display u-link" href={l.href} target={l.href.startsWith('mailto') ? undefined : '_blank'} rel="noopener noreferrer" data-cursor="OPEN" data-magnetic="0.2">{l.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
