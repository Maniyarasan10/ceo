import { useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { prepareHero, playHeroIntro, heroScroll, heroNameReactive } from '../../animations/heroAnimations';
import { navigateTo } from '../../animations/pageTransitions';
import useReducedMotion from '../../hooks/useReducedMotion';
import { profile } from '../../data/profile';
import { projects } from '../../data/projects';
import './Hero.css';

// product imagery doubles as the hero backdrop
const SHOTS = projects.map((p) => p.image).filter(Boolean);
// the role lockup is the same voice as the name, just a step down
const ROLES_RATIO = 0.7;

export default function Hero({ ready }) {
  const root = useRef(null);
  const chars = useRef([]);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => { chars.current = prepareHero(root.current); }, root);
    return () => ctx.revert();
  }, []);

  // the display face is very wide: shrink each line only if it would ever overflow,
  // so a fallback font can neither wrap nor clip the name
  useLayoutEffect(() => {
    const hero = root.current;
    if (!hero) return undefined;
    const measure = (line) => {
      const range = document.createRange();
      range.selectNodeContents(line);
      return range.getBoundingClientRect().width || line.scrollWidth;
    };
    const shrinkToFit = (line, start, avail) => {
      let size = start;
      for (let i = 0; i < 5; i += 1) {
        line.style.fontSize = `${size}px`;
        const w = measure(line);
        if (w <= avail || size <= 12) break;
        size = Math.max(12, size * (avail / w) - 1);
      }
      line.style.fontSize = `${Math.floor(size)}px`;
      return Math.floor(size);
    };
    const fit = () => {
      const cs = getComputedStyle(hero);
      const avail = hero.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const [name, roles] = hero.querySelectorAll('[data-hero-line]');
      if (!name) return;
      // always read the cap from CSS, never from a previous fit, so this can correct
      // itself upwards once the webfont finishes loading
      name.style.fontSize = '';
      const nameSize = shrinkToFit(name, parseFloat(getComputedStyle(name).fontSize), avail);
      if (!roles) return;
      roles.style.fontSize = '';
      const cap = parseFloat(getComputedStyle(roles).fontSize);
      shrinkToFit(roles, Math.min(cap, nameSize * ROLES_RATIO), avail);
    };
    fit();
    document.fonts?.ready.then(fit);
    const ro = new ResizeObserver(fit);
    ro.observe(hero);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!ready) return undefined;
    const ctx = gsap.context(() => {
      const tl = playHeroIntro(root.current, chars.current);
      if (reduced) tl.progress(1);
    }, root);
    const off = heroScroll(root.current);
    const offName = heroNameReactive(root.current, chars.current);
    return () => { off(); offName(); ctx.revert(); };
  }, [ready, reduced]);

  // slow cross-fade between shots; static first frame when the visitor prefers reduced motion
  useEffect(() => {
    if (reduced || SHOTS.length < 2) return undefined;
    const imgs = [...root.current.querySelectorAll('.hero__shot')];
    let i = 0; let onscreen = true;
    const io = new IntersectionObserver(([e]) => { onscreen = e.isIntersecting; }, { threshold: 0.05 });
    io.observe(root.current);
    const id = setInterval(() => {
      if (!onscreen) return;
      i = (i + 1) % imgs.length;
      imgs.forEach((el, n) => el.classList.toggle('is-on', n === i));
    }, 5200);
    return () => { clearInterval(id); io.disconnect(); };
  }, [reduced]);

  return (
    <section className="hero" id="top" ref={root} aria-label="Introduction">
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__shots">
          {SHOTS.map((src, i) => (
            <img
              key={src}
              className={`hero__shot${i === 0 ? ' is-on' : ''}`}
              src={src}
              alt=""
              decoding="async"
              draggable="false"
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          ))}
        </div>
        <span className="hero__scrim" />
        <div className="hero__grid" aria-hidden="true">{Array.from({ length: 12 }, (_, i) => <span key={i} />)}</div>
      </div>

      <div className="hero__meta hero__meta--top mono" data-hero-fade>
        <span>{profile.role}</span>
        <span className="hero__status"><i /> {profile.company} — {profile.companyShort}</span>
      </div>

      <h1 className="hero__title display" data-vfx="y">
        <span className="hero__line hero__line--name" data-hero-line data-hero-name>MANIYARASAN</span>
        <span className="hero__line hero__line--roles" data-hero-line>{profile.titles}</span>
      </h1>

      <div className="hero__foot">
        <p className="hero__lede" data-hero-fade>
          Building products. Solving problems. Creating what&apos;s next.
        </p>
        <div className="hero__cta" data-hero-fade>
          <button className="btn btn--solid" data-magnetic="0.4" onClick={() => navigateTo('work')}>View work</button>
          <a className="btn btn--ghost" data-magnetic="0.4" href={`mailto:${profile.email}`}>Start a project</a>
          <a className="btn btn--accent" data-magnetic="0.4" href={profile.companyUrl} target="_blank" rel="noopener noreferrer">
            Visit company site <span className="hero__cta-arrow" aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="hero__cue mono" data-hero-fade aria-hidden="true">
          <span>Scroll</span><i className="hero__cue-line" />
        </div>
      </div>
    </section>
  );
}
