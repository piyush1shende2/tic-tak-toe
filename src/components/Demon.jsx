import { TridentShape } from './Trident';

const PALETTE = {
  red: {
    body: '#c8362b', dark: '#7d1a15', belly: '#ee7a63', wing: '#a32424',
    wingDark: '#5e0f0f', horn: '#2a2a2a', iris: '#3b8fe0', trident: 'silver',
  },
  black: {
    body: '#3a3a42', dark: '#141417', belly: '#5d5d68', wing: '#2a2a30',
    wingDark: '#0e0e10', horn: '#8a7560', iris: '#e0322e', trident: 'gold',
  },
};

const SPARK = 'M0 -7 L2 -2 L7 0 L2 2 L0 7 L-2 2 L-7 0 L-2 -2 Z';

function Face({ mood, p }) {
  if (mood === 'sleep') {
    return (
      <g fill="none" stroke="#111" strokeWidth="3" strokeLinecap="round">
        <path d="M81 99 Q92 108 103 99" />
        <path d="M117 99 Q128 108 139 99" />
        <ellipse cx="110" cy="122" rx="4" ry="3" fill="#5a1010" stroke="none" />
      </g>
    );
  }
  const scared = mood === 'scared' || mood === 'startled';
  const excited = mood === 'excited';
  const r = scared || excited ? 12.5 : 11;

  return (
    <g>
      {/* cheeks */}
      <circle cx="78" cy="113" r="7" fill="#ff9aa2" opacity=".35" />
      <circle cx="142" cy="113" r="7" fill="#ff9aa2" opacity=".35" />

      {/* eyes */}
      {[92, 128].map((x) => (
        <g key={x}>
          <circle cx={x} cy="98" r={r} fill="#fff" stroke="#111" strokeWidth="1.5" />
          {scared ? (
            <circle cx={x} cy="98" r="2.8" fill="#111" />
          ) : (
            <>
              <circle cx={x + (x < 110 ? 1 : -1)} cy="99" r={excited ? 8 : 6.5} fill={p.iris} />
              <circle cx={x + (x < 110 ? 1 : -1)} cy="99" r="3.2" fill="#111" />
              <circle cx={x + (x < 110 ? 3.5 : 1.5)} cy="95.5" r="2" fill="#fff" />
            </>
          )}
        </g>
      ))}

      {/* brows */}
      {scared && (
        <g stroke="#111" strokeWidth="3" strokeLinecap="round">
          <path d="M80 86 L102 78" />
          <path d="M140 86 L118 78" />
        </g>
      )}
      {excited && (
        <g stroke="#111" strokeWidth="3" strokeLinecap="round" fill="none">
          <path d="M82 80 Q92 73 102 80" />
          <path d="M118 80 Q128 73 138 80" />
        </g>
      )}

      {/* mouth */}
      {mood === 'happy' && (
        <>
          <path d="M98 117 Q110 129 122 117" fill="none" stroke="#111" strokeWidth="3" strokeLinecap="round" />
          <path d="M101 119 L104.5 126 L108 120 Z" fill="#fff" />
          <path d="M119 119 L115.5 126 L112 120 Z" fill="#fff" />
        </>
      )}
      {excited && (
        <>
          <path d="M94 113 Q110 140 126 113 Z" fill="#5a1010" stroke="#111" strokeWidth="2" />
          <ellipse cx="110" cy="127" rx="7" ry="4" fill="#ff7a8a" />
          <path d="M99 113 L102 120 L105 113 Z" fill="#fff" />
          <path d="M121 113 L118 120 L115 113 Z" fill="#fff" />
        </>
      )}
      {mood === 'scared' && (
        <path d="M95 124 q4 -6 8 0 t8 0 t8 0 t8 0" fill="none" stroke="#111" strokeWidth="3" strokeLinecap="round" />
      )}
      {mood === 'startled' && (
        <ellipse cx="110" cy="124" rx="6" ry="8" fill="#5a1010" stroke="#111" strokeWidth="2" />
      )}

      {/* sweat drop */}
      {scared && (
        <path d="M148 66 Q153 76 148 82 Q143 76 148 66 Z" fill="#7fd4ff" stroke="#2a7fb0" />
      )}

      {/* sparkles */}
      {excited && (
        <g fill="#ffe27a">
          <path className="sparkle" d={SPARK} transform="translate(56 70)" />
          <path className="sparkle" d={SPARK} transform="translate(166 62) scale(.8)" style={{ animationDelay: '.3s' }} />
        </g>
      )}
    </g>
  );
}

