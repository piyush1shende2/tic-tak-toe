export default function Mark({ symbol }) {
  return (
    <svg viewBox="0 0 100 100" className={`mark mark-${symbol}`}>
      {symbol === 'X' ? (
        <>
          <path d="M24 24 L76 76" pathLength="1" />
          <path d="M76 24 L24 76" pathLength="1" style={{ animationDelay: '.22s' }} />
        </>
      ) : (
        <circle cx="50" cy="50" r="28" pathLength="1" />
      )}
    </svg>
  );
}