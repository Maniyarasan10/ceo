import gsap from 'gsap';

/** Magnetic pull for any [data-magnetic] element. Returns a cleanup. */
export function initMagnetic() {
  let el = null;
  const release = () => {
    if (!el) return;
    gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)', overwrite: 'auto' });
    el = null;
  };
  const over = (e) => {
    const t = e.target.closest?.('[data-magnetic]');
    if (t && t !== el) { release(); el = t; }
  };
  const move = (e) => {
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2 - gsap.getProperty(el, 'x');
    const cy = r.top + r.height / 2 - gsap.getProperty(el, 'y');
    const dx = e.clientX - cx; const dy = e.clientY - cy;
    if (Math.abs(dx) > r.width * 0.85 || Math.abs(dy) > r.height * 1.1) { release(); return; }
    const s = parseFloat(el.dataset.magnetic) || 0.35;
    gsap.to(el, { x: dx * s, y: dy * s, duration: 0.45, ease: 'power3.out', overwrite: 'auto' });
  };
  document.addEventListener('mouseover', over);
  document.addEventListener('mousemove', move);
  return () => {
    document.removeEventListener('mouseover', over);
    document.removeEventListener('mousemove', move);
    release();
  };
}
