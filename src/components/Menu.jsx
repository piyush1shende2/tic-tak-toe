import { useState } from 'react';
import Demon from './Demon';
import Coin from './Coin';

const MODES = [
  { id: 'pvp', icon: '👤 vs 👤', title: 'User vs User', text: 'Two mortals, one board' },
  { id: 'pva', icon: '👤 vs 🤖', title: 'User vs AI', text: 'Face the machine' },
  { id: 'ava', icon: '🤖 vs 🤖', title: 'AI vs AI', text: 'Sit back and watch' },
];

const LEVELS = [
  { id: 'easy', icon: '😇', title: 'Easy', text: 'Plays at random' },
  { id: 'medium', icon: '😈', title: 'Medium', text: 'Wins & blocks sometimes' },
  { id: 'hard', icon: '👹', title: 'Hard', text: 'Unbeatable' },
];

export default function Menu({ onStart }) {
  const [step, setStep] = useState('home');
  const [mode, setMode] = useState(null);
  const [level, setLevel] = useState('medium');
  const [tossing, setTossing] = useState(false);

  const begin = (p1Symbol, lvl = level) => onStart({ mode, level: lvl, p1Symbol });

  const chooseMode = (m) => {
    setMode(m);
    setStep(m === 'pvp' ? 'symbol' : 'level');
  };

  const chooseLevel = (l) => {
    setLevel(l);
    if (mode === 'ava') onStart({ mode, level: l, p1Symbol: 'X' });
    else setStep('symbol');
  };

  if (tossing) {
    return (
      <div className="menu">
        <h2 className="step-title">Fate decides…</h2>
        <Coin onDone={(s) => begin(s)} />
      </div>
    );
  }

  return (
    <div className="menu">
      {step === 'home' && (
        <>
          <p className="tagline">⚜ A Game of Crosses &amp; Circles ⚜</p>
          <h1 className="title">Heaven <span>vs</span> Hell</h1>
          <div className="menu-demons">
            <Demon color="red" mood="excited" />
            <Demon color="black" mood="scared" flip />
          </div>
          <p className="realms">☁ The victor ascends to Heaven · 🔥 The vanquished falls to Hell</p>
          <button className="btn big" onClick={() => setStep('mode')}>Start</button>
        </>
      )}

      {step === 'mode' && (
        <>
          <h2 className="step-title">Choose your battle</h2>
          <div className="cards">
            {MODES.map((m) => (
              <button key={m.id} className="card" onClick={() => chooseMode(m.id)}>
                <span className="card-icon">{m.icon}</span>
                <strong>{m.title}</strong>
                <small>{m.text}</small>
              </button>
            ))}
          </div>
          <button className="back-link" onClick={() => setStep('home')}>← Back</button>
        </>
      )}

      {step === 'level' && (
        <>
          <h2 className="step-title">How cunning is the AI?</h2>
          <div className="cards">
            {LEVELS.map((l) => (
              <button key={l.id} className="card" onClick={() => chooseLevel(l.id)}>
                <span className="card-icon">{l.icon}</span>
                <strong>{l.title}</strong>
                <small>{l.text}</small>
              </button>
            ))}
          </div>
          <button className="back-link" onClick={() => setStep('mode')}>← Back</button>
        </>
      )}

      {step === 'symbol' && (
        <>
          <h2 className="step-title">
            {mode === 'pvp' ? 'Player 1 (Ruby, the red demon)' : 'You play as Ruby, the red demon'}
            <br />— choose your mark
          </h2>
          <div className="symbols">
            <button className="symbol-btn x" onClick={() => begin('X')}>X</button>
            <button className="symbol-btn o" onClick={() => begin('O')}>O</button>
          </div>
          <button className="btn" onClick={() => setTossing(true)}>🪙 Random (toss a coin)</button>
          <p className="hint">X always moves first.</p>
          <button className="back-link" onClick={() => setStep(mode === 'pvp' ? 'mode' : 'level')}>← Back</button>
        </>
      )}
    </div>
  );
}