export default function Demon({
  color = 'red', mood = 'happy', pose = 'sit',
  hasTrident = true, halo = false, damned = false, flip = false,
}) {
  const p = PALETTE[color];
  const wing = (
    <>
      <path
        d="M80 130 C70 80 40 45 4 52 C16 60 18 72 16 82 C27 78 36 84 38 95 C48 90 58 98 60 110 C68 108 76 114 82 126 Z"
        fill={p.wing} stroke={p.wingDark} strokeWidth="2" strokeLinejoin="round"
      />
      <path d="M80 130 L8 54 M80 130 L18 84 M80 130 L40 98" stroke={p.wingDark} strokeWidth="2" fill="none" />
    </>
  );

  return (
    <div className={`demon pose-${pose} mood-${mood} ${damned ? 'damned' : ''}`}>
      <div className="demon-flip" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
        <svg viewBox="0 0 220 260" className="demon-svg">
          <ellipse cx="110" cy="250" rx="55" ry="8" fill="rgba(0,0,0,.35)" />

          {/* wings */}
          <g className="wing-l">{wing}</g>
          <g className="wing-r">
            <g transform="translate(220 0) scale(-1 1)">{wing}</g>
          </g>

          {/* tail */}
          <g className="tail">
            <path d="M140 195 Q192 205 186 162" fill="none" stroke={p.body} strokeWidth="7" strokeLinecap="round" />
            <path d="M177 165 L186 146 L195 165 Z" fill={p.dark} />
          </g>

          {/* legs + feet */}
          <ellipse cx="88" cy="214" rx="20" ry="22" fill={p.body} stroke={p.dark} strokeWidth="2" />
          <ellipse cx="132" cy="214" rx="20" ry="22" fill={p.body} stroke={p.dark} strokeWidth="2" />
          <ellipse cx="84" cy="240" rx="18" ry="9" fill={p.dark} />
          <ellipse cx="136" cy="240" rx="18" ry="9" fill={p.dark} />

          {/* body */}
          <ellipse cx="110" cy="170" rx="40" ry="46" fill={p.body} stroke={p.dark} strokeWidth="2" />
          <ellipse cx="110" cy="180" rx="26" ry="32" fill={p.belly} opacity=".55" />

          {/* resting arm */}
          <path d="M80 150 Q62 170 68 192" stroke={p.body} strokeWidth="15" fill="none" strokeLinecap="round" />
          <circle cx="68" cy="195" r="8" fill={p.body} stroke={p.dark} strokeWidth="2" />

          {/* horns + ears */}
          <path d="M78 72 C66 50 70 32 82 24 C82 40 90 52 96 64 Z" fill={p.horn} stroke="#000" strokeWidth="1.5" />
          <path d="M142 72 C154 50 150 32 138 24 C138 40 130 52 124 64 Z" fill={p.horn} stroke="#000" strokeWidth="1.5" />
          <path d="M66 92 L44 78 L68 74 Z" fill={p.body} stroke={p.dark} strokeWidth="2" strokeLinejoin="round" />
          <path d="M154 92 L176 78 L152 74 Z" fill={p.body} stroke={p.dark} strokeWidth="2" strokeLinejoin="round" />

          {/* head */}
          <ellipse cx="110" cy="98" rx="48" ry="42" fill={p.body} stroke={p.dark} strokeWidth="2" />
          <Face mood={mood} p={p} />

          {halo && (
            <ellipse cx="110" cy="12" rx="30" ry="7" fill="none" stroke="#ffd84a" strokeWidth="5"
              style={{ filter: 'drop-shadow(0 0 6px #fff3a0)' }} />
          )}

          {/* weapon arm */}
          <g className="arm-r">
            <path d="M140 150 Q158 160 162 178" stroke={p.body} strokeWidth="15" fill="none" strokeLinecap="round" />
            {hasTrident && (
              <g className="trident-g">
                <g transform="translate(162 100)">
                  <TridentShape variant={p.trident} />
                </g>
              </g>
            )}
            <circle cx="162" cy="178" r="9" fill={p.body} stroke={p.dark} strokeWidth="2" />
          </g>
        </svg>
      </div>

      {mood === 'sleep' && (
        <div className="zzz"><span>Z</span><span>z</span><span>Z</span></div>
      )}
    </div>
  );
}