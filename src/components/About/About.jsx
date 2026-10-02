import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitText } from '../../utils/split';
import useReveal from '../../hooks/useReveal';
import { profile } from '../../data/profile';
import Pipeline from './Pipeline';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

const DOMAINS = ['AI', 'Web', 'Mobile', 'Automation', 'IoT', 'Products'];

export default function About() {
  const root = useRef(null);
  const chars = useRef([]);
  useReveal(root);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const statement = root.current.querySelector('.about__statement');
      const { words, chars: headingChars } = splitText(statement.querySelector('.about__big'));
      chars.current = headingChars;
      const sub = statement.querySelector('.about__sub');

      // Desktop gets the full 130vh reveal. On phones the statement is only a few
      // lines, so a shorter pin keeps the page from feeling like it is stuck.
      // On short viewports the statement can be taller than the screen, and pinning it
      // would strand the last line below the fold, so it simply reveals in place.
      const mm = gsap.matchMedia();
      const buildStatement = (end) => {
        gsap.set(chars, { opacity: 0.2, yPercent: 120 });
        gsap.set(words, { overflow: 'visible' });
        gsap.set(sub, { opacity: 0, y: 20 });
        gsap.timeline({
          scrollTrigger: { trigger: statement, start: 'top top', end, pin: true, scrub: 0.5, anticipatePin: 1 },
        })
          .to(chars, { opacity: 1, yPercent: 0, stagger: 0.02, duration: 1.1, ease: 'power4.out' })
          .to(sub, { opacity: 1, y: 0, ease: 'none' }, '>-0.2');
      };
      const buildFlat = () => {
        gsap.set(chars, { opacity: 1, yPercent: 0 });
        gsap.fromTo(sub, { opacity: 0, y: 20 }, {
          opacity: 1, y: 0, ease: 'none',
          scrollTrigger: { trigger: statement, start: 'top 80%', end: 'top 35%', scrub: 0.5 },
        });
      };
      mm.add({
        '(prefers-reduced-motion: no-preference) and (min-width: 900px)': () => buildStatement('+=130%'),
        '(prefers-reduced-motion: no-preference) and (max-width: 899px) and (min-height: 720px)': () => buildStatement('+=55%'),
        '(prefers-reduced-motion: no-preference) and (max-width: 899px) and (max-height: 719px)': () => buildFlat(),
      });

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // domains: two rows travelling in opposite directions, tied to scroll
        root.current.querySelectorAll('.about__row').forEach((row, i) => {
          gsap.fromTo(row, { xPercent: i ? -22 : 0 }, {
            xPercent: i ? 0 : -22, ease: 'none',
            scrollTrigger: { trigger: '.about__domains', start: 'top bottom', end: 'bottom top', scrub: 0.6 },
          });
        });
      });

      const moveLetters = (event) => {
        const box = statement.getBoundingClientRect();
        const mx = event.clientX - box.left;
        const my = event.clientY - box.top;
        chars.current.forEach((c) => {
          const r = c.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          const dx = mx - cx;
          const dy = my - cy;
          const d = Math.hypot(dx, dy);
          const R = Math.max(220, r.width * 2.4 + r.height * 1.6);
          const k = Math.max(0, 1 - d / R);
          c.style.setProperty('--hot', k.toFixed(3));
          gsap.to(c, {
            y: -k * 16,
            scale: 1 + k * 0.18,
            skewX: -(dx / R) * 12 * k,
            duration: 0.45,
            ease: 'power3.out',
            overwrite: 'auto',
          });
        });
      };

      const resetLetters = () => {
        chars.current.forEach((c) => {
          c.style.setProperty('--hot', '0');
        });
        gsap.to(chars.current, {
          y: 0,
          scale: 1,
          skewX: 0,
          duration: 0.7,
          ease: 'elastic.out(1, 0.5)',
          overwrite: 'auto',
        });
      };

      statement.addEventListener('pointermove', moveLetters);
      statement.addEventListener('pointerleave', resetLetters);
      return () => {
        statement.removeEventListener('pointermove', moveLetters);
        statement.removeEventListener('pointerleave', resetLetters);
      };
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="about" id="about" ref={root}>
      <div className="about__statement">
        <p className="about__meta mono"><span>(01) Identity</span><span>{profile.field}</span></p>
        <h2 className="about__big display">I build technology that solves real problems.</h2>
        <p className="about__sub">
          I&apos;m a Computer Science and Engineering student who enjoys turning ideas into real products. I build software,
          experiment with AI and intelligent systems, explore hardware and IoT, and work on technology-driven ventures
          through Problem Solving Mind.
        </p>
      </div>

      <div className="about__domains" aria-label="Areas of work">
        {[0, 1].map((r) => (
          <div className="about__row display" key={r} data-vfx="x" aria-hidden={r === 1}>
            {[...DOMAINS, ...DOMAINS].map((d, i) => (
              <span key={i} className={`about__domain ${(i + r) % 2 ? 'is-outline' : ''}`}>{d}<i>/</i></span>
            ))}
          </div>
        ))}
        <ul className="sr-only">{DOMAINS.map((d) => <li key={d}>{d}</li>)}</ul>
      </div>

      <div className="about__pipeline">
        <div className="about__pipehead">
          <h3 className="display h-md" data-reveal>From idea to product</h3>
          <p className="mono">Hover or tap a stage. The signal moves on its own when you don&apos;t.</p>
        </div>
        <Pipeline />
      </div>
    </section>
  );
}
