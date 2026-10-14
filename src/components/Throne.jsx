export default function Throne({ flip = false }) {
  return (
    <svg viewBox="0 0 220 260" className="throne" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      <path d="M48 252 L48 62 Q48 22 110 14 Q172 22 172 62 L172 252 Z" fill="#46101d" stroke="#c9a24b" strokeWidth="5" />
      <path d="M62 240 L62 68 Q62 36 110 29 Q158 36 158 68 L158 240 Z" fill="#6b1a2d" stroke="#c9a24b" strokeWidth="1.5" />
      <path d="M90 20 L96 2 L110 14 L124 2 L130 20 Z" fill="#c9a24b" />
      <circle cx="110" cy="52" r="8" fill="#ffd76a" stroke="#8a6414" />
      <rect x="38" y="226" width="144" height="22" rx="6" fill="#7a1f35" stroke="#c9a24b" strokeWidth="3" />
      <rect x="46" y="246" width="12" height="12" fill="#8a6a2a" />
      <rect x="162" y="246" width="12" height="12" fill="#8a6a2a" />
      {[70, 90, 130, 150].map((x) => (
        <circle key={x} cx={x} cy="237" r="2.5" fill="#ffd76a" />
      ))}
    </svg>
  );
}