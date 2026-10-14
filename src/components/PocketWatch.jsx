export const fmt = (ms) => {
  const s = Math.floor(ms / 1000);
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};

const ROMAN = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];

function gearPoints(teeth, ro, ri) {
  const n = teeth * 4;
  const pts = [];
  for (let k = 0; k < n; k++) {
    const a = (k / n) * Math.PI * 2;
    const r = k % 4 < 2 ? ro : ri;
    pts.push(`${(r * Math.cos(a)).toFixed(1)},${(r * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(' ');
}
const GEAR_A = gearPoints(12, 34, 28);
const GEAR_B = gearPoints(9, 26, 21);

export default function PocketWatch({ players, times, active, paused, over }) {
  const running = !paused && !over;
  const cx = 120, cy = 150;

  return (
    <div className="watch">
      <svg viewBox="0 0 240 262" className="watch-svg">
        <defs>
          <radialGradient id="faceG" cx="50%" cy="45%" r="60%">
            <stop offset="0" stopColor="#fbf1d4" />
            <stop offset="1" stopColor="#d9c18c" />
          </radialGradient>
          <linearGradient id="goldG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff0a0" />
            <stop offset=".5" stopColor="#d4a537" />
            <stop offset="1" stopColor="#8a6414" />
          </linearGradient>
        </defs>

        {/* crown + bow */}
        <rect x="108" y="22" width="24" height="22" rx="4" fill="url(#goldG)" />
        <circle cx="120" cy="14" r="12" fill="none" stroke="url(#goldG)" strokeWidth="6" />

        {/* case + face */}
        <circle cx={cx} cy={cy} r="104" fill="url(#goldG)" />
        <circle cx={cx} cy={cy} r="94" fill="#3a1a0a" />
        <circle cx={cx} cy={cy} r="90" fill="url(#faceG)" />

        {/* gears */}
        <g transform="translate(88 170)" opacity=".28">
          <polygon points={GEAR_A} fill="#8a6414" className={`gear gear-a ${running ? '' : 'stopped'}`} />
        </g>
        <g transform="translate(150 174)" opacity=".28">
          <polygon points={GEAR_B} fill="#5e0f0f" className={`gear gear-b ${running ? '' : 'stopped'}`} />
        </g>

        {/* ticks */}
        {Array.from({ length: 60 }, (_, k) => {
          const a = (k * 6 * Math.PI) / 180;
          const long = k % 5 === 0;
          const r1 = long ? 80 : 84, r2 = 88;
          return (
            <line key={k}
              x1={cx + r1 * Math.sin(a)} y1={cy - r1 * Math.cos(a)}
              x2={cx + r2 * Math.sin(a)} y2={cy - r2 * Math.cos(a)}
              stroke="#3a1a0a" strokeWidth={long ? 2 : 1} />
          );
        })}

        {/* roman numerals */}
        {ROMAN.map((n, k) => {
          const a = (k * 30 * Math.PI) / 180;
          return (
            <text key={n} x={cx + 66 * Math.sin(a)} y={cy - 66 * Math.cos(a)}
              textAnchor="middle" dominantBaseline="central"
              fontFamily="Cinzel, serif" fontWeight="700" fontSize="14" fill="#3a1a0a">
              {n}
            </text>
          );
        })}

        <text x={cx} y="118" textAnchor="middle" fontFamily="Cinzel, serif" fontSize="8" letterSpacing="3" fill="#6b4a0a">
          TEMPUS FUGIT
        </text>

        {/* one hand per demon: one lap = 60 seconds of their thinking time */}
        {[1, 0].map((i) => (
          <g key={i} style={{
            transform: `rotate(${(times[i] / 1000) * 6}deg)`,
            transformOrigin: `${cx}px ${cy}px`,
            transition: 'transform .2s linear',
          }}>
            <line x1={cx} y1={cy + 14} x2={cx} y2={i === 0 ? 80 : 98}
              stroke={i === 0 ? '#c8362b' : '#15151a'} strokeWidth={i === 0 ? 4 : 5} strokeLinecap="round" />
            <circle cx={cx} cy={i === 0 ? 86 : 104} r="4.5" fill={i === 0 ? '#c8362b' : '#15151a'} />
          </g>
        ))}
        <circle cx={cx} cy={cy} r="7" fill="url(#goldG)" stroke="#3a1a0a" />
      </svg>

      <div className="watch-times">
        {players.map((p, i) => (
          <div key={p.name} className={`wt ${active === i ? 'on' : ''}`}>
            <i className={`dot ${p.color}`} /> {p.name} <b>{fmt(times[i])}</b>
          </div>
        ))}
      </div>
    </div>
  );
}