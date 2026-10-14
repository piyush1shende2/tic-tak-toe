const COLORS = {
  gold:   { main: '#f4c430', dark: '#9a6f12', light: '#fff3a8' },
  silver: { main: '#d9dde2', dark: '#6f7780', light: '#ffffff' },
};

// drawn around (0,0): tip at y=-26, shaft ends at y=145
export function TridentShape({ variant = 'gold' }) {
  const c = COLORS[variant];
  return (
    <g stroke={c.dark} strokeWidth="1.2" strokeLinejoin="round">
      <rect x="-2.5" y="30" width="5" height="115" rx="2.5" fill={c.main} />
      <path d="M0 -26 L6 -8 L2.5 -8 L2.5 34 L-2.5 34 L-2.5 -8 L-6 -8 Z" fill={c.main} />
      <path d="M-17 -14 L-11 2 L-14.5 2 L-14.5 16 Q-14.5 26 -2 27 L-2 32 Q-19.5 31 -19.5 16 L-19.5 2 L-23 2 Z" fill={c.main} />
      <path d="M17 -14 L11 2 L14.5 2 L14.5 16 Q14.5 26 2 27 L2 32 Q19.5 31 19.5 16 L19.5 2 L23 2 Z" fill={c.main} />
      <rect x="-4" y="28" width="8" height="4" rx="1" fill={c.light} />
    </g>
  );
}

// the flying version used for "Throw & Mark"
export function TridentProjectile({ variant = 'gold' }) {
  return (
    <svg viewBox="-26 -28 52 176">
      <TridentShape variant={variant} />
    </svg>
  );
}