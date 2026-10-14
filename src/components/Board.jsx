import Mark from './Mark';

export default function Board({ board, winLine, target, canPlay, turnSymbol, onCell, cellRefs }) {
  return (
    <div className="board">
      {board.map((v, i) => (
        <button
          key={i}
          ref={(el) => (cellRefs.current[i] = el)}
          className={`cell ${v ? 'filled' : ''} ${winLine?.includes(i) ? 'win' : ''} ${target === i ? 'target' : ''}`}
          disabled={!canPlay || !!v}
          onClick={() => onCell(i)}
          aria-label={`cell ${i + 1}`}
        >
          {v && <Mark symbol={v} />}
          {!v && canPlay && (
            <span className="ghost"><Mark symbol={turnSymbol} /></span>
          )}
        </button>
      ))}
    </div>
  );
}