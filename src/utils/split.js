/** Tags with no implicit ARIA role, so aria-label needs role="text" to be legal. */
const GENERIC_TAGS = new Set(['SPAN', 'DIV', 'P']);

/** Split an element's text into word > char spans. Idempotent (safe to call twice). */
export function splitText(el, { chars = true } = {}) {
  if (!el) return { words: [], chars: [] };
  // reuse the cached string only while the element is still split; otherwise take the live text
  const split = !!el.querySelector(':scope > .word');
  const text = split ? el.dataset.text : el.textContent;
  el.dataset.text = text;
  // The per-char spans below are aria-hidden, so the host needs an explicit name.
  // aria-label is only legal on a generic element here, so role="text" is added to
  // bare inline/block wrappers only - never to <h2>/<button>, which already carry an
  // implicit role and where role="text" would itself be an axe violation.
  if (GENERIC_TAGS.has(el.tagName)) el.setAttribute('role', 'text');
  el.setAttribute('aria-label', text);
  el.textContent = '';
  const words = [];
  const allChars = [];
  text.split(' ').forEach((w, wi, arr) => {
    const word = document.createElement('span');
    word.className = 'word';
    word.setAttribute('aria-hidden', 'true');
    if (chars) {
      [...w].forEach((c) => {
        const ch = document.createElement('span');
        ch.className = 'char';
        ch.textContent = c;
        word.appendChild(ch);
        allChars.push(ch);
      });
    } else {
      word.textContent = w;
    }
    el.appendChild(word);
    words.push(word);
    if (wi < arr.length - 1) {
      const sp = document.createElement('span');
      sp.className = 'space';
      sp.setAttribute('aria-hidden', 'true');
      el.appendChild(sp);
    }
  });
  return { words, chars: allChars };
}

export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const pad = (n, l = 2) => String(n).padStart(l, '0');

export function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}
