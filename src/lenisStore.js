let lenis = null;
export const setLenis = (l) => { lenis = l; };
export const getLenis = () => lenis;

export function scrollToEl(el, { immediate = false, offset = 0 } = {}) {
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { immediate, force: immediate, offset });
  else {
    const y = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top: y, behavior: immediate ? 'auto' : 'smooth' });
  }
}
export const stopScroll = () => { lenis ? lenis.stop() : (document.body.style.overflow = 'hidden'); };
export const startScroll = () => { lenis ? lenis.start() : (document.body.style.overflow = ''); };
