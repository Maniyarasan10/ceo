/* Six full-bleed backgrounds, one per service. Cheap 2D canvas, drawn at low alpha. */
const TAU = Math.PI * 2;
const seeded = (n) => { let a = n; return () => { a = (a * 16807) % 2147483647; return (a - 1) / 2147483646; }; };
const R = seeded(42);
const NODES = Array.from({ length: 46 }, () => ({ x: R(), y: R(), p: R() * TAU, s: 0.2 + R() * 0.5 }));
const BOXES = Array.from({ length: 9 }, () => ({ x: R(), y: R(), w: 0.1 + R() * 0.2, h: 0.08 + R() * 0.18, p: R() * TAU }));

const ai = (c, w, h, t, p, col) => {
  const pts = NODES.map((n) => ({ x: (n.x + Math.sin(t * n.s + n.p) * 0.03) * w, y: (n.y + Math.cos(t * n.s + n.p) * 0.03) * h }));
  c.strokeStyle = col.fg; c.lineWidth = 1; c.globalAlpha *= 0.2; c.beginPath();
  for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) { if (Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y) < Math.min(w, h) * 0.22) { c.moveTo(pts[i].x, pts[i].y); c.lineTo(pts[j].x, pts[j].y); } }
  c.stroke();
  pts.forEach((q, i) => { const near = Math.hypot(q.x - p.x * w, q.y - p.y * h) < 140; c.globalAlpha = near ? 1 : 0.5; c.fillStyle = near ? col.accent : col.fg; c.beginPath(); c.arc(q.x, q.y, near ? 5 : 2.5, 0, TAU); c.fill(); });
};
const web = (c, w, h, t, p, col) => {
  c.strokeStyle = col.fg; c.lineWidth = 1;
  BOXES.forEach((b, i) => {
    const x = (b.x + Math.sin(t * 0.3 + b.p) * 0.02 + (p.x - 0.5) * 0.04 * (i % 3 + 1)) * w; const y = b.y * h;
    c.globalAlpha *= 1; c.globalAlpha = 0.25; c.strokeRect(x, y, b.w * w, b.h * h);
    c.globalAlpha = 0.14; c.beginPath(); c.moveTo(x, y + 18); c.lineTo(x + b.w * w, y + 18);
    for (let k = 0; k < 3; k++) { c.moveTo(x + 12, y + 36 + k * 12); c.lineTo(x + b.w * w * (0.4 + 0.15 * k), y + 36 + k * 12); } c.stroke();
    if (i === 2) { c.globalAlpha = 0.9; c.fillStyle = col.accent; c.fillRect(x + 12, y + b.h * h - 20, 40, 8); }
  });
};
const mobile = (c, w, h, t, p, col) => {
  const pw = Math.min(w * 0.16, 170); const ph = pw * 2;
  for (let i = -2; i <= 2; i++) {
    const x = w / 2 + i * pw * 1.35 + (p.x - 0.5) * 40 * i; const y = h / 2 - ph / 2 + Math.sin(t * 0.8 + i) * 12 + Math.abs(i) * 24;
    c.globalAlpha = 0.3 - Math.abs(i) * 0.05; c.strokeStyle = col.fg; c.lineWidth = 1;
    c.beginPath(); c.roundRect(x - pw / 2, y, pw, ph, 20); c.stroke();
    c.beginPath(); c.moveTo(x - pw * 0.3, y + 36); c.lineTo(x + pw * 0.3, y + 36); c.moveTo(x - pw * 0.3, y + 58); c.lineTo(x + pw * 0.1, y + 58); c.stroke();
    if (i === 0) { c.globalAlpha = 0.9; c.fillStyle = col.accent; c.beginPath(); c.roundRect(x - pw * 0.3, y + ph - 56, pw * 0.6, 26, 13); c.fill(); }
  }
};
const gear = (c, x, y, r, teeth, rot) => {
  c.beginPath();
  for (let i = 0; i < teeth * 2; i++) { const a = rot + (i / (teeth * 2)) * TAU; const rr = i % 2 ? r * 0.86 : r; c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); }
  c.closePath(); c.stroke(); c.beginPath(); c.arc(x, y, r * 0.3, 0, TAU); c.stroke();
};
const automation = (c, w, h, t, p, col) => {
  c.strokeStyle = col.fg; c.lineWidth = 1.2; c.globalAlpha *= 0.3;
  const s = Math.min(w, h);
  gear(c, w * 0.3, h * 0.45, s * 0.2, 14, t * 0.3);
  gear(c, w * 0.3 + s * 0.2 + s * 0.14 + 4, h * 0.45 - s * 0.05, s * 0.13, 9, -t * 0.3 * (14 / 9) + 0.2);
  c.strokeStyle = col.accent; c.globalAlpha = 0.6; gear(c, w * 0.72, h * 0.6, s * 0.16, 11, t * 0.4);
  c.setLineDash([6, 8]); c.lineDashOffset = -t * 30; c.beginPath(); c.moveTo(w * 0.3, h * 0.85); c.bezierCurveTo(w * 0.5, h * 0.95, w * 0.6, h * 0.8, w * 0.72, h * 0.85); c.stroke(); c.setLineDash([]);
};
const iot = (c, w, h, t, p, col) => {
  const nodes = [[0.2, 0.3], [0.7, 0.25], [0.5, 0.7], [0.85, 0.65], [0.12, 0.75]];
  nodes.forEach(([nx, ny], i) => {
    const x = nx * w; const y = ny * h;
    for (let k = 0; k < 3; k++) { const ph = ((t * 0.5 + i * 0.3 + k / 3) % 1); c.globalAlpha = (1 - ph) * 0.4; c.strokeStyle = i === 2 ? col.accent : col.fg; c.lineWidth = 1; c.beginPath(); c.arc(x, y, ph * Math.min(w, h) * 0.3, 0, TAU); c.stroke(); }
    c.globalAlpha = 1; c.fillStyle = i === 2 ? col.accent : col.fg; c.fillRect(x - 4, y - 4, 8, 8);
  });
};
const experience = (c, w, h, t, p, col) => {
  c.lineWidth = 1;
  for (let k = 0; k < 16; k++) {
    c.beginPath(); c.strokeStyle = k === 8 ? col.accent : col.fg; c.globalAlpha = k === 8 ? 0.9 : 0.2 + (k / 16) * 0.15;
    for (let x = 0; x <= w; x += 12) { const y = h * 0.5 + Math.sin(x * 0.004 + t * 0.6 + k * 0.28) * h * 0.18 * (1 + (p.y - 0.5)) + (k - 8) * 16 * Math.cos(x * 0.002 + t * 0.3); x ? c.lineTo(x, y) : c.moveTo(x, y); }
    c.stroke();
  }
};
export const drawers = [ai, web, mobile, automation, iot, experience];
