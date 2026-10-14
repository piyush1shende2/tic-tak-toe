import { useEffect, useState } from 'react';

export default function Coin({ onDone }) {
  const [result] = useState(() => (Math.random() < 0.5 ? 'X' : 'O'));
  const [spin, setSpin] = useState(0);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const t0 = setTimeout(() => setSpin(360 * 7 + (result === 'O' ? 180 : 0)), 60);
    const t1 = setTimeout(() => setShown(true), 2700);
    const t2 = setTimeout(() => onDone(result), 4000);
    return () => [t0, t1, t2].forEach(clearTimeout);
    // eslint-disable-next-line
  }, []);

  return (
    <div className="coin-stage">
      <div className="coin-toss">
        <div className="coin" style={{ transform: `rotateX(${spin}deg)` }}>
          <div className="coin-face front"><span>X</span></div>
          <div className="coin-face back"><span>O</span></div>
        </div>
      </div>
      <p className="coin-text">{shown ? `The coin has chosen ${result}!` : 'Tossing the royal coin…'}</p>
    </div>
  );
}