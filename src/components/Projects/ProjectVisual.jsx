import { useMemo } from 'react';
import { mulberry32 } from '../../utils/split';

const W = 800; const H = 600;

/** Procedural SVG artwork: one distinct visual language per project, no image assets needed. */
export default function ProjectVisual({ pattern, seed = 1 }) {
  const nodes = useMemo(() => {
    const r = mulberry32(seed * 977);
    switch (pattern) {
      case 'agri': return { rows: Array.from({ length: 16 }, (_, i) => i) };
      case 'aura': return { rings: Array.from({ length: 14 }, (_, i) => i) };
      case 'community': {
        const pts = Array.from({ length: 34 }, () => [60 + r() * (W - 120), 60 + r() * (H - 120), 2 + r() * 5]);
        const links = [];
        pts.forEach((a, i) => pts.forEach((b, j) => { if (j > i && Math.hypot(a[0] - b[0], a[1] - b[1]) < 130) links.push([a, b]); }));
        return { pts, links };
      }
      case 'crm': return { bars: Array.from({ length: 9 }, (_, i) => ({ w: 640 - i * 62 - r() * 40, y: 70 + i * 52 })) };
      case 'boowa': return { bubbles: Array.from({ length: 26 }, () => ({ x: r() * W, y: r() * H, r: 14 + r() * 70 })) };
      default: return { cells: Array.from({ length: 12 * 9 }, (_, i) => ({ x: (i % 12) * 62 + 48, y: Math.floor(i / 12) * 62 + 48, s: r() })) };
    }
  }, [pattern, seed]);

  const stroke = { stroke: 'currentColor', strokeWidth: 1.2, fill: 'none', vectorEffect: 'non-scaling-stroke' };
  let art = null;
  if (pattern === 'agri') {
    art = (
      <g {...stroke}>
        {nodes.rows.map((i) => {
          const t = i / 15; const y = 210 + t * t * 380;
          return <path key={i} d={`M0 ${y} C 200 ${y - 40 + t * 30}, 600 ${y + 40 - t * 30}, 800 ${y}`} opacity={0.25 + t * 0.7} />;
        })}
        {Array.from({ length: 19 }, (_, i) => <line key={i} x1={400} y1={190} x2={-200 + i * 66} y2={600} opacity="0.35" />)}
        <circle cx="400" cy="120" r="54" stroke="var(--accent)" strokeWidth="2" />
        <circle cx="400" cy="120" r="14" fill="var(--accent)" stroke="none" />
      </g>
    );
  } else if (pattern === 'aura') {
    art = (
      <g {...stroke}>
        {nodes.rings.map((i) => <circle key={i} cx={400 + i * 9} cy={300 - i * 3} r={24 + i * 22} opacity={0.2 + (i / 14) * 0.7} />)}
        <circle cx="400" cy="300" r="14" fill="var(--accent)" stroke="none" />
        <circle cx="400" cy="300" r="46" stroke="var(--accent)" strokeWidth="2" />
      </g>
    );
  } else if (pattern === 'community') {
    art = (
      <g {...stroke}>
        {nodes.links.map(([a, b], i) => <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} opacity="0.45" />)}
        {nodes.pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={p[2]} fill={i % 7 === 0 ? 'var(--accent)' : 'currentColor'} stroke="none" />)}
      </g>
    );
  } else if (pattern === 'crm') {
    art = (
      <g {...stroke}>
        {nodes.bars.map((b, i) => (
          <g key={i}>
            <rect x={80} y={b.y} width={b.w} height={34} opacity={0.35 + (i / 9) * 0.5} fill={i === 3 ? 'var(--accent)' : 'none'} stroke={i === 3 ? 'none' : 'currentColor'} />
            <line x1={80} y1={b.y + 46} x2={80 + b.w * 0.6} y2={b.y + 46} opacity="0.2" />
          </g>
        ))}
      </g>
    );
  } else if (pattern === 'boowa') {
    art = (
      <g {...stroke}>
        {nodes.bubbles.map((b, i) => <circle key={i} cx={b.x} cy={b.y} r={b.r} opacity={0.3 + (b.r / 90) * 0.6} fill={i === 5 ? 'var(--accent)' : 'none'} stroke={i === 5 ? 'none' : 'currentColor'} />)}
      </g>
    );
  } else {
    art = (
      <g {...stroke}>
        {nodes.cells.map((c, i) => {
          const s = 4 + c.s * 22;
          return i % 17 === 0
            ? <rect key={i} x={c.x - s / 2} y={c.y - s / 2} width={s} height={s} fill="var(--accent)" stroke="none" />
            : <g key={i} opacity={0.3 + c.s * 0.6}><line x1={c.x - s} y1={c.y} x2={c.x + s} y2={c.y} /><line x1={c.x} y1={c.y - s} x2={c.x} y2={c.y + s} /></g>;
        })}
      </g>
    );
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" role="img" aria-label={`Generative artwork for the ${pattern} project`} className="pvisual">
      {art}
    </svg>
  );
}
