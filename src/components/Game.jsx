import { useEffect, useRef, useState } from 'react';
import Demon from './Demon';
import Throne from './Throne';
import Board from './Board';
import PocketWatch, { fmt } from './PocketWatch';
import { TridentProjectile } from './Trident';
import { chooseAiMove, getWinner, hasOpenTwo, isFull, other } from '../utils/gameLogic';

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const done = (anim) => anim.finished.catch(() => {});
const centerOf = (el, root) => {
  const r = el.getBoundingClientRect();
  const s = root.getBoundingClientRect();
  return { x: r.left - s.left + r.width / 2, y: r.top - s.top + r.height / 2 };
};

function buildPlayers({ mode, p1Symbol }) {
  return [
    { name: 'Ruby', color: 'red', symbol: p1Symbol, type: mode === 'ava' ? 'ai' : 'human' },
    { name: 'Onyx', color: 'black', symbol: other(p1Symbol), type: mode === 'pvp' ? 'human' : 'ai' },
  ];
}

export default function Game({ config, scores, onResult, onRematch, onMenu }) {
  const [players] = useState(() => buildPlayers(config));

  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState('X');
  const [winLine, setWinLine] = useState(null);
  const [over, setOver] = useState(false);
  const [result, setResult] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [busy, setBusy] = useState(false);
  const [target, setTarget] = useState(null);
  const [paused, setPaused] = useState(false);
  const [wakePhase, setWakePhase] = useState(null); // null | 'slap' | 'wake'
  const [styles, setStyles] = useState(['throw', 'throw']); // per player: 'throw' | 'go'
  const [poses, setPoses] = useState(['sit', 'sit']);
  const [tridents, setTridents] = useState([true, true]);
  const [times, setTimes] = useState([0, 0]);

  const boardRef = useRef(Array(9).fill(null));
  const turnRef = useRef('X');
  const stylesRef = useRef(styles);
  stylesRef.current = styles;
  const outcomeRef = useRef(null);
  const aliveRef = useRef(true);
  const sceneRef = useRef(null);
  const heavenRef = useRef(null);
  const hellRef = useRef(null);
  const cellRefs = useRef([]);
  const demonRefs = useRef([null, null]);
  const projRefs = useRef([null, null]);

  useEffect(() => {
    aliveRef.current = true;
    return () => { aliveRef.current = false; };
  }, []);

  const playerIdx = (sym) => players.findIndex((p) => p.symbol === sym);
  const setPose = (i, v) => setPoses((p) => p.map((x, k) => (k === i ? v : x)));
  const setTrident = (i, v) => setTridents((p) => p.map((x, k) => (k === i ? v : x)));
  const setStyle = (i, v) => setStyles((p) => p.map((x, k) => (k === i ? v : x)));

  /* ---------- timers (each demon's thinking time) ---------- */
  useEffect(() => {
    if (paused || over) return;
    let last = performance.now();
    const id = setInterval(() => {
      const now = performance.now();
      const dt = now - last;
      last = now;
      const idx = players.findIndex((p) => p.symbol === turnRef.current);
      setTimes((t) => t.map((v, k) => (k === idx ? v + dt : v)));
    }, 200);
    return () => clearInterval(id);
    // eslint-disable-next-line
  }, [paused, over]);

  /* ---------- board update ---------- */
  const place = (i, sym) => {
    const nb = boardRef.current.slice();
    nb[i] = sym;
    boardRef.current = nb;
    setBoard(nb);
    const w = getWinner(nb);
    if (w) {
      setWinLine(w.line);
      setOver(true);
      return { type: 'win', symbol: sym, line: w.line };
    }
    if (isFull(nb)) {
      setOver(true);
      return { type: 'draw' };
    }
    return null;
  };

  /* ---------- animation: THROW & MARK ---------- */
  const flyTrident = async (pi, cellIdx, onHit) => {
    const scene = sceneRef.current.getBoundingClientRect();
    const proj = projRefs.current[pi];
    const d = demonRefs.current[pi].getBoundingClientRect();
    const c = cellRefs.current[cellIdx].getBoundingClientRect();

    const sx = d.left - scene.left + d.width * (pi === 1 ? 0.255 : 0.745);
    const sy = d.top - scene.top + d.height * 0.47;
    const tx = c.left - scene.left + c.width / 2;
    const ty = c.top - scene.top + c.height / 2;
    const ang = Math.atan2(ty - sy, tx - sx);
    const rot = (ang * 180) / Math.PI + 90;
    const W = proj.offsetWidth;
    const H = proj.offsetHeight;
    const ex = tx - Math.cos(ang) * H * 0.4;
    const ey = ty - Math.sin(ang) * H * 0.4;
    const at = (x, y, r, s) => `translate(${x - W / 2}px, ${y - H / 2}px) rotate(${r}deg) scale(${s})`;

    const fly = proj.animate(
      [
        { transform: at(sx, sy, 0, 0.8), opacity: 1, offset: 0 },
        { transform: at((sx + ex) / 2, Math.min(sy, ey) - 70, rot, 1), opacity: 1, offset: 0.5 },
        { transform: at(ex, ey, rot, 1), opacity: 1, offset: 1 },
      ],
      { duration: 750, easing: 'ease-in', fill: 'forwards' }
    );
    await done(fly);
    onHit();
    const fade = proj.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, delay: 150, fill: 'forwards' });
    await done(fade);
    fly.cancel();
    fade.cancel();
  };

  const throwMark = async (pi, i, onHit) => {
    setPose(pi, 'throw');
    await wait(560);
    if (!aliveRef.current) return;
    setTrident(pi, false);
    await flyTrident(pi, i, onHit);
    if (!aliveRef.current) return;
    await wait(250);
    setPose(pi, 'sit');
    setTrident(pi, true);
    await wait(300);
  };

  /* ---------- animation: GO & MARK ---------- */
  const goMark = async (pi, i, onHit) => {
    const el = demonRefs.current[pi];
    const scene = sceneRef.current;
    const d = centerOf(el, scene);
    const c = centerOf(cellRefs.current[i], scene);
    const dx = c.x - d.x;
    const dy = c.y - d.y - 30;
    const far = `translate(${dx}px, ${dy}px) scale(.55)`;

    setPose(pi, 'stand'); // gets up from the chair
    await wait(480);
    if (!aliveRef.current) return;

    setPose(pi, 'walk');
    const go = el.animate(
      [{ transform: 'translate(0px,0px) scale(1)' }, { transform: far }],
      { duration: 1000, easing: 'ease-in-out', fill: 'forwards' }
    );
    await done(go);
    if (!aliveRef.current) return;

    setPose(pi, 'stamp');
    await wait(380);
    onHit();
    await wait(450);
    if (!aliveRef.current) return;

    setPose(pi, 'walk');
    const back = el.animate(
      [{ transform: far }, { transform: 'translate(0px,0px) scale(1)' }],
      { duration: 900, easing: 'ease-in-out', fill: 'forwards' }
    );
    await done(back);
    go.cancel();
    back.cancel();
    setPose(pi, 'sit'); // back in the chair
    await wait(250);
  };

  /* ---------- heaven / hell finale ---------- */
  const flyDemon = async (idx, targetEl, dir) => {
    const el = demonRefs.current[idx];
    const d = centerOf(el, sceneRef.current);
    const t = centerOf(targetEl, sceneRef.current);
    const dx = t.x - d.x;
    const dy = t.y - d.y;
    const up = dir === 'up';
    const a = el.animate(
      [
        { transform: 'translate(0px,0px) scale(1) rotate(0deg)' },
        { transform: `translate(${dx * 0.5}px, ${dy * 0.5 + (up ? 10 : -20)}px) scale(.8) rotate(${up ? 120 : -240}deg)`, offset: 0.5 },
        { transform: `translate(${dx}px, ${dy}px) scale(${up ? 0.55 : 0.5}) rotate(${up ? 360 : -720}deg)` },
      ],
      { duration: up ? 2200 : 1700, easing: up ? 'ease-in-out' : 'cubic-bezier(.5,0,1,.7)', fill: 'forwards' }
    );
    await done(a);
  };

  const endSequence = async (out) => {
    setResult(out);
    await wait(500);
    if (!aliveRef.current) return;
    if (out.type === 'win') {
      const wi = playerIdx(out.symbol);
      const li = 1 - wi;
      setPose(wi, 'fly');
      setPose(li, 'fall');
      await Promise.all([
        flyDemon(wi, heavenRef.current, 'up'),
        flyDemon(li, hellRef.current, 'down'),
      ]);
      onResult(wi);
    } else {
      await wait(1200);
      onResult(null);
    }
    if (!aliveRef.current) return;
    setShowBanner(true);
  };

  /* ---------- one full move (human or AI) ---------- */
  const play = async (i) => {
    const sym = turnRef.current;
    const pi = playerIdx(sym);
    setBusy(true);
    setTarget(i);
    outcomeRef.current = null;
    const onHit = () => { outcomeRef.current = place(i, sym); };

    if (stylesRef.current[pi] === 'throw') await throwMark(pi, i, onHit);
    else await goMark(pi, i, onHit);
    if (!aliveRef.current) return;

    setTarget(null);
    if (outcomeRef.current) {
      await endSequence(outcomeRef.current);
    } else {
      const nt = other(sym);
      turnRef.current = nt;
      setTurn(nt);
    }
    if (!aliveRef.current) return;
    setBusy(false);
  };

  const curIdx = playerIdx(turn);
  const cur = players[curIdx];
  const canPlay = !busy && !paused && !over && cur.type === 'human';

  const handleCell = (i) => {
    if (!canPlay || boardRef.current[i]) return;
    play(i);
  };

  /* ---------- AI turns ---------- */
  useEffect(() => {
    if (over || busy || paused || wakePhase) return;
    if (cur.type !== 'ai') return;
    const t = setTimeout(() => {
      play(chooseAiMove(boardRef.current, cur.symbol, config.level));
    }, 900);
    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, [turn, busy, paused, wakePhase, over]);

  /* ---------- pause / resume ---------- */
  const pause = () => {
    if (busy || over || paused) return;
    setPaused(true);
  };
  const resume = async () => {
    if (wakePhase) return;
    setWakePhase('slap');
    await wait(600);
    if (!aliveRef.current) return;
    setWakePhase('wake');
    await wait(800);
    if (!aliveRef.current) return;
    setWakePhase(null);
    setPaused(false);
  };

  /* ---------- moods ---------- */
  const moodOf = (i) => {
    if (paused) return wakePhase === 'wake' ? 'startled' : 'sleep';
    if (result) {
      if (result.type === 'draw') return 'scared';
      return players[i].symbol === result.symbol ? 'excited' : 'scared';
    }
    const me = players[i].symbol;
    if (hasOpenTwo(board, me)) return 'excited';          // heaven is near!
    if (hasOpenTwo(board, other(me))) return 'scared';    // hell is near!
    return 'happy';
  };

  /* ---------- status text ---------- */
  let status;
  if (result?.type === 'win') status = `${players[playerIdx(result.symbol)].name} wins — off to Heaven! ☁`;
  else if (result?.type === 'draw') status = 'A draw — both stuck in purgatory';
  else if (paused) status = 'The demons are napping… 💤';
  else if (busy) status = `${cur.name} is on the move…`;
  else if (cur.type === 'ai') status = `${cur.name} (AI) is scheming…`;
  else status = `${cur.name}'s turn — place your ${cur.symbol}`;

  const renderSeat = (i) => {
    const p = players[i];
    const active = !over && turn === p.symbol;
    const winner = result?.type === 'win' && result.symbol === p.symbol;
    const loser = result?.type === 'win' && result.symbol !== p.symbol;
    return (
      <aside className={`seat seat-${i} ${active ? 'active' : ''}`}>
        <div className="seat-name">
          <i className={`dot ${p.color}`} /> {p.name}
          <span className="badge">{p.symbol}</span>
          <span className="badge soft">{p.type === 'ai' ? 'AI' : 'Human'}</span>
        </div>

        <div className="seat-stage">
          <Throne flip={i === 1} />
          <div className="demon-wrap" ref={(el) => (demonRefs.current[i] = el)}>
            <Demon
              color={p.color}
              mood={moodOf(i)}
              pose={poses[i]}
              hasTrident={tridents[i]}
              halo={winner}
              damned={loser}
              flip={i === 1}
            />
          </div>
          {wakePhase === 'slap' && <div className="slap">👋</div>}
          {wakePhase === 'wake' && <div className="slap-hit">💥</div>}
        </div>

        <div className="toggle">
          <button className={styles[i] === 'throw' ? 'on' : ''} disabled={busy || over}
            onClick={() => setStyle(i, 'throw')}>🔱 Throw &amp; Mark</button>
          <button className={styles[i] === 'go' ? 'on' : ''} disabled={busy || over}
            onClick={() => setStyle(i, 'go')}>🚶 Go &amp; Mark</button>
        </div>
      </aside>
    );
  };

  return (
    <div className="game">
      <header className="game-header">
        <h1 className="game-title">Heaven <span>vs</span> Hell</h1>
        <div className="scoreboard">
          ☁ {players[0].name} <b>{scores.red}</b> · 🤝 <b>{scores.draws}</b> · <b>{scores.black}</b> {players[1].name} 🔥
        </div>
        <div className="header-btns">
          <button className="btn small" onClick={paused ? resume : pause}
            disabled={(!paused && (busy || over)) || !!wakePhase}>
            {paused ? '▶ Resume' : '⏸ Pause'}
          </button>
          <button className="btn small ghost" onClick={onRematch}>↻ Restart</button>
          <button className="btn small ghost" onClick={onMenu}>☰ Menu</button>
        </div>
      </header>

      <div className="scene" ref={sceneRef}>
        <div className="heaven" ref={heavenRef}>☁ HEAVEN ☁</div>

        <div className="arena">
          {renderSeat(0)}

          <section className="center">
            <p className="status">{status}</p>
            <div className="board-wrap">
              <Board
                board={board}
                winLine={winLine}
                target={target}
                canPlay={canPlay}
                turnSymbol={turn}
                onCell={handleCell}
                cellRefs={cellRefs}
              />
              {paused && <div className="pause-veil">💤 Paused</div>}
            </div>
            <PocketWatch
              players={players}
              times={times}
              active={over ? -1 : curIdx}
              paused={paused}
              over={over}
            />
          </section>

          {renderSeat(1)}
        </div>

        <div className="hell" ref={hellRef}>🔥 HELL 🔥</div>

        <div className="projectile" ref={(el) => (projRefs.current[0] = el)}>
          <TridentProjectile variant="silver" />
        </div>
        <div className="projectile" ref={(el) => (projRefs.current[1] = el)}>
          <TridentProjectile variant="gold" />
        </div>
      </div>

      {showBanner && result && (
        <div className="banner-wrap">
          <div className="banner">
            <h2>
              {result.type === 'win'
                ? `${players[playerIdx(result.symbol)].name} Ascends!`
                : 'Purgatory!'}
            </h2>
            <p>
              {result.type === 'win'
                ? `${players[1 - playerIdx(result.symbol)].name} has fallen into the fire…`
                : 'Neither demon could claim the heavens.'}
            </p>
            <p className="banner-times">
              ⏱ {players[0].name} {fmt(times[0])} · {players[1].name} {fmt(times[1])}
            </p>
            <div className="banner-btns">
                <button className="btn" onClick={onRematch}>Rematch</button>
                <button className="btn ghost" onClick={onMenu}>🏠 Home</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}