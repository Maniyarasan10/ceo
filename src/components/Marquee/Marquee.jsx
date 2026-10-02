import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { state, prefersReducedMotion } from '../../state';
import './Marquee.css';

// Travel is expressed in px/second, not px/frame, so the band reads at the same
// pace on 60Hz and 120Hz screens. Deliberately slow: every phrase stays readable.
const RATE_WIDE = 46;   // ≥1024px
const RATE_TIGHT = 32;  // tablet + mobile
const WIDE = '(min-width: 1024px)';
const REACH = 260;      // px of vertical influence around the band
const NUDGE = 2.4;      // max pointer-driven offset, px

export default function Marquee({ items, speed = 1, reverse = false, outline = false }) {
  const view = useRef(null);
  const track = useRef(null);
  const hover = useRef(false);

  useEffect(() => {
    const viewEl = view.current;
    const trackEl = track.current;
    const sets = [...trackEl.children];
    const dir = reverse ? 1 : -1;
    const setX = gsap.quickSetter(trackEl, 'x', 'px');
    const mq = window.matchMedia(WIDE);
    const rate = () => (mq.matches ? RATE_WIDE : RATE_TIGHT) * speed;

    let period = 0;   // width of one set = the distance between loops
    let x = 0;        // offset, always kept inside a single period
    let centreY = 0;  // band centre, document space
    let inView = true;
    let ease = 0;     // eased hover factor
    let boost = 0;    // eased scroll-velocity factor
    let nudge = 0;    // eased pointer offset

    const wrap = (v) => ((v % period) + period) % period;

    /* The set is the loop unit, so it must never be narrower than the band or the
       seam shows daylight. Short phrase lists are topped up with copies of their
       own cells — React never re-renders this subtree, so the clones are safe. */
    const measure = () => {
      const cell = sets[0].firstElementChild;
      if (!cell) return;
      const base = sets[0].children.length;
      const unit = cell.getBoundingClientRect().width;
      const need = Math.max(base, unit > 0 ? Math.ceil((viewEl.clientWidth * 1.2) / unit) : base);
      sets.forEach((set) => {
        while (set.children.length < need) set.appendChild(set.firstElementChild.cloneNode(true));
        while (set.children.length > need) set.lastElementChild.remove();
      });
      period = sets[0].getBoundingClientRect().width;
      if (!period) return;
      centreY = viewEl.getBoundingClientRect().top + window.scrollY + viewEl.clientHeight / 2;
      // Re-seat inside the new period: a resize must never expose a seam.
      x = dir === -1 ? -wrap(x) : wrap(x) - period;
      setX(x + nudge);
    };

    measure();
    if (prefersReducedMotion()) return undefined; // static band, content intact

    const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; });
    io.observe(viewEl);
    const ro = new ResizeObserver(measure);
    ro.observe(viewEl);
    ro.observe(trackEl); // re-measure if the phrases themselves change size
    document.fonts?.ready.then(measure);

    const tick = (_time, deltaTime) => {
      if (!inView || !period) return;
      const dt = Math.min(deltaTime, 50) / 1000; // seconds, and safe across a tab switch
      const near = 1 - Math.min(1, Math.abs(state.my - (centreY - window.scrollY)) / REACH);
      nudge += (near * NUDGE * state.nx - nudge) * 0.1;
      // Lenis reports velocity in px/frame; deltaRatio keeps that comparable on 120Hz.
      const v = Math.abs(state.scrollVel) * gsap.ticker.deltaRatio();
      boost += (gsap.utils.clamp(0, 1, v / 17) - boost) * 0.08;
      ease += ((hover.current ? 1 : 0) - ease) * 0.06;
      const step = rate() * (1 - ease * 0.55) * (1 + boost * 0.5) * dt;
      x = dir === -1 ? -wrap(-x + step) : wrap(x + step) - period;
      setX(x + nudge);
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      io.disconnect();
      ro.disconnect();
    };
  }, [speed, reverse]);

  // Every phrase closes on a separator, so the rhythm across the seam is identical
  // to the rhythm inside the set — that is what makes the reset invisible.
  const cells = items.map((t, i) => (
    <span className="marquee__cell" key={i}>
      <span className="marquee__phrase">{t}</span>
      <i className="marquee__sep" aria-hidden="true" />
    </span>
  ));

  return (
    <div
      className={`marquee${outline ? ' is-outline' : ''}`}
      onPointerEnter={() => { if (!state.touch) hover.current = true; }}
      onPointerLeave={() => { hover.current = false; }}
    >
      <p className="sr-only">{items.join(' \u00b7 ')}</p>
      <div className="marquee__viewport" ref={view}>
        <div className="marquee__track display" ref={track} aria-hidden="true">
          <div className="marquee__set">{cells}</div>
          <div className="marquee__set">{cells}</div>
        </div>
      </div>
    </div>
  );
}
