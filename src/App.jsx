import { useState } from 'react';
import Menu from './components/Menu';
import Game from './components/Game';
import './game.css';

export default function App() {
  const [config, setConfig] = useState(null);
  const [round, setRound] = useState(0);
  const [scores, setScores] = useState({ red: 0, black: 0, draws: 0 });

  const start = (cfg) => {
    setConfig(cfg);
    setScores({ red: 0, black: 0, draws: 0 });
    setRound((r) => r + 1);
  };

  const onResult = (winnerIdx) =>
    setScores((s) =>
      winnerIdx === null
        ? { ...s, draws: s.draws + 1 }
        : winnerIdx === 0
        ? { ...s, red: s.red + 1 }
        : { ...s, black: s.black + 1 }
    );

  if (!config) return <Menu onStart={start} />;

  return (
    <Game
      key={round}
      config={config}
      scores={scores}
      onResult={onResult}
      onRematch={() => setRound((r) => r + 1)}
      onMenu={() => setConfig(null)}
    />
  );
